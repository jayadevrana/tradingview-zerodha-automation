from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from bson import ObjectId
from typing import List
from datetime import datetime

from models import (
    UserCreate, UserLogin, UserResponse,
    BrokerConnectionCreate, BrokerConnectionResponse,
    OrderResponse, WebhookCommand
)
from auth import hash_password, verify_password, create_access_token, get_current_user_id
from zerodha_service import ZerodhaService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== Authentication Routes ====================

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = hash_password(user_data.password)
        
        # Create user
        user_dict = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed_password
        }
        
        result = await db.users.insert_one(user_dict)
        user_id = str(result.inserted_id)
        
        # Create access token
        token = create_access_token(data={"sub": user_id})
        
        return {
            "user": {
                "id": user_id,
                "email": user_data.email,
                "name": user_data.name
            },
            "token": token
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed")


@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    """Login user"""
    try:
        # Find user
        user = await db.users.find_one({"email": credentials.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not verify_password(credentials.password, user['password']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create access token
        token = create_access_token(data={"sub": str(user['_id'])})
        
        return {
            "user": {
                "id": str(user['_id']),
                "email": user['email'],
                "name": user['name']
            },
            "token": token
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed")


# ==================== Zerodha Routes ====================

@api_router.post("/zerodha/connect")
async def connect_zerodha(
    connection_data: BrokerConnectionCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Initiate Zerodha connection"""
    try:
        # Delete any existing pending connections for this user
        await db.broker_connections.delete_many({
            "user_id": ObjectId(user_id),
            "status": "pending"
        })
        
        # Create Zerodha service
        zerodha = ZerodhaService(
            api_key=connection_data.api_key,
            api_secret=connection_data.api_secret
        )
        
        # Save connection to database
        connection_dict = {
            "user_id": ObjectId(user_id),
            "broker": "Zerodha",
            "api_key": connection_data.api_key,
            "api_secret": connection_data.api_secret,
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        
        result = await db.broker_connections.insert_one(connection_dict)
        connection_id = str(result.inserted_id)
        
        # Get login URL (without state parameter as Zerodha doesn't preserve it reliably)
        login_url = zerodha.get_login_url()
        
        logger.info(f"Created pending Zerodha connection for user {user_id}, connection_id: {connection_id}")
        
        return {
            "login_url": login_url,
            "connection_id": connection_id
        }
    except Exception as e:
        logger.error(f"Zerodha connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/zerodha/callback")
async def zerodha_callback(request_token: str, action: str = "login", status: str = "success"):
    """Handle Zerodha OAuth callback"""
    try:
        logger.info(f"Zerodha callback received: request_token={request_token}, action={action}, status={status}")
        
        # Find the most recent pending connection
        connection = await db.broker_connections.find_one(
            {"status": "pending"},
            sort=[("_id", -1)]
        )
        
        if not connection:
            logger.error("No pending connection found")
            frontend_url = os.getenv("REACT_APP_FRONTEND_URL", "http://localhost:3000")
            return RedirectResponse(url=f"{frontend_url}/dashboard?error=no_pending_connection")
        
        # Create Zerodha service
        zerodha = ZerodhaService(
            api_key=connection['api_key'],
            api_secret=connection['api_secret']
        )
        
        try:
            # Generate session
            session_data = zerodha.generate_session(request_token)
            access_token = session_data['access_token']
            
            # Test the access token by fetching profile
            zerodha_test = ZerodhaService(
                api_key=connection['api_key'],
                api_secret=connection['api_secret'],
                access_token=access_token
            )
            profile = zerodha_test.get_profile()
            
            logger.info(f"Successfully validated access token for user {profile.get('user_id')}")
            
            # Update connection in database with validated token
            await db.broker_connections.update_one(
                {"_id": connection['_id']},
                {
                    "$set": {
                        "access_token": access_token,
                        "request_token": request_token,
                        "status": "connected",
                        "connected_at": datetime.utcnow(),
                        "zerodha_user_id": profile.get('user_id'),
                        "user_name": profile.get('user_name')
                    }
                }
            )
            
            logger.info(f"Successfully connected Zerodha account for user {connection['user_id']}")
            
            # Redirect to dashboard with success
            frontend_url = os.getenv("REACT_APP_FRONTEND_URL", "http://localhost:3000")
            return RedirectResponse(url=f"{frontend_url}/dashboard?success=zerodha_connected")
            
        except Exception as session_error:
            logger.error(f"Session generation failed: {str(session_error)}")
            # Mark connection as error
            await db.broker_connections.update_one(
                {"_id": connection['_id']},
                {"$set": {"status": "error", "error_message": str(session_error)}}
            )
            frontend_url = os.getenv("REACT_APP_FRONTEND_URL", "http://localhost:3000")
            return RedirectResponse(url=f"{frontend_url}/dashboard?error=session_failed")
            
    except Exception as e:
        logger.error(f"Zerodha callback error: {str(e)}")
        frontend_url = os.getenv("REACT_APP_FRONTEND_URL", "http://localhost:3000")
        return RedirectResponse(url=f"{frontend_url}/dashboard?error=callback_failed")


@api_router.get("/zerodha/connections")
async def get_connections(user_id: str = Depends(get_current_user_id)):
    """Get user's broker connections"""
    try:
        connections = await db.broker_connections.find(
            {"user_id": ObjectId(user_id)}
        ).to_list(100)
        
        result = []
        for conn in connections:
            result.append({
                "id": str(conn['_id']),
                "broker": conn['broker'],
                "api_key": conn['api_key'],
                "status": conn['status'],
                "connected_at": conn.get('connected_at')
            })
        
        return result
    except Exception as e:
        logger.error(f"Get connections error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.delete("/zerodha/connection/{connection_id}")
async def delete_connection(
    connection_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete a broker connection"""
    try:
        result = await db.broker_connections.delete_one({
            "_id": ObjectId(connection_id),
            "user_id": ObjectId(user_id)
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        return {"message": "Connection deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete connection error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/zerodha/account-info")
async def get_account_info(user_id: str = Depends(get_current_user_id)):
    """Get Zerodha account information including balance and positions"""
    try:
        # Get active connection
        connection = await db.broker_connections.find_one({
            "user_id": ObjectId(user_id),
            "status": "connected"
        })
        
        if not connection:
            raise HTTPException(status_code=400, detail="No active Zerodha connection found")
        
        # Create Zerodha service
        zerodha = ZerodhaService(
            api_key=connection['api_key'],
            api_secret=connection['api_secret'],
            access_token=connection['access_token']
        )
        
        try:
            # Get account info
            profile = zerodha.get_profile()
            margins = zerodha.get_margins()
            positions = zerodha.get_positions()
            orders = zerodha.get_orders_list()
            
            return {
                "profile": {
                    "user_id": profile.get('user_id'),
                    "user_name": profile.get('user_name'),
                    "email": profile.get('email'),
                    "broker": profile.get('broker')
                },
                "margins": {
                    "equity": margins.get('equity', {}),
                    "commodity": margins.get('commodity', {})
                },
                "positions": {
                    "net": positions.get('net', []),
                    "day": positions.get('day', [])
                },
                "orders": orders
            }
        except Exception as api_error:
            # If API call fails, token might be expired
            logger.error(f"Zerodha API error: {str(api_error)}")
            # Mark connection as error and require reconnection
            await db.broker_connections.update_one(
                {"_id": connection['_id']},
                {"$set": {"status": "error", "error_message": "Access token expired or invalid"}}
            )
            raise HTTPException(status_code=401, detail="Zerodha session expired. Please reconnect.")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get account info error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/zerodha/reconnect/{connection_id}")
async def reconnect_zerodha(
    connection_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Reconnect an existing Zerodha connection"""
    try:
        # Get the connection
        connection = await db.broker_connections.find_one({
            "_id": ObjectId(connection_id),
            "user_id": ObjectId(user_id)
        })
        
        if not connection:
            raise HTTPException(status_code=404, detail="Connection not found")
        
        # Delete any other pending connections for this user
        await db.broker_connections.delete_many({
            "user_id": ObjectId(user_id),
            "status": "pending",
            "_id": {"$ne": ObjectId(connection_id)}
        })
        
        # Update status to pending
        await db.broker_connections.update_one(
            {"_id": ObjectId(connection_id)},
            {"$set": {"status": "pending", "updated_at": datetime.utcnow()}}
        )
        
        # Create Zerodha service and get login URL
        zerodha = ZerodhaService(
            api_key=connection['api_key'],
            api_secret=connection['api_secret']
        )
        
        login_url = zerodha.get_login_url()
        
        logger.info(f"Reconnect initiated for user {user_id}, connection {connection_id}")
        
        return {
            "login_url": login_url,
            "connection_id": connection_id
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reconnect error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/zerodha/exit-all-positions")
async def exit_all_positions(user_id: str = Depends(get_current_user_id)):
    """Exit all open positions for user"""
    try:
        # Get active connection
        connection = await db.broker_connections.find_one({
            "user_id": ObjectId(user_id),
            "status": "connected"
        })
        
        if not connection:
            raise HTTPException(status_code=400, detail="No active Zerodha connection found")
        
        # Create Zerodha service
        zerodha = ZerodhaService(
            api_key=connection['api_key'],
            api_secret=connection['api_secret'],
            access_token=connection['access_token']
        )
        
        # Get positions
        positions = zerodha.get_positions()
        net_positions = positions.get('net', [])
        day_positions = positions.get('day', [])
        
        all_positions = net_positions + day_positions
        
        # Filter out CNC positions and closed positions
        open_positions = [
            pos for pos in all_positions 
            if pos.get('quantity', 0) != 0 and pos.get('product') != 'CNC'
        ]
        
        if not open_positions:
            return {
                "success": True,
                "message": "No open positions to exit",
                "positions_closed": 0
            }
        
        # Exit each position
        closed_orders = []
        failed_orders = []
        
        for position in open_positions:
            try:
                # Determine transaction type (reverse of current position)
                transaction_type = 'SELL' if position['quantity'] > 0 else 'BUY'
                
                order_params = {
                    'exchange': position['exchange'],
                    'tradingsymbol': position['tradingsymbol'],
                    'transaction_type': transaction_type,
                    'quantity': abs(position['quantity']),
                    'product': position['product'],
                    'order_type': 'MARKET',
                    'validity': 'DAY'
                }
                
                order_id = zerodha.place_order(order_params)
                
                # Save order to database
                order_dict = {
                    "user_id": ObjectId(user_id),
                    "broker_connection_id": connection['_id'],
                    "order_id": order_id,
                    "symbol": position['tradingsymbol'],
                    "exchange": position['exchange'],
                    "transaction_type": transaction_type,
                    "quantity": abs(position['quantity']),
                    "order_type": "MARKET",
                    "product": position['product'],
                    "validity": "DAY",
                    "status": "PENDING",
                    "webhook_payload": {"exit_all": True}
                }
                
                await db.orders.insert_one(order_dict)
                
                closed_orders.append({
                    "symbol": position['tradingsymbol'],
                    "order_id": order_id,
                    "quantity": abs(position['quantity'])
                })
                
            except Exception as e:
                logger.error(f"Failed to exit position {position['tradingsymbol']}: {str(e)}")
                failed_orders.append({
                    "symbol": position['tradingsymbol'],
                    "error": str(e)
                })
        
        return {
            "success": True,
            "message": f"Exit orders placed for {len(closed_orders)} positions",
            "positions_closed": len(closed_orders),
            "positions_failed": len(failed_orders),
            "closed_orders": closed_orders,
            "failed_orders": failed_orders
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Exit all positions error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Webhook Routes ====================

@api_router.post("/webhook/{user_id}")
async def webhook_handler(user_id: str, request: Request):
    """Handle TradingView webhook"""
    try:
        # Parse webhook payload
        payload = await request.json()
        
        # Handle both single command and array of commands
        commands = payload if isinstance(payload, list) else [payload]
        
        results = []
        
        for command in commands:
            try:
                # Validate user exists
                user = await db.users.find_one({"_id": ObjectId(user_id)})
                if not user:
                    raise HTTPException(status_code=404, detail="User not found")
                
                # Get active Zerodha connection
                connection = await db.broker_connections.find_one({
                    "user_id": ObjectId(user_id),
                    "status": "connected"
                })
                
                if not connection:
                    raise HTTPException(
                        status_code=400,
                        detail="No active Zerodha connection found"
                    )
                
                # Create Zerodha service
                zerodha = ZerodhaService(
                    api_key=connection['api_key'],
                    api_secret=connection['api_secret'],
                    access_token=connection['access_token']
                )
                
                # Convert NLB syntax to Zerodha format
                order_params = ZerodhaService.convert_nlb_to_zerodha(command)
                
                # Place order
                order_id = zerodha.place_order(order_params)
                
                # Save order to database
                order_dict = {
                    "user_id": ObjectId(user_id),
                    "broker_connection_id": connection['_id'],
                    "order_id": order_id,
                    "symbol": command.get('TS'),
                    "exchange": command.get('E'),
                    "transaction_type": command.get('TT'),
                    "quantity": int(command.get('Q', 1)),
                    "order_type": command.get('OT'),
                    "product": order_params['product'],
                    "price": order_params.get('price'),
                    "trigger_price": order_params.get('trigger_price'),
                    "validity": command.get('VL', 'DAY'),
                    "status": "PENDING",
                    "webhook_payload": command
                }
                
                await db.orders.insert_one(order_dict)
                
                results.append({
                    "status": "success",
                    "order_id": order_id,
                    "symbol": command.get('TS')
                })
                
            except Exception as e:
                logger.error(f"Order placement error: {str(e)}")
                results.append({
                    "status": "error",
                    "message": str(e),
                    "symbol": command.get('TS')
                })
        
        return {"results": results}
        
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Orders Routes ====================

@api_router.get("/orders")
async def get_orders(user_id: str = Depends(get_current_user_id)):
    """Get user's orders"""
    try:
        orders = await db.orders.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).to_list(100)
        
        result = []
        for order in orders:
            result.append({
                "id": order.get('order_id', str(order['_id'])),
                "timestamp": order.get('created_at', '').isoformat() if order.get('created_at') else '',
                "symbol": order['symbol'],
                "exchange": order['exchange'],
                "type": order['transaction_type'],
                "quantity": order['quantity'],
                "order_type": order['order_type'],
                "product": order['product'],
                "status": order['status'],
                "price": order.get('price')
            })
        
        return result
    except Exception as e:
        logger.error(f"Get orders error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Test route
@api_router.get("/")
async def root():
    return {"message": "NextLevelBot API - Algo Trading Platform"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
