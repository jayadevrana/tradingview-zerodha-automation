from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, _schema_generator, _field_source_type, _model):
        return {"type": "string"}


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    email: EmailStr
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class UserResponse(BaseModel):
    id: str
    name: str
    email: str


class BrokerConnectionCreate(BaseModel):
    api_key: str
    api_secret: str


class BrokerConnection(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    broker: str = "Zerodha"
    api_key: str
    api_secret: str
    access_token: Optional[str] = None
    request_token: Optional[str] = None
    status: str = "pending"  # pending, connected, error
    connected_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class BrokerConnectionResponse(BaseModel):
    id: str
    broker: str
    api_key: str
    status: str
    connected_at: Optional[str] = None


class Order(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    broker_connection_id: PyObjectId
    order_id: Optional[str] = None  # from Zerodha
    symbol: str
    exchange: str
    transaction_type: str  # BUY, SELL, EXIT
    quantity: int
    order_type: str  # MARKET, LIMIT, SL, SLL
    product: str  # MIS, CNC, NRML
    price: Optional[float] = None
    trigger_price: Optional[float] = None
    validity: str  # DAY, IOC
    status: str = "PENDING"  # PENDING, COMPLETE, REJECTED, CANCELLED
    status_message: Optional[str] = None
    webhook_payload: dict = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class OrderResponse(BaseModel):
    id: str
    timestamp: str
    symbol: str
    exchange: str
    type: str
    quantity: int
    order_type: str
    product: str
    status: str
    price: Optional[float] = None


class WebhookCommand(BaseModel):
    TT: str  # Transaction Type: BUY, SELL, EXIT
    E: str   # Exchange: NSE, BSE, NFO, MCX, CDS
    TS: str  # Trading Symbol
    Q: str   # Quantity
    OT: str  # Order Type: MARKET, LIMIT, SL, SLL
    P: str   # Product: INTRADAY, CNC, NRML
    PR: Optional[str] = None  # Price for LIMIT orders
    TP: Optional[str] = None  # Trigger Price for SL orders
    VL: str = "DAY"  # Validity: DAY, IOC
    AT: str = "ZERODHA"  # API Type
