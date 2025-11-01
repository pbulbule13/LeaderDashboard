from typing import List
from ..models.ticket import TicketMetrics, SupportMetrics

class SupportRepository:
    '''Repository for support ticket data'''
    
    async def get_support_metrics(self) -> SupportMetrics:
        '''Get current support ticket metrics'''
        tickets = [
            TicketMetrics(priority='Critical', open_count=3, closed_count=12, avg_resolution_hours=2.3),
            TicketMetrics(priority='High', open_count=15, closed_count=45, avg_resolution_hours=4.7),
            TicketMetrics(priority='Medium', open_count=28, closed_count=89, avg_resolution_hours=8.2),
            TicketMetrics(priority='Low', open_count=42, closed_count=156, avg_resolution_hours=24.0)
        ]
        
        total_open = sum(t.open_count for t in tickets)
        total_closed = sum(t.closed_count for t in tickets)
        
        # Weighted average resolution time
        total_tickets = total_closed
        weighted_sum = sum(t.closed_count * t.avg_resolution_hours for t in tickets)
        overall_resolution = weighted_sum / total_tickets if total_tickets > 0 else 0
        
        return SupportMetrics(
            tickets=tickets,
            total_open=total_open,
            total_closed=total_closed,
            overall_resolution_time=overall_resolution
        )
