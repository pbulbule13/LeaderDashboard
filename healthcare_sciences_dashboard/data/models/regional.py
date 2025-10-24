from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime

class TerritoryPerformance(BaseModel):
    """Performance metrics for a territory"""
    territory_name: str
    region: str  # Northeast, Northwest, Southeast, Southwest, Midwest, West
    orders: int
    revenue: float
    growth_rate: float = 0.0
    market_share: float = 0.0
    rank: int = 0

class RegionalComparison(BaseModel):
    """Regional comparison data"""
    region: str
    total_orders: int
    total_revenue: float
    average_growth: float
    territories_count: int

class GeoCoordinate(BaseModel):
    """Geographic coordinates for mapping"""
    latitude: float
    longitude: float

class TerritoryMapData(BaseModel):
    """Map visualization data"""
    territory: str
    coordinates: GeoCoordinate
    value: float  # orders or revenue
    color_intensity: str = "medium"  # low, medium, high

class RegionalPerformance(BaseModel):
    """Regional/Territory Performance data model"""
    territories: List[TerritoryPerformance] = []
    regional_summary: List[RegionalComparison] = []
    map_data: List[TerritoryMapData] = []

    top_performing_territory: str = ""
    lowest_performing_territory: str = ""

    total_territories: int = 0
    coverage_percentage: float = 100.0

    timestamp: str = datetime.now().isoformat()
