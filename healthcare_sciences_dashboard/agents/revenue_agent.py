from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.revenue_repository import RevenueRepository
from config.prompts_config import get_prompt

class RevenueAgent(BaseAgent):
    '''Agent responsible for Revenue Performance tile'''
    
    def __init__(self):
        super().__init__('RevenueAgent')
        self.repository = RevenueRepository()
        
    async def get_tile_data(self) -> Dict[str, Any]:
        '''Get current revenue data'''
        metrics = await self.repository.get_current_revenue()
        
        return {
            'records': [
                {
                    'period': r.period,
                    'actual': r.actual,
                    'projected': r.projected,
                    'variance': r.variance,
                    'variance_percent': r.variance_percent
                }
                for r in metrics.records
            ],
            'total_actual': metrics.total_actual,
            'total_projected': metrics.total_projected,
            'overall_performance': metrics.overall_performance,
            'timestamp': '2025-10-17T08:45:00Z'
        }
    
    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        '''Process queries about revenue'''
        tile_data = await self.get_tile_data()

        prompt = get_prompt(
            agent_type='revenue',
            prompt_type='analysis',
            query=query,
            revenue_data=tile_data
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
        '''Analyze specific revenue metrics'''
        tile_data = await self.get_tile_data()
        
        if metric_name == 'performance':
            return {
                'metric': 'overall_performance',
                'value': tile_data['overall_performance'],
                'status': 'on_track' if tile_data['overall_performance'] >= 95 else 'at_risk'
            }
        elif metric_name == 'variance':
            current_month = tile_data['records'][0]
            return {
                'metric': 'variance',
                'period': current_month['period'],
                'variance': current_month['variance'],
                'variance_percent': current_month['variance_percent']
            }
        
        return {}