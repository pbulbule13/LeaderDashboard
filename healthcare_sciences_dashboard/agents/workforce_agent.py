from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.workforce_repository import WorkforceRepository
from config.prompts_config import get_prompt

class WorkforceAgent(BaseAgent):
    '''Agent for Workforce Insights tile'''
    
    def __init__(self):
        super().__init__('WorkforceAgent')
        self.repository = WorkforceRepository()
        
    async def get_tile_data(self) -> Dict[str, Any]:
        '''Get workforce metrics'''
        metrics = await self.repository.get_workforce_metrics()
        
        return {
            'total_employees': metrics.total_employees,
            'departments': metrics.departments,
            'new_hires': metrics.new_hires,
            'turnover_rate': metrics.turnover_rate,
            'critical_vacancies': [
                {
                    'role': v.role,
                    'days_open': v.days_open,
                    'location': v.location,
                    'candidates': v.candidates
                }
                for v in metrics.critical_vacancies
            ],
            'timestamp': '2025-10-17T08:45:00Z'
        }
    
    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        '''Process workforce queries'''
        tile_data = await self.get_tile_data()

        prompt = get_prompt(
            agent_type='workforce',
            prompt_type='analysis',
            query=query,
            workforce_data=tile_data
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
        '''Analyze workforce metrics'''
        tile_data = await self.get_tile_data()
        
        if metric_name == 'most_urgent_vacancy':
            most_urgent = max(tile_data['critical_vacancies'], key=lambda x: x['days_open'])
            return {
                'metric': 'most_urgent_vacancy',
                'role': most_urgent['role'],
                'days_open': most_urgent['days_open']
            }
        
        return {}