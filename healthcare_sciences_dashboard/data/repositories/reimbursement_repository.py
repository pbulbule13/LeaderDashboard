from ..models.reimbursement import ReimbursementMetrics, RejectionReason, ReimbursementByProduct

class ReimbursementRepository:
    """Repository for reimbursement data"""

    async def get_reimbursement_data(self) -> ReimbursementMetrics:
        """Get reimbursement metrics"""
        rejection_reasons = [
            RejectionReason(reason="Insurance eligibility issues", count=2340, percentage=42.1),
            RejectionReason(reason="Prior procedure within timeframe", count=1567, percentage=28.2),
            RejectionReason(reason="Incomplete documentation", count=892, percentage=16.0),
            RejectionReason(reason="Pre-authorization required", count=523, percentage=9.4),
            RejectionReason(reason="Other", count=238, percentage=4.3),
        ]

        by_product = [
            ReimbursementByProduct(
                product_name="DiagnosticTest A",
                total_claims=456789,
                reimbursed=453249,
                rejected=3540,
                reimbursement_rate=99.2
            ),
            ReimbursementByProduct(
                product_name="DiagnosticTest B",
                total_claims=234567,
                reimbursed=232147,
                rejected=2420,
                reimbursement_rate=99.0
            ),
        ]

        metrics = ReimbursementMetrics(
            total_orders=903824,
            claims_submitted=691356,
            claims_reimbursed=685396,
            claims_rejected=5960,
            rejection_reasons=rejection_reasons,
            by_product=by_product,
            average_reimbursement_time_days=18,
            trending_issues=["Increase in pre-auth requirements", "New insurance verification protocols"]
        )

        metrics.calculate_percentages()
        return metrics
