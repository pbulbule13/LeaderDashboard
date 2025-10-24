from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.market_intelligence_repository import MarketIntelligenceRepository

class MarketIntelligenceAgent(BaseAgent):
    """Agent responsible for Market Intelligence tile"""

    def __init__(self):
        super().__init__("MarketIntelligenceAgent")
        self.repository = MarketIntelligenceRepository()

    async def get_tile_data(self) -> Dict[str, Any]:
        """Get market intelligence data"""
        data = await self.repository.get_market_intelligence_data()
        return data.model_dump()

    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process queries about market intelligence"""
        tile_data = await self.get_tile_data()

        messages = [
            {"role": "system", "content": "You are an AI assistant analyzing market intelligence, competitive updates, and industry trends in healthcare diagnostics."},
            {"role": "user", "content": f"Based on this data: {tile_data}\n\nQuestion: {query}"}
        ]

        response = await self.llm.ainvoke(messages)

        return {
            "agent": self.agent_name,
            "response": response.content,
            "data": tile_data
        }

    async def analyze_metric(self, metric_name: str) -> Dict[str, Any]:
        """Analyze specific metrics"""
        tile_data = await self.get_tile_data()
        return {"metric": metric_name, "data": tile_data}
