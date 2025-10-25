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
                summary="FDA updates screening recommendations for average-risk individuals starting at age 45",
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
            NewsItem(
                title="CMS Expands Coverage for Molecular Diagnostic Tests",
                summary="Medicare announces broader coverage for precision medicine diagnostics",
                source="CMS.gov",
                category="reimbursement",
                importance="high",
                date=(today - timedelta(days=3)).strftime("%Y-%m-%d"),
                url=""
            ),
            NewsItem(
                title="Breakthrough in Multi-Cancer Early Detection",
                summary="New research shows promise in detecting multiple cancer types from single blood test",
                source="Nature Medicine",
                category="research",
                importance="high",
                date=(today - timedelta(days=7)).strftime("%Y-%m-%d"),
                url=""
            ),
            NewsItem(
                title="Healthcare Consolidation Accelerates",
                summary="Major health systems announce merger, impacting diagnostic testing contracts",
                source="Modern Healthcare",
                category="market",
                importance="medium",
                date=(today - timedelta(days=10)).strftime("%Y-%m-%d"),
                url=""
            ),
            NewsItem(
                title="New Liquid Biopsy Technology Shows Promise",
                summary="Clinical trial results demonstrate improved cancer detection sensitivity",
                source="Journal of Clinical Oncology",
                category="research",
                importance="medium",
                date=(today - timedelta(days=12)).strftime("%Y-%m-%d"),
                url=""
            ),
            NewsItem(
                title="Digital Health Investment Reaches Record High",
                summary="Q3 2025 sees unprecedented investment in diagnostic technology companies",
                source="Rock Health",
                category="market",
                importance="medium",
                date=(today - timedelta(days=14)).strftime("%Y-%m-%d"),
                url=""
            ),
            NewsItem(
                title="New Quality Standards for Genomic Testing",
                summary="CAP releases updated accreditation requirements for genomic laboratories",
                source="CAP Today",
                category="regulatory",
                importance="medium",
                date=(today - timedelta(days=16)).strftime("%Y-%m-%d"),
                url=""
            ),
            NewsItem(
                title="Telehealth Integration with Diagnostics Expanding",
                summary="Major telehealth platforms partner with diagnostic companies for home testing",
                source="Healthcare Dive",
                category="technology",
                importance="low",
                date=(today - timedelta(days=18)).strftime("%Y-%m-%d"),
                url=""
            ),
            NewsItem(
                title="Patient Access Programs Gain Traction",
                summary="Industry report shows increasing adoption of financial assistance programs",
                source="Health Affairs",
                category="market",
                importance="low",
                date=(today - timedelta(days=20)).strftime("%Y-%m-%d"),
                url=""
            ),
        ]

        competitor_updates = [
            CompetitorUpdate(
                competitor_name="Grail Bio",
                update_type="product_launch",
                description="Launched multi-cancer early detection test expansion into 15 new markets",
                impact_level="high",
                date=(today - timedelta(days=7)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="Guardant Health",
                update_type="regulatory_approval",
                description="Received FDA breakthrough device designation for liquid biopsy platform",
                impact_level="medium",
                date=(today - timedelta(days=14)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="Tempus Labs",
                update_type="partnership",
                description="Announced strategic partnership with major health system for precision oncology",
                impact_level="medium",
                date=(today - timedelta(days=9)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="Foundation Medicine",
                update_type="market_expansion",
                description="Expanding international presence with new European distribution agreements",
                impact_level="low",
                date=(today - timedelta(days=11)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="Natera",
                update_type="product_launch",
                description="Introduced new prenatal screening test with enhanced sensitivity",
                impact_level="medium",
                date=(today - timedelta(days=13)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="Quest Diagnostics",
                update_type="acquisition",
                description="Acquired specialty testing laboratory to expand oncology capabilities",
                impact_level="high",
                date=(today - timedelta(days=15)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="LabCorp",
                update_type="technology",
                description="Implementing AI-driven test interpretation across core testing menu",
                impact_level="medium",
                date=(today - timedelta(days=17)).strftime("%Y-%m-%d")
            ),
            CompetitorUpdate(
                competitor_name="Invitae",
                update_type="pricing",
                description="Announced reduced pricing for comprehensive genetic testing panels",
                impact_level="high",
                date=(today - timedelta(days=19)).strftime("%Y-%m-%d")
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
