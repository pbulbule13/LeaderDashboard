from pydantic import BaseModel
from typing import Optional

class BudgetItem(BaseModel):
    department: str
    allocated: float
    spent: float
    remaining: float
    utilization_percent: Optional[float] = None
    
    def calculate_utilization(self):
        if self.allocated > 0:
            self.utilization_percent = (self.spent / self.allocated) * 100
        return self.utilization_percent

class QuarterBudget(BaseModel):
    quarter: str  # 'Q4 2025', 'Q1 2026'
    items: list[BudgetItem]
    total_allocated: float
    total_spent: float
    total_remaining: float