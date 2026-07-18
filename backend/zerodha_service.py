from kiteconnect import KiteConnect
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class ZerodhaService:
    def __init__(self, api_key: str, api_secret: str, access_token: Optional[str] = None):
        self.api_key = api_key
        self.api_secret = api_secret
        self.kite = KiteConnect(api_key=api_key)
        if access_token:
            self.kite.set_access_token(access_token)

    def get_login_url(self) -> str:
        """Get Zerodha login URL for OAuth"""
        return self.kite.login_url()

    def generate_session(self, request_token: str) -> Dict:
        """Generate session from request token"""
        try:
            data = self.kite.generate_session(request_token, api_secret=self.api_secret)
            return data
        except Exception as e:
            logger.error(f"Failed to generate session: {str(e)}")
            raise

    def place_order(self, order_params: Dict) -> str:
        """Place an order on Zerodha"""
        try:
            order_id = self.kite.place_order(
                variety=self.kite.VARIETY_REGULAR,
                exchange=order_params['exchange'],
                tradingsymbol=order_params['tradingsymbol'],
                transaction_type=order_params['transaction_type'],
                quantity=order_params['quantity'],
                product=order_params['product'],
                order_type=order_params['order_type'],
                price=order_params.get('price'),
                trigger_price=order_params.get('trigger_price'),
                validity=order_params.get('validity', self.kite.VALIDITY_DAY)
            )
            return order_id
        except Exception as e:
            logger.error(f"Failed to place order: {str(e)}")
            raise

    def get_order_status(self, order_id: str) -> Dict:
        """Get order status from Zerodha"""
        try:
            orders = self.kite.orders()
            for order in orders:
                if order['order_id'] == order_id:
                    return order
            return None
        except Exception as e:
            logger.error(f"Failed to get order status: {str(e)}")
            raise

    def get_profile(self) -> Dict:
        """Get user profile from Zerodha"""
        try:
            return self.kite.profile()
        except Exception as e:
            logger.error(f"Failed to get profile: {str(e)}")
            raise

    def get_margins(self) -> Dict:
        """Get margin/balance information"""
        try:
            return self.kite.margins()
        except Exception as e:
            logger.error(f"Failed to get margins: {str(e)}")
            raise

    def get_positions(self) -> Dict:
        """Get open positions"""
        try:
            return self.kite.positions()
        except Exception as e:
            logger.error(f"Failed to get positions: {str(e)}")
            raise

    def get_orders_list(self) -> list:
        """Get all orders for the day"""
        try:
            return self.kite.orders()
        except Exception as e:
            logger.error(f"Failed to get orders: {str(e)}")
            raise

    @staticmethod
    def convert_nlb_to_zerodha(webhook_command: Dict) -> Dict:
        """Convert NextLevelBot syntax to Zerodha API format"""
        # Map product types
        product_map = {
            'INTRADAY': 'MIS',
            'CNC': 'CNC',
            'NRML': 'NRML'
        }

        # Map order types
        order_type_map = {
            'MARKET': 'MARKET',
            'LIMIT': 'LIMIT',
            'SL': 'SL',
            'SLL': 'SL-M'
        }

        # Build Zerodha order params
        order_params = {
            'exchange': webhook_command.get('E'),
            'tradingsymbol': webhook_command.get('TS'),
            'transaction_type': webhook_command.get('TT'),
            'quantity': int(webhook_command.get('Q', 1)),
            'product': product_map.get(webhook_command.get('P'), 'MIS'),
            'order_type': order_type_map.get(webhook_command.get('OT'), 'MARKET'),
            'validity': webhook_command.get('VL', 'DAY')
        }

        # Add price for LIMIT orders
        if order_params['order_type'] == 'LIMIT' and webhook_command.get('PR'):
            order_params['price'] = float(webhook_command.get('PR'))

        # Add trigger price for SL orders
        if order_params['order_type'] in ['SL', 'SL-M'] and webhook_command.get('TP'):
            order_params['trigger_price'] = float(webhook_command.get('TP'))

        return order_params
