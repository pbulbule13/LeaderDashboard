from pydantic import BaseModel
from typing import List
from datetime import datetime

class RejectionReason(BaseModel):
    """Claim rejection reasons"""
    reason: str
    count: int
    percentage: float = 0.0

class ReimbursementByProduct(BaseModel):
    """Reimbursement breakdown by product"""
    product_name: str
    total_claims: int
    reimbursed: int
    rejected: int
    reimbursement_rate: float = 0.0

class ReimbursementMetrics(BaseModel):
    """Reimbursement Metrics data model"""
    total_orders: int = 0
    claims_submitted: int = 0
    claims_reimbursed: int = 0
    claims_rejected: int = 0

    reimbursement_percentage: float = 0.0
    rejection_percentage: float = 0.0

    rejection_reasons: List[RejectionReason] = []
    by_product: List[ReimbursementByProduct] = []

    average_reimbursement_time_days: int = 0

    trending_issues: List[str] = []

    timestamp: str = datetime.now().isoformat()

    def calculate_percentages(self):
        """Calculate reimbursement and rejection percentages"""
        if self.claims_submitted > 0:
            self.reimbursement_percentage = (self.claims_reimbursed / self.claims_submitted) * 100
            self.rejection_percentage = (self.claims_rejected / self.claims_submitted) * 100
