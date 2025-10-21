from typing import Optional, Any
from dataclasses import dataclass
from pydantic import BaseModel, ConfigDict

# --- ProductMetrics Model ---
# This model captures the quantitative data shown on the dashboard
@dataclass
class ProductMetrics:
    """Represents core metrics for a single healthcare product."""
    orders: int
    returned: int
    revenue: int
    margin: int

# --- Product Model (The main entity) ---
class Product(BaseModel):
    """Product model with flexible attribute initialization"""
    
    # Configure Pydantic to allow extra fields
    model_config = ConfigDict(
        extra='allow',
        arbitrary_types_allowed=True
    )
    
    # Core fields with defaults
    name: str = ""
    orders: int = 0
    returned: int = 0
    units_sold: int = 0
    returns: int = 0
    revenue: float = 0.0
    margin: float = 0.0
    
    def model_post_init(self, __context: Any) -> None:
        """Post-initialization to set intelligent defaults"""
        # If units_sold not set, use orders
        if self.units_sold == 0 and self.orders > 0:
            self.units_sold = self.orders
        
        # If returns not set, use returned
        if self.returns == 0 and self.returned > 0:
            self.returns = self.returned
    
    @property
    def orders_received(self) -> int:
        """Alias for orders attribute to maintain compatibility"""
        return self.orders
    
    def calculate_return_rate(self) -> float:
        """Calculate the return rate for this product"""
        units_sold = self.units_sold or self.orders
        returns = self.returns or self.returned
        
        if units_sold == 0:
            return 0.0
        return (returns / units_sold) * 100