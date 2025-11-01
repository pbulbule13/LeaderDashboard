from ..models.compliance import ComplianceMetrics, ProductReturns, ReturnReason

class ComplianceRepository:
    """Repository for compliance and returns data"""

    async def get_compliance_data(self) -> ComplianceMetrics:
        """Get compliance and returns metrics"""
        # Mock data
        product_returns = [
            ProductReturns(product_name="DiagnosticTest A", kits_returned=234, total_orders=456789),
            ProductReturns(product_name="DiagnosticTest B", kits_returned=145, total_orders=234567),
            ProductReturns(product_name="DiagnosticTest C", kits_returned=89, total_orders=123456),
            ProductReturns(product_name="DiagnosticTest A Plus", kits_returned=67, total_orders=89012),
        ]

        for pr in product_returns:
            pr.calculate_return_rate()

        return_reasons = [
            ReturnReason(reason="Sample quality issues", count=187, percentage=35.1),
            ReturnReason(reason="Patient declined", count=134, percentage=25.1),
            ReturnReason(reason="Shipping delays", count=98, percentage=18.4),
            ReturnReason(reason="Incorrect order", count=76, percentage=14.3),
            ReturnReason(reason="Other", count=40, percentage=7.5),
        ]

        total_returns = sum(pr.kits_returned for pr in product_returns)
        total_orders = sum(pr.total_orders for pr in product_returns)

        compliance = ComplianceMetrics(
            total_returns=total_returns,
            total_orders=total_orders,
            product_returns=product_returns,
            return_reasons=return_reasons,
            compliance_score=99.4,
            follow_up_actions=[
                "Review sample quality protocols",
                "Enhance patient education materials",
                "Optimize shipping procedures"
            ]
        )

        compliance.calculate_overall_return_rate()
        return compliance
