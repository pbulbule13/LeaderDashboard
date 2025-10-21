from typing import TypedDict, Annotated, List, Dict, Any
from langgraph.graph import add_messages

class DashboardState(TypedDict):
    """State for the dashboard agent graph"""
    messages: Annotated[List, add_messages]
    user_query: str
    target_agent: str
    context: Dict[str, Any]
    products_data: Dict[str, Any]
    revenue_data: Dict[str, Any]
    budget_data: Dict[str, Any]
    support_data: Dict[str, Any]
    workforce_data: Dict[str, Any]
    stock_data: Dict[str, Any]
    final_response: str
    error: str