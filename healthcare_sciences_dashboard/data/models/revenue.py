from pydantic import BaseModel
from typing import Optional
from datetime import date

class RevenueRecord(BaseModel):
    period: str  # 'Oct 2025', 'Q4 2025'
    actual: float
    projected: float
    variance: Optional[float] = None
    variance_percent: Optional[float] = None
    
    def calculate_variance(self):
        self.variance = self.actual - self.projected
        if self.projected > 0:
            self.variance_percent = (self.variance / self.projected) * 100
        return self.variance_percent

class RevenueMetrics(BaseModel):
    records: list[RevenueRecord]
    total_actual: float
    total_projected: float
    overall_performance: float  # % of target