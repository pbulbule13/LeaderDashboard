from data.models.milestones import ProjectMilestones, ProjectStatus, Milestone, TimelineEvent
from datetime import datetime, timedelta

class MilestonesRepository:
    """Repository for project milestones data"""

    async def get_milestones_data(self) -> ProjectMilestones:
        """Get project milestone tracking data"""
        today = datetime.now()

        cologuard_milestones = [
            Milestone(
                milestone_name="Clinical trial completion",
                project_name="Cologuard 2.0",
                status="completed",
                progress_percentage=100.0,
                target_date="2025-03-31",
                completion_date="2025-03-28",
                priority="high"
            ),
            Milestone(
                milestone_name="FDA submission",
                project_name="Cologuard 2.0",
                status="in_progress",
                progress_percentage=75.0,
                target_date="2025-11-30",
                priority="critical"
            ),
        ]

        mrd_milestones = [
            Milestone(
                milestone_name="Phase II trial enrollment",
                project_name="MRD Expansion",
                status="in_progress",
                progress_percentage=60.0,
                target_date="2025-08-15",
                priority="high"
            ),
        ]

        active_projects = [
            ProjectStatus(
                project_name="Cologuard 2.0",
                category="fda_submission",
                overall_status="on_track",
                completion_percentage=72.0,
                key_milestones=cologuard_milestones,
                next_milestone="FDA submission",
                risk_level="low"
            ),
            ProjectStatus(
                project_name="MRD Test Expansion",
                category="product_development",
                overall_status="on_track",
                completion_percentage=45.0,
                key_milestones=mrd_milestones,
                next_milestone="Phase II trial enrollment",
                risk_level="medium"
            ),
            ProjectStatus(
                project_name="Oncotype DX Enhancement",
                category="product_development",
                overall_status="on_track",
                completion_percentage=62.0,
                key_milestones=[],
                next_milestone="Validation study completion",
                risk_level="low"
            ),
            ProjectStatus(
                project_name="PreventionGenetics Platform Upgrade",
                category="technology",
                overall_status="at_risk",
                completion_percentage=38.0,
                key_milestones=[],
                next_milestone="System integration testing",
                risk_level="high"
            ),
            ProjectStatus(
                project_name="Multi-Cancer Detection Panel",
                category="fda_submission",
                overall_status="on_track",
                completion_percentage=55.0,
                key_milestones=[],
                next_milestone="Clinical trial patient enrollment",
                risk_level="medium"
            ),
            ProjectStatus(
                project_name="Laboratory Information System Upgrade",
                category="infrastructure",
                overall_status="on_track",
                completion_percentage=80.0,
                key_milestones=[],
                next_milestone="Production deployment",
                risk_level="low"
            ),
            ProjectStatus(
                project_name="International Market Expansion - EU",
                category="business_development",
                overall_status="on_track",
                completion_percentage=25.0,
                key_milestones=[],
                next_milestone="Regulatory pathway selection",
                risk_level="medium"
            ),
            ProjectStatus(
                project_name="AI-Assisted Test Interpretation",
                category="technology",
                overall_status="at_risk",
                completion_percentage=42.0,
                key_milestones=[],
                next_milestone="Algorithm validation",
                risk_level="high"
            ),
            ProjectStatus(
                project_name="Patient Portal Enhancement",
                category="infrastructure",
                overall_status="delayed",
                completion_percentage=15.0,
                key_milestones=[],
                next_milestone="Requirements finalization",
                risk_level="medium"
            ),
            ProjectStatus(
                project_name="Supply Chain Optimization",
                category="operations",
                overall_status="on_track",
                completion_percentage=68.0,
                key_milestones=[],
                next_milestone="Vendor contracts finalization",
                risk_level="low"
            ),
            ProjectStatus(
                project_name="Quality Management System ISO Certification",
                category="quality",
                overall_status="on_track",
                completion_percentage=85.0,
                key_milestones=[],
                next_milestone="Final audit preparation",
                risk_level="low"
            ),
            ProjectStatus(
                project_name="Pharmacogenomics Testing Suite",
                category="product_development",
                overall_status="delayed",
                completion_percentage=20.0,
                key_milestones=[],
                next_milestone="Assay development",
                risk_level="high"
            ),
        ]

        timeline_events = [
            TimelineEvent(event_name="Cologuard 2.0 FDA Submission", event_type="milestone", date="2025-11-30", status="upcoming"),
            TimelineEvent(event_name="MRD Phase II Completion", event_type="milestone", date="2025-12-15", status="upcoming"),
        ]

        return ProjectMilestones(
            active_projects=active_projects,
            upcoming_milestones=cologuard_milestones + mrd_milestones,
            completed_milestones=[m for m in cologuard_milestones if m.status == "completed"],
            at_risk_milestones=[],
            fda_submissions=[p for p in active_projects if p.category == "fda_submission"],
            timeline_events=timeline_events,
            total_projects=len(active_projects),
            projects_on_track=sum(1 for p in active_projects if p.overall_status == "on_track"),
            projects_at_risk=sum(1 for p in active_projects if p.overall_status == "at_risk"),
            projects_delayed=sum(1 for p in active_projects if p.overall_status == "delayed"),
            critical_items=[
                "Cologuard 2.0 FDA submission on target for Q4 2025",
                "PreventionGenetics Platform Upgrade experiencing delays - resource allocation needed",
                "Patient Portal Enhancement behind schedule - stakeholder review required"
            ]
        )
