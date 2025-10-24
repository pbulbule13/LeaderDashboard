from pydantic import BaseModel
from typing import List
from datetime import datetime

class ForecastPeriod(BaseModel):
    """Forecast for a specific period"""
    period: str  # Q1 2025, Q2 2025, etc.
    projected_orders: int
    projected_revenue: float
    confidence_low: float = 0.0
    confidence_high: float = 0.0
    confidence_level: float = 85.0  # percentage

class ProductForecast(BaseModel):
    """Forecast by product line"""
    product_name: str
    projected_orders: int
    projected_revenue: float
    growth_projection: float = 0.0

class HistoricalTrend(BaseModel):
    """Historical data for trend analysis"""
    period: str
    actual_orders: int
    actual_revenue: float

class Forecast(BaseModel):
    """Forecasting Dashboard data model"""
    # Overall projections
    next_quarter_orders: int = 0
    next_quarter_revenue: float = 0.0
    next_year_orders: int = 0
    next_year_revenue: float = 0.0

    # Detailed forecasts
    quarterly_forecasts: List[ForecastPeriod] = []
    product_forecasts: List[ProductForecast] = []

    # Historical data for comparison
    historical_data: List[HistoricalTrend] = []

    # Confidence and methodology
    forecast_confidence: float = 85.0
    methodology: str = "Time series analysis with seasonal adjustment"
    last_updated: str = datetime.now().isoformat()

    # Key assumptions
    assumptions: List[str] = []
    risk_factors: List[str] = []

    timestamp: str = datetime.now().isoformat()
