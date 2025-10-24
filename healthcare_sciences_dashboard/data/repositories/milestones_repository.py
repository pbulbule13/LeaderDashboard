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
            projects_on_track=2,
            projects_at_risk=0,
            projects_delayed=0,
            critical_items=["Cologuard 2.0 FDA submission on target for Q4"]
        )
