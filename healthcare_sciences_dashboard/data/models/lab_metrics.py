from pydantic import BaseModel
from typing import List
from datetime import datetime

class TurnaroundTime(BaseModel):
    """Turnaround time metrics"""
    product: str
    average_hours: float
    target_hours: float
    performance: str = "on_target"  # ahead, on_target, behind

class LabCapacity(BaseModel):
    """Lab capacity metrics"""
    total_capacity: int
    current_utilization: int
    utilization_percentage: float = 0.0

class QualityMetric(BaseModel):
    """Quality control metrics"""
    metric_name: str
    value: float
    target: float
    status: str = "pass"  # pass, warning, fail

class LabMetrics(BaseModel):
    """Lab Metrics data model"""
    # Processing volumes
    daily_processing_volume: int = 0
    weekly_processing_volume: int = 0
    monthly_processing_volume: int = 0

    # Turnaround time
    average_turnaround_hours: float = 0.0
    target_turnaround_hours: float = 48.0
    turnaround_by_product: List[TurnaroundTime] = []

    # Capacity
    lab_capacity: LabCapacity

    # Efficiency
    efficiency_score: float = 0.0
    samples_per_technician_day: float = 0.0

    # Quality
    quality_metrics: List[QualityMetric] = []
    error_rate: float = 0.0

    # Alerts
    active_alerts: List[str] = []
    efficiency_trends: str = "stable"  # improving, stable, declining

    timestamp: str = datetime.now().isoformat()
