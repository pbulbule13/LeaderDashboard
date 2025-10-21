from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.stock_repository import StockRepository
from prompts.stock_prompts import STOCK_ANALYSIS_PROMPT

class StockAgent(BaseAgent):
    '''Agent for Stock Performance tile'''
    
    def __init__(self):
        super().__init__('StockAgent')
        self.repository = StockRepository()
        
    async def get_tile_data(self) -> Dict[str, Any]:
        '''Get stock metrics'''
        metrics = await self.repository.get_stock_metrics()
        
        return {
            'symbol': metrics.symbol,
            'current_price': metrics.current_price,
            'change': metrics.change,
            'change_percent': metrics.change_percent,
            'market_cap': metrics.market_cap,
            'day_high': metrics.day_high,
            'day_low': metrics.day_low,
            'volume': metrics.volume,
            'pe_ratio': metrics.pe_ratio,
            'timestamp': '2025-10-17T08:45:00Z'
        }
    
    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        '''Process stock queries'''
        tile_data = await self.get_tile_data()
        
        prompt = STOCK_ANALYSIS_PROMPT.format(
            query=query,
            stock_data=tile_data
        )
        
        messages = [
            {'role': 'system', 'content': prompt},
            {'role': 'user', 'content': query}
        ]
        
        response = await self.llm.ainvoke(messages)
        
        return {
            'agent': self.agent_name,
            'response': response.content,
            'data': tile_data
        }
    
    async def analyze_metric(self, metric_name: str) -> Dict[str, Any]:
        '''Analyze stock metrics'''
        tile_data = await self.get_tile_data()
        
        if metric_name == 'performance':
            return {
                'metric': 'daily_performance',
                'change': tile_data['change'],
                'change_percent': tile_data['change_percent'],
                'status': 'up' if tile_data['change'] > 0 else 'down'
            }
        
        return {}