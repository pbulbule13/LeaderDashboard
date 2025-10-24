from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class CostCategory(BaseModel):
    """Cost breakdown by category"""
    category: str
    amount: float
    percentage: float = 0.0
    trend: str = "stable"  # up, down, stable

class MonthlyCost(BaseModel):
    """Monthly cost data"""
    month: str
    total_cost: float
    change_percentage: float = 0.0

class OperatingCosts(BaseModel):
    """Operating Costs data model"""
    # Main cost categories
    aws_cloud_costs: float = 0.0
    salary_expenses: float = 0.0
    lab_facility_costs: float = 0.0
    other_costs: float = 0.0

    total_operating_costs: float = 0.0

    cost_breakdown: List[CostCategory] = []

    monthly_trend: List[MonthlyCost] = []

    major_cost_drivers: List[str] = []

    cost_efficiency_score: float = 0.0

    period: str = "monthly"  # daily, weekly, monthly, quarterly

    timestamp: str = datetime.now().isoformat()

    def calculate_total(self):
        """Calculate total operating costs"""
        self.total_operating_costs = (
            self.aws_cloud_costs +
            self.salary_expenses +
            self.lab_facility_costs +
            self.other_costs
        )
        return self.total_operating_costs

    def calculate_percentages(self):
        """Calculate percentage breakdown"""
        total = self.calculate_total()
        if total > 0:
            for category in self.cost_breakdown:
                category.percentage = (category.amount / total) * 100
