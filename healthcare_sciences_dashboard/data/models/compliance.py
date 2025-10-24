from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class ProductReturns(BaseModel):
    """Returns data for a specific product"""
    product_name: str
    kits_returned: int
    total_orders: int
    return_rate: float = 0.0

    def calculate_return_rate(self):
        """Calculate return rate percentage"""
        if self.total_orders > 0:
            self.return_rate = (self.kits_returned / self.total_orders) * 100
        return self.return_rate

class ReturnReason(BaseModel):
    """Reasons for returns"""
    reason: str
    count: int
    percentage: float = 0.0

class ComplianceMetrics(BaseModel):
    """Compliance and Returns data model"""
    total_returns: int = 0
    total_orders: int = 0
    overall_return_rate: float = 0.0

    product_returns: List[ProductReturns] = []
    return_reasons: List[ReturnReason] = []

    compliance_score: float = 0.0
    follow_up_actions: List[str] = []

    timestamp: str = datetime.now().isoformat()

    def calculate_overall_return_rate(self):
        """Calculate overall return rate"""
        if self.total_orders > 0:
            self.overall_return_rate = (self.total_returns / self.total_orders) * 100
        return self.overall_return_rate
