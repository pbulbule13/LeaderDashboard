from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    name: str
    orders_received: int
    orders_returned: int
    revenue: float
    margin: float
    return_rate: Optional[float] = None
    
    def calculate_return_rate(self):
        if self.orders_received > 0:
            self.return_rate = (self.orders_returned / self.orders_received) * 100
        return self.return_rate

class ProductMetrics(BaseModel):
    period: str  # "October 2025", "Q4 2025"
    products: list[Product]
    total_orders: int
    total_revenue: float