from data.models.lab_metrics import LabMetrics, TurnaroundTime, LabCapacity, QualityMetric

class LabMetricsRepository:
    """Repository for lab metrics data"""

    async def get_lab_metrics_data(self) -> LabMetrics:
        """Get lab performance metrics"""
        turnaround_by_product = [
            TurnaroundTime(product="Cologuard", average_hours=36.5, target_hours=48.0, performance="ahead"),
            TurnaroundTime(product="Oncotype DX", average_hours=42.3, target_hours=48.0, performance="on_target"),
            TurnaroundTime(product="PreventionGenetics", average_hours=38.7, target_hours=48.0, performance="ahead"),
        ]

        lab_capacity = LabCapacity(
            total_capacity=50000,
            current_utilization=42300,
            utilization_percentage=84.6
        )

        quality_metrics = [
            QualityMetric(metric_name="Sample integrity rate", value=99.7, target=99.0, status="pass"),
            QualityMetric(metric_name="Accuracy rate", value=99.9, target=99.5, status="pass"),
            QualityMetric(metric_name="Contamination rate", value=0.02, target=0.05, status="pass"),
        ]

        return LabMetrics(
            daily_processing_volume=14100,
            weekly_processing_volume=98700,
            monthly_processing_volume=423000,
            average_turnaround_hours=39.2,
            target_turnaround_hours=48.0,
            turnaround_by_product=turnaround_by_product,
            lab_capacity=lab_capacity,
            efficiency_score=92.4,
            samples_per_technician_day=47.3,
            quality_metrics=quality_metrics,
            error_rate=0.08,
            active_alerts=[],
            efficiency_trends="improving"
        )
