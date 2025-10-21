from graph.state import DashboardState

def route_to_agent(state: DashboardState) -> str:
    """Route to the appropriate agent based on target_agent"""
    return state["target_agent"]