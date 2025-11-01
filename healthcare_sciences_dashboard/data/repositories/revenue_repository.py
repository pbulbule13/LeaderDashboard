from typing import List
from ..models.revenue import RevenueRecord, RevenueMetrics

class RevenueRepository:
    '''Repository for revenue data'''
    
    async def get_current_revenue(self) -> RevenueMetrics:
        '''Get current period revenue data'''
        records = [
            RevenueRecord(
                period='Oct 2025',
                actual=185000000,
                projected=180000000
            ),
            RevenueRecord(
                period='Q4 2025',
                actual=520000000,
                projected=540000000
            ),
            RevenueRecord(
                period='Q1 2026',
                actual=0,
                projected=565000000
            )
        ]
        
        # Calculate variances
        for record in records:
            record.calculate_variance()
        
        # Calculate totals (only actual revenue)
        total_actual = sum(r.actual for r in records if r.actual > 0)
        total_projected = sum(r.projected for r in records[:2])  # Current periods only
        
        return RevenueMetrics(
            records=records,
            total_actual=total_actual,
            total_projected=total_projected,
            overall_performance=(total_actual / total_projected * 100) if total_projected > 0 else 0
        )
    
    async def get_revenue_by_period(self, period: str) -> RevenueRecord:
        '''Get revenue for specific period'''
        metrics = await self.get_current_revenue()
        return next((r for r in metrics.records if r.period == period), None)
    
    async def get_revenue_trend(self) -> List[dict]:
        '''Get revenue trend over time'''
        return [
            {'month': 'Jul 2025', 'revenue': 175000000},
            {'month': 'Aug 2025', 'revenue': 178000000},
            {'month': 'Sep 2025', 'revenue': 182000000},
            {'month': 'Oct 2025', 'revenue': 185000000}
        ]
