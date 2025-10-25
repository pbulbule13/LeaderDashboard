from typing import Dict, Any
from agents.base_agent import BaseAgent
from data.repositories.budget_repository import BudgetRepository
from config.prompts_config import get_prompt

class BudgetAgent(BaseAgent):
    '''Agent responsible for Budget Analysis tile'''
    
    def __init__(self):
        super().__init__('BudgetAgent')
        self.repository = BudgetRepository()
        
    async def get_tile_data(self) -> Dict[str, Any]:
        '''Get budget data for quarters'''
        budgets = await self.repository.get_quarterly_budgets()
        
        return {
            'quarters': [
                {
                    'quarter': b.quarter,
                    'items': [
                        {
                            'department': i.department,
                            'allocated': i.allocated,
                            'spent': i.spent,
                            'remaining': i.remaining,
                            'utilization_percent': i.utilization_percent
                        }
                        for i in b.items
                    ],
                    'total_allocated': b.total_allocated,
                    'total_spent': b.total_spent,
                    'total_remaining': b.total_remaining
                }
                for b in budgets
            ],
            'timestamp': '2025-10-17T08:45:00Z'
        }
    
    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        '''Process budget queries'''
        tile_data = await self.get_tile_data()

        prompt = get_prompt(
            agent_type='budget',
            prompt_type='analysis',
            query=query,
            budget_data=tile_data
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
        '''Analyze budget metrics'''
        tile_data = await self.get_tile_data()
        q4 = tile_data['quarters'][0]
        
        if metric_name == 'highest_utilization':
            highest = max(q4['items'], key=lambda x: x['utilization_percent'] or 0)
            return {
                'metric': 'highest_utilization',
                'department': highest['department'],
                'utilization': highest['utilization_percent']
            }
        
        return {}