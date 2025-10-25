from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.support_repository import SupportRepository
from config.prompts_config import get_prompt

class SupportAgent(BaseAgent):
    '''Agent for Support Operations tile'''
    
    def __init__(self):
        super().__init__('SupportAgent')
        self.repository = SupportRepository()
        
    async def get_tile_data(self) -> Dict[str, Any]:
        '''Get support metrics'''
        metrics = await self.repository.get_support_metrics()
        
        return {
            'tickets': [
                {
                    'priority': t.priority,
                    'open': t.open_count,
                    'closed': t.closed_count,
                    'avg_resolution': t.avg_resolution_hours
                }
                for t in metrics.tickets
            ],
            'total_open': metrics.total_open,
            'total_closed': metrics.total_closed,
            'overall_resolution_time': metrics.overall_resolution_time,
            'timestamp': '2025-10-17T08:45:00Z'
        }
    
    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        '''Process support queries'''
        tile_data = await self.get_tile_data()
        
        prompt = get_prompt(
            agent_type='compliance',
            prompt_type='analysis',
            query=query,
            compliance_data=tile_data
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
        '''Analyze support metrics'''
        tile_data = await self.get_tile_data()
        
        if metric_name == 'critical_tickets':
            critical = next(t for t in tile_data['tickets'] if t['priority'] == 'Critical')
            return {
                'metric': 'critical_tickets',
                'open': critical['open'],
                'resolution_time': critical['avg_resolution']
            }
        
        return {}