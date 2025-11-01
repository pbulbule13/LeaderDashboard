from ..models.regional import RegionalPerformance, TerritoryPerformance, RegionalComparison, TerritoryMapData, GeoCoordinate

class RegionalRepository:
    """Repository for regional performance data"""

    async def get_regional_data(self) -> RegionalPerformance:
        """Get regional and territory performance data"""
        territories = [
            TerritoryPerformance(territory_name="New York Metro", region="Northeast", orders=125000, revenue=34500000, growth_rate=15.3, market_share=12.3, rank=1),
            TerritoryPerformance(territory_name="California", region="West", orders=118000, revenue=32100000, growth_rate=18.7, market_share=11.6, rank=2),
            TerritoryPerformance(territory_name="Texas", region="Southwest", orders=95000, revenue=26800000, growth_rate=22.1, market_share=9.3, rank=3),
            TerritoryPerformance(territory_name="Florida", region="Southeast", orders=87000, revenue=24200000, growth_rate=14.5, market_share=8.5, rank=4),
            TerritoryPerformance(territory_name="Illinois", region="Midwest", orders=72000, revenue=19800000, growth_rate=9.2, market_share=7.1, rank=5),
            TerritoryPerformance(territory_name="Pennsylvania", region="Northeast", orders=68000, revenue=18700000, growth_rate=11.8, market_share=6.7, rank=6),
            TerritoryPerformance(territory_name="Ohio", region="Midwest", orders=64000, revenue=17600000, growth_rate=13.2, market_share=6.3, rank=7),
            TerritoryPerformance(territory_name="Georgia", region="Southeast", orders=59000, revenue=16200000, growth_rate=16.5, market_share=5.8, rank=8),
            TerritoryPerformance(territory_name="North Carolina", region="Southeast", orders=54000, revenue=14800000, growth_rate=19.3, market_share=5.3, rank=9),
            TerritoryPerformance(territory_name="Michigan", region="Midwest", orders=51000, revenue=14000000, growth_rate=8.7, market_share=5.0, rank=10),
            TerritoryPerformance(territory_name="New Jersey", region="Northeast", orders=49000, revenue=13500000, growth_rate=12.4, market_share=4.8, rank=11),
            TerritoryPerformance(territory_name="Arizona", region="Southwest", orders=46000, revenue=12600000, growth_rate=24.1, market_share=4.5, rank=12),
        ]

        regional_summary = [
            RegionalComparison(region="Northeast", total_orders=215000, total_revenue=59300000, average_growth=13.8, territories_count=8),
            RegionalComparison(region="West", total_orders=198000, total_revenue=54200000, average_growth=17.2, territories_count=7),
            RegionalComparison(region="Southwest", total_orders=167000, total_revenue=46100000, average_growth=19.5, territories_count=6),
            RegionalComparison(region="Southeast", total_orders=156000, total_revenue=43000000, average_growth=12.3, territories_count=9),
            RegionalComparison(region="Midwest", total_orders=145000, total_revenue=39900000, average_growth=10.1, territories_count=8),
        ]

        map_data = [
            TerritoryMapData(territory="New York Metro", coordinates=GeoCoordinate(latitude=40.7128, longitude=-74.0060), value=125000, color_intensity="high"),
            TerritoryMapData(territory="California", coordinates=GeoCoordinate(latitude=36.7783, longitude=-119.4179), value=118000, color_intensity="high"),
            TerritoryMapData(territory="Texas", coordinates=GeoCoordinate(latitude=31.9686, longitude=-99.9018), value=95000, color_intensity="medium"),
        ]

        return RegionalPerformance(
            territories=territories,
            regional_summary=regional_summary,
            map_data=map_data,
            top_performing_territory="New York Metro",
            lowest_performing_territory="Montana",
            total_territories=38,
            coverage_percentage=98.5
        )
