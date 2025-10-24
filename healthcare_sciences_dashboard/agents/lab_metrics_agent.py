from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.lab_metrics_repository import LabMetricsRepository

class LabMetricsAgent(BaseAgent):
    """Agent responsible for Lab Metrics tile"""

    def __init__(self):
        super().__init__("LabMetricsAgent")
        self.repository = LabMetricsRepository()

    async def get_tile_data(self) -> Dict[str, Any]:
        """Get lab metrics data"""
        data = await self.repository.get_lab_metrics_data()
        return data.model_dump()

    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process queries about lab metrics"""
        tile_data = await self.get_tile_data()

        messages = [
            {"role": "system", "content": "You are an AI assistant analyzing laboratory performance metrics including turnaround time and efficiency."},
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
