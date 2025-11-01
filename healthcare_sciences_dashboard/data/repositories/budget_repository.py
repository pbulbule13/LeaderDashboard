from typing import List
from ..models.budget import BudgetItem, QuarterBudget

class BudgetRepository:
    '''Repository for budget data'''
    
    async def get_quarterly_budgets(self) -> List[QuarterBudget]:
        '''Get current and next quarter budgets'''
        q4_items = [
            BudgetItem(department='R&D', allocated=45000000, spent=38200000, remaining=6800000),
            BudgetItem(department='Sales & Marketing', allocated=67000000, spent=59400000, remaining=7600000),
            BudgetItem(department='Operations', allocated=34000000, spent=31200000, remaining=2800000),
            BudgetItem(department='G&A', allocated=23000000, spent=20100000, remaining=2900000)
        ]
        
        q1_items = [
            BudgetItem(department='R&D', allocated=48000000, spent=0, remaining=48000000),
            BudgetItem(department='Sales & Marketing', allocated=71000000, spent=0, remaining=71000000),
            BudgetItem(department='Operations', allocated=36000000, spent=0, remaining=36000000),
            BudgetItem(department='G&A', allocated=24000000, spent=0, remaining=24000000)
        ]
        
        # Calculate utilization
        for item in q4_items:
            item.calculate_utilization()
        
        q4 = QuarterBudget(
            quarter='Q4 2025 (Current)',
            items=q4_items,
            total_allocated=sum(i.allocated for i in q4_items),
            total_spent=sum(i.spent for i in q4_items),
            total_remaining=sum(i.remaining for i in q4_items)
        )
        
        q1 = QuarterBudget(
            quarter='Q1 2026 (Next)',
            items=q1_items,
            total_allocated=sum(i.allocated for i in q1_items),
            total_spent=sum(i.spent for i in q1_items),
            total_remaining=sum(i.remaining for i in q1_items)
        )
        
        return [q4, q1]
