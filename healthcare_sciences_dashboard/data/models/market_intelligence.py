from pydantic import BaseModel
from typing import List
from datetime import datetime

class NewsItem(BaseModel):
    """News article or update"""
    title: str
    summary: str
    source: str
    category: str  # regulatory, competitor, industry, product_launch
    importance: str = "medium"  # low, medium, high, critical
    date: str
    url: str = ""

class CompetitorUpdate(BaseModel):
    """Competitor activity tracking"""
    competitor_name: str
    update_type: str  # product_launch, regulatory_approval, market_expansion, financial
    description: str
    impact_level: str = "medium"  # low, medium, high
    date: str

class RegulatoryChange(BaseModel):
    """Regulatory updates"""
    regulation_name: str
    description: str
    effective_date: str
    impact_assessment: str
    status: str = "monitoring"  # monitoring, action_required, implemented

class IndustryTrend(BaseModel):
    """Healthcare industry trends"""
    trend_name: str
    description: str
    category: str  # technology, market, regulatory, clinical
    relevance_score: float = 0.0  # 0-100

class MarketIntelligence(BaseModel):
    """Market Intelligence Dashboard data model"""
    # News feed
    latest_news: List[NewsItem] = []

    # Competitor intelligence
    competitor_updates: List[CompetitorUpdate] = []

    # Regulatory tracking
    regulatory_changes: List[RegulatoryChange] = []

    # Industry trends
    industry_trends: List[IndustryTrend] = []

    # Summary metrics
    total_news_items: int = 0
    high_priority_items: int = 0
    action_items: int = 0

    # Alerts
    critical_alerts: List[str] = []

    last_refresh: str = datetime.now().isoformat()
    timestamp: str = datetime.now().isoformat()
