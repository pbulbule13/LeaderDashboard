from typing import Dict, Any
from graph.graph_builder import create_dashboard_graph
from graph.state import DashboardState

class DashboardOrchestrator:
    """Main orchestrator for the dashboard agent system"""
    
    def __init__(self):
        self.graph = create_dashboard_graph()
        pass

    # CRITICAL: This must be an async function.
    async def run_query(self, query: str):
        """Mock method for running the user query."""
        # Ensure it returns a dictionary that the API endpoint expects to serialize.
        return {"result": f"Mock response for: {query}", "status": "processed_mock"}
    
    async def process_query(self, query: str, context: Dict[str, Any] | None = None) -> str:
        """Process a user query through the agent graph"""
        initial_state: DashboardState = {
            "messages": [],
            "user_query": query,
            "target_agent": "",
            "context": context or {},
            "products_data": {},
            "revenue_data": {},
            "budget_data": {},
            "support_data": {},
            "workforce_data": {},
            "stock_data": {},
            "final_response": "",
            "error": ""
        }
        
        result = await self.graph.ainvoke(initial_state)
        return result["final_response"]