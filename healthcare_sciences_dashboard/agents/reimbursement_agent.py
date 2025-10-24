from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.reimbursement_repository import ReimbursementRepository

class ReimbursementAgent(BaseAgent):
    """Agent responsible for Reimbursement Metrics tile"""

    def __init__(self):
        super().__init__("ReimbursementAgent")
        self.repository = ReimbursementRepository()

    async def get_tile_data(self) -> Dict[str, Any]:
        """Get reimbursement metrics data"""
        data = await self.repository.get_reimbursement_data()
        return data.model_dump()

    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process queries about reimbursement"""
        tile_data = await self.get_tile_data()

        messages = [
            {"role": "system", "content": "You are an AI assistant analyzing insurance reimbursement metrics for healthcare diagnostics."},
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
