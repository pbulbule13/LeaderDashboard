from data.models.order_volume import OrderVolume, GrowthMetrics, ProductLineOrders, OrderVolumePeriod

class OrderVolumeRepository:
    """Repository for order volume data"""

    async def get_order_volume_data(self) -> OrderVolume:
        """Get current order volume and growth metrics"""
        # Mock data - replace with actual database/API calls
        growth_metrics = GrowthMetrics(
            dod=2.3,
            wow=5.7,
            mom=12.4,
            qoq=18.9,
            yoy=45.2
        )

        product_lines = [
            ProductLineOrders(product_line="Cologuard", orders=456789, percentage=48.5),
            ProductLineOrders(product_line="Oncotype DX", orders=234567, percentage=24.9),
            ProductLineOrders(product_line="PreventionGenetics", orders=123456, percentage=13.1),
            ProductLineOrders(product_line="Cologuard Plus", orders=89012, percentage=9.4),
            ProductLineOrders(product_line="MRD Tests", orders=38594, percentage=4.1),
        ]

        trend_data = [
            OrderVolumePeriod(period="Jan 2025", count=825000, growth=8.5),
            OrderVolumePeriod(period="Feb 2025", count=867000, growth=5.1),
            OrderVolumePeriod(period="Mar 2025", count=905000, growth=4.4),
            OrderVolumePeriod(period="Apr 2025", count=932000, growth=3.0),
            OrderVolumePeriod(period="May 2025", count=978000, growth=4.9),
            OrderVolumePeriod(period="Jun 2025", count=1023000, growth=4.6),
            OrderVolumePeriod(period="Jul 2025", count=1067000, growth=4.3),
            OrderVolumePeriod(period="Aug 2025", count=1098000, growth=2.9),
            OrderVolumePeriod(period="Sep 2025", count=1145000, growth=4.3),
            OrderVolumePeriod(period="Oct 2025", count=1189000, growth=3.8),
            OrderVolumePeriod(period="Nov 2025", count=1234000, growth=3.8),
            OrderVolumePeriod(period="Dec 2025", count=1278000, growth=3.6),
        ]

        return OrderVolume(
            daily_orders=34200,
            weekly_orders=239400,
            monthly_orders=1023000,
            quarterly_orders=2935000,
            yearly_orders=11240000,
            growth_metrics=growth_metrics,
            product_lines=product_lines,
            trend_data=trend_data
        )
