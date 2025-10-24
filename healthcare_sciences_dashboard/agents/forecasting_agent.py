from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.forecasting_repository import ForecastingRepository

class ForecastingAgent(BaseAgent):
    """Agent responsible for Forecasting tile"""

    def __init__(self):
        super().__init__("ForecastingAgent")
        self.repository = ForecastingRepository()

    async def get_tile_data(self) -> Dict[str, Any]:
        """Get forecasting data"""
        data = await self.repository.get_forecasting_data()
        return data.model_dump()

    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process queries about forecasting"""
        tile_data = await self.get_tile_data()

        messages = [
            {"role": "system", "content": "You are an AI assistant analyzing business forecasting and projections for orders and revenue."},
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
