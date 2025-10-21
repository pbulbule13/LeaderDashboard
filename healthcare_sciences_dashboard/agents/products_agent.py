from typing import Dict, Any
from .base_agent import BaseAgent
from data.repositories.products_repository import ProductsRepository
from prompts.products_prompts import PRODUCTS_ANALYSIS_PROMPT

class ProductsAgent(BaseAgent):
    """Agent responsible for Products & Orders tile"""
    
    def __init__(self):
        super().__init__("ProductsAgent")
        self.repository = ProductsRepository()
        
    async def get_tile_data(self) -> Dict[str, Any]:
        """Get current products data"""
        # Fetch from repository
        products = await self.repository.get_current_products()
        
        return {
            "products": products,
            "total_orders": sum(p.orders_received for p in products),
            "total_revenue": sum(p.revenue for p in products),
            "timestamp": "2025-10-17T08:45:00Z"
        }
    
    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process queries about products"""
        tile_data = await self.get_tile_data()
        
        prompt = PRODUCTS_ANALYSIS_PROMPT.format(
            query=query,
            products_data=tile_data
        )
        
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": query}
        ]
        
        response = await self.llm.ainvoke(messages)
        
        return {
            "agent": self.agent_name,
            "response": response.content,
            "data": tile_data
        }
    
    async def analyze_metric(self, metric_name: str) -> Dict[str, Any]:
        """Analyze specific product metrics"""
        tile_data = await self.get_tile_data()
        
        if metric_name == "top_performer":
            top_product = max(
                tile_data["products"],
                key=lambda p: p.revenue
            )
            return {
                "metric": "top_performer",
                "product": top_product.name,
                "revenue": top_product.revenue
            }
        
        # Add more metric analyses as needed
        return {}