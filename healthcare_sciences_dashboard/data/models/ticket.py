from pydantic import BaseModel

class TicketMetrics(BaseModel):
    priority: str
    open_count: int
    closed_count: int
    avg_resolution_hours: float

class SupportMetrics(BaseModel):
    tickets: list[TicketMetrics]
    total_open: int
    total_closed: int
    overall_resolution_time: float