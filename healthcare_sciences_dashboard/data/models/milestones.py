from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Milestone(BaseModel):
    """Individual project milestone"""
    milestone_name: str
    project_name: str
    status: str  # not_started, in_progress, completed, delayed, at_risk
    progress_percentage: float = 0.0
    target_date: str
    completion_date: Optional[str] = None
    priority: str = "medium"  # low, medium, high, critical

class ProjectStatus(BaseModel):
    """High-level project status"""
    project_name: str
    category: str  # fda_submission, product_development, regulatory, expansion
    overall_status: str  # on_track, at_risk, delayed, completed
    completion_percentage: float = 0.0
    key_milestones: List[Milestone] = []
    next_milestone: Optional[str] = None
    risk_level: str = "low"  # low, medium, high

class TimelineEvent(BaseModel):
    """Timeline visualization event"""
    event_name: str
    event_type: str  # milestone, deadline, review
    date: str
    status: str

class ProjectMilestones(BaseModel):
    """Project Milestone Tracking data model"""
    # Active projects
    active_projects: List[ProjectStatus] = []

    # Key milestones across all projects
    upcoming_milestones: List[Milestone] = []
    completed_milestones: List[Milestone] = []
    at_risk_milestones: List[Milestone] = []

    # FDA specific
    fda_submissions: List[ProjectStatus] = []

    # Timeline
    timeline_events: List[TimelineEvent] = []

    # Summary metrics
    total_projects: int = 0
    projects_on_track: int = 0
    projects_at_risk: int = 0
    projects_delayed: int = 0

    # Alerts
    critical_items: List[str] = []

    timestamp: str = datetime.now().isoformat()
