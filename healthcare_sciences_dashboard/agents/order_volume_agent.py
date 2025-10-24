from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.order_volume_repository import OrderVolumeRepository

class OrderVolumeAgent(BaseAgent):
    """Agent responsible for Order Volume & Growth tile"""

    def __init__(self):
        super().__init__("OrderVolumeAgent")
        self.repository = OrderVolumeRepository()

    async def get_tile_data(self) -> Dict[str, Any]:
        """Get order volume and growth data"""
        data = await self.repository.get_order_volume_data()
        return data.model_dump()

    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process queries about order volume"""
        tile_data = await self.get_tile_data()

        messages = [
            {"role": "system", "content": "You are an AI assistant analyzing order volume and growth metrics for a healthcare diagnostics company."},
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
