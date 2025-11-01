from typing import List
from ..models.product import Product, ProductMetrics

class ProductsRepository:
    """Repository for products data"""
    
    async def get_current_products(self) -> List[Product]:
        """Get current month products data"""
        # TODO: Replace with actual API/database calls
        products = [
            Product(name='Cologuard', orders=456789, returned=234, revenue=89500000, margin=78),
            # Product(
            #     name="Cologuard",
            #     orders_received=456789,
            #     orders_returned=234,
            #     revenue=89500000,
            #     margin=78.0
            # ),
            Product(
                name="Oncotype DX",
                # orders_received=234567,
                orders=234567,
                # orders_returned=145,
                returned=145,
                revenue=67800000,
                margin=82.0
            ),
            Product(
                name="PreventionGenetics",
                # orders_received=123456,
                orders=123456,
                # orders_returned=89,
                returned=89,
                revenue=34200000,
                margin=75.0
            ),
            Product(
                name="Cologuard Plus",
                # orders_received=89012,
                # orders_returned=67,
                orders=89012,
                returned=67,
                revenue=28900000,
                margin=76.0
            )
        ]
        
        # Calculate return rates
        for product in products:
            product.calculate_return_rate()
        
        return products
    
    async def get_product_by_name(self, name: str) -> Product:
        """Get specific product data"""
        products = await self.get_current_products()
        return next((p for p in products if p.name == name), None)
