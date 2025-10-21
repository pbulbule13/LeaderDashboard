from pydantic import BaseModel

class StockMetrics(BaseModel):
    symbol: str
    current_price: float
    change: float
    change_percent: float
    market_cap: str
    day_high: float
    day_low: float
    volume: int
    pe_ratio: float