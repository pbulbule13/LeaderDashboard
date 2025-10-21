from data.models.stock import StockMetrics

class StockRepository:
    '''Repository for stock data'''
    
    async def get_stock_metrics(self) -> StockMetrics:
        '''Get current HCS stock metrics'''
        return StockMetrics(
            symbol='HCS',
            current_price=62.45,
            change=1.23,
            change_percent=2.01,
            market_cap='11.2B',
            day_high=63.12,
            day_low=61.08,
            volume=2456789,
            pe_ratio=28.5
        )