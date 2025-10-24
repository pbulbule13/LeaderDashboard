from pydantic import BaseModel
from typing import Dict, List
from datetime import datetime

class GrowthMetrics(BaseModel):
    """Growth metrics for different time periods"""
    dod: float = 0.0  # Day over Day
    wow: float = 0.0  # Week over Week
    mom: float = 0.0  # Month over Month
    qoq: float = 0.0  # Quarter over Quarter
    yoy: float = 0.0  # Year over Year

class OrderVolumePeriod(BaseModel):
    """Order volume for a specific period"""
    period: str
    count: int
    growth: float = 0.0

class ProductLineOrders(BaseModel):
    """Orders breakdown by product line"""
    product_line: str
    orders: int
    percentage: float = 0.0

class OrderVolume(BaseModel):
    """Order Volume and Growth data model"""
    daily_orders: int = 0
    weekly_orders: int = 0
    monthly_orders: int = 0
    quarterly_orders: int = 0
    yearly_orders: int = 0

    growth_metrics: GrowthMetrics

    product_lines: List[ProductLineOrders] = []

    trend_data: List[OrderVolumePeriod] = []

    timestamp: str = datetime.now().isoformat()
