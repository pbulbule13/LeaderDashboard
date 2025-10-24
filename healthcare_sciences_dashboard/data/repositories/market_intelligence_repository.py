from data.models.market_intelligence import MarketIntelligence, NewsItem, CompetitorUpdate, RegulatoryChange, IndustryTrend
from datetime import datetime, timedelta

class MarketIntelligenceRepository:
    """Repository for market intelligence data"""

    async def get_market_intelligence_data(self) -> MarketIntelligence:
        """Get market intelligence and competitive data"""
        today = datetime.now()

        latest_news = [
            NewsItem(
                title="FDA Approves New Colorectal Cancer Screening Guidelines",
                summary="FDA updates screening recommendations for average-risk individuals",
                source="FDA News",
                category="regulatory",
                importance="high",
                date=(today - timedelta(days=2)).strftime("%Y-%m-%d"),
                url="https://fda.gov/news"
            ),
            NewsItem(
                title="Competitor Launches AI-Enhanced Diagnostic Platform",
                summary="Major competitor announces AI integration in diagnostic workflow",
                source="Healthcare IT News",
                category="competitor",
                importance="medium",
                date=(today - timedelta(days=5)).strftime("%Y-%m-%d"),
                url=""
            ),
        ]

        competitor_updates = [
            CompetitorUpdate(
                competitor_name="Grail Bio",
                update_type="product_launch",
                description="Launched multi-cancer early detection test expansion",
                impact_level="high",
                date=(today - timedelta(days=7)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="Guardant Health",
                update_type="regulatory_approval",
                description="Received FDA breakthrough device designation",
                impact_level="medium",
                date=(today - timedelta(days=14)).strftime("%Y-%m-%d")
            ),
        ]

        regulatory_changes = [
            RegulatoryChange(
                regulation_name="CMS Reimbursement Update 2025",
                description="Updated reimbursement rates for molecular diagnostics",
                effective_date="2025-07-01",
                impact_assessment="Positive impact on reimbursement rates for key products",
                status="monitoring"
            ),
        ]

        industry_trends = [
            IndustryTrend(
                trend_name="AI-Powered Diagnostics Growth",
                description="Increasing adoption of AI and machine learning in diagnostic workflows",
                category="technology",
                relevance_score=85.0
            ),
            IndustryTrend(
                trend_name="Value-Based Care Expansion",
                description="Shift towards value-based reimbursement models",
                category="market",
                relevance_score=78.0
            ),
        ]

        return MarketIntelligence(
            latest_news=latest_news,
            competitor_updates=competitor_updates,
            regulatory_changes=regulatory_changes,
            industry_trends=industry_trends,
            total_news_items=len(latest_news),
            high_priority_items=sum(1 for n in latest_news if n.importance == "high"),
            action_items=1,
            critical_alerts=["FDA guideline update requires review of marketing materials"]
        )
