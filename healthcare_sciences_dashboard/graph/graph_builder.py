from langgraph.graph import StateGraph, END
from graph.state import DashboardState
from graph.nodes import (
    route_query_node,
    products_node,
    revenue_node,
    budget_node,
    support_node,
    workforce_node,
    stock_node,
    synthesize_response_node
)
from graph.edges import route_to_agent

def create_dashboard_graph():
    '''Create the LangGraph workflow'''
    
    workflow = StateGraph(DashboardState)
    
    # Add all nodes
    workflow.add_node('route_query', route_query_node)
    workflow.add_node('products', products_node)
    workflow.add_node('revenue', revenue_node)
    workflow.add_node('budget', budget_node)
    workflow.add_node('support', support_node)
    workflow.add_node('workforce', workforce_node)
    workflow.add_node('stock', stock_node)
    workflow.add_node('synthesize', synthesize_response_node)
    
    # Set entry point
    workflow.set_entry_point('route_query')
    
    # Add conditional edges
    workflow.add_conditional_edges(
        'route_query',
        route_to_agent,
        {
            'products': 'products',
            'revenue': 'revenue',
            'budget': 'budget',
            'support': 'support',
            'workforce': 'workforce',
            'stock': 'stock',
            'synthesize': 'synthesize'
        }
    )
    
    # All agents flow to synthesize
    for node in ['products', 'revenue', 'budget', 'support', 'workforce', 'stock']:
        workflow.add_edge(node, 'synthesize')
    
    workflow.add_edge('synthesize', END)
    
    return workflow.compile()