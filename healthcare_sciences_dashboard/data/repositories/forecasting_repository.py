from ..models.forecasting import Forecast, ForecastPeriod, ProductForecast, HistoricalTrend

class ForecastingRepository:
    """Repository for forecasting data"""

    async def get_forecasting_data(self) -> Forecast:
        """Get forecasting projections"""
        quarterly_forecasts = [
            ForecastPeriod(period="Q3 2025", projected_orders=3150000, projected_revenue=287000000, confidence_low=280000000, confidence_high=294000000, confidence_level=88.0),
            ForecastPeriod(period="Q4 2025", projected_orders=3420000, projected_revenue=312000000, confidence_low=302000000, confidence_high=322000000, confidence_level=85.0),
            ForecastPeriod(period="Q1 2026", projected_orders=3680000, projected_revenue=336000000, confidence_low=323000000, confidence_high=349000000, confidence_level=82.0),
        ]

        product_forecasts = [
            ProductForecast(product_name="Cologuard", projected_orders=1650000, projected_revenue=152000000, growth_projection=12.5),
            ProductForecast(product_name="Oncotype DX", projected_orders=850000, projected_revenue=78000000, growth_projection=8.3),
            ProductForecast(product_name="PreventionGenetics", projected_orders=450000, projected_revenue=41000000, growth_projection=15.7),
        ]

        historical_data = [
            HistoricalTrend(period="Q1 2024", actual_orders=2450000, actual_revenue=215000000),
            HistoricalTrend(period="Q2 2024", actual_orders=2680000, actual_revenue=235000000),
            HistoricalTrend(period="Q3 2024", actual_orders=2850000, actual_revenue=258000000),
            HistoricalTrend(period="Q4 2024", actual_orders=3050000, actual_revenue=278000000),
        ]

        return Forecast(
            next_quarter_orders=3150000,
            next_quarter_revenue=287000000,
            next_year_orders=13500000,
            next_year_revenue=1235000000,
            quarterly_forecasts=quarterly_forecasts,
            product_forecasts=product_forecasts,
            historical_data=historical_data,
            forecast_confidence=85.0,
            methodology="Time series analysis with seasonal adjustment and growth trends",
            assumptions=[
                "Market demand continues current trends",
                "No major regulatory changes",
                "Current reimbursement rates maintained"
            ],
            risk_factors=[
                "Potential regulatory changes",
                "Competitive market pressure",
                "Insurance reimbursement policy shifts"
            ]
        )
