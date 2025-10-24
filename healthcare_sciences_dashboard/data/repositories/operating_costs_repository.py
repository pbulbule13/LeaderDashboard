from data.models.operating_costs import OperatingCosts, CostCategory, MonthlyCost

class OperatingCostsRepository:
    """Repository for operating costs data"""

    async def get_operating_costs_data(self) -> OperatingCosts:
        """Get operating costs metrics"""
        cost_breakdown = [
            CostCategory(category="Salaries & Benefits", amount=45000000, percentage=0, trend="up"),
            CostCategory(category="Lab & Facility Costs", amount=28000000, percentage=0, trend="stable"),
            CostCategory(category="AWS/Cloud Services", amount=12000000, percentage=0, trend="up"),
            CostCategory(category="R&D", amount=8500000, percentage=0, trend="stable"),
            CostCategory(category="Marketing & Sales", amount=6200000, percentage=0, trend="down"),
            CostCategory(category="Other Operating Expenses", amount=3800000, percentage=0, trend="stable"),
        ]

        monthly_trend = [
            MonthlyCost(month="Jan 2025", total_cost=101500000, change_percentage=0),
            MonthlyCost(month="Feb 2025", total_cost=102800000, change_percentage=1.3),
            MonthlyCost(month="Mar 2025", total_cost=103200000, change_percentage=0.4),
            MonthlyCost(month="Apr 2025", total_cost=103900000, change_percentage=0.7),
            MonthlyCost(month="May 2025", total_cost=104100000, change_percentage=0.2),
            MonthlyCost(month="Jun 2025", total_cost=103500000, change_percentage=-0.6),
        ]

        costs = OperatingCosts(
            aws_cloud_costs=12000000,
            salary_expenses=45000000,
            lab_facility_costs=28000000,
            other_costs=18500000,
            cost_breakdown=cost_breakdown,
            monthly_trend=monthly_trend,
            major_cost_drivers=["Lab expansion", "Cloud infrastructure scaling", "Sales team growth"],
            cost_efficiency_score=87.3,
            period="monthly"
        )

        costs.calculate_total()
        costs.calculate_percentages()
        return costs
