from typing import Dict, Any
from graph.state import DashboardState
from agents.products_agent import ProductsAgent
from agents.revenue_agent import RevenueAgent
from agents.budget_agent import BudgetAgent
from agents.support_agent import SupportAgent
from agents.workforce_agent import WorkforceAgent
from agents.stock_agent import StockAgent

products_agent = ProductsAgent()
revenue_agent = RevenueAgent()
budget_agent = BudgetAgent()
support_agent = SupportAgent()
workforce_agent = WorkforceAgent()
stock_agent = StockAgent()

async def route_query_node(state: DashboardState) -> Dict[str, Any]:
    '''Determine which agent should handle the query'''
    query = state['user_query'].lower()
    
    if any(word in query for word in ['product', 'order', 'diagnostictest', 'test']):
        target = 'products'
    elif any(word in query for word in ['revenue', 'sales', 'income', 'target', 'earnings']):
        target = 'revenue'
    elif any(word in query for word in ['budget', 'spending', 'cost', 'expense']):
        target = 'budget'
    elif any(word in query for word in ['ticket', 'support', 'customer', 'resolution']):
        target = 'support'
    elif any(word in query for word in ['employee', 'hiring', 'workforce', 'vacancy', 'headcount']):
        target = 'workforce'
    elif any(word in query for word in ['stock', 'hcs', 'price', 'market', 'share']):
        target = 'stock'
    else:
        target = 'synthesize'
    
    return {'target_agent': target}

async def products_node(state: DashboardState) -> Dict[str, Any]:
    result = await products_agent.process_query(state['user_query'], state.get('context', {}))
    return {'products_data': result['data'], 'final_response': result['response']}

async def revenue_node(state: DashboardState) -> Dict[str, Any]:
    result = await revenue_agent.process_query(state['user_query'], state.get('context', {}))
    return {'revenue_data': result['data'], 'final_response': result['response']}

async def budget_node(state: DashboardState) -> Dict[str, Any]:
    result = await budget_agent.process_query(state['user_query'], state.get('context', {}))
    return {'budget_data': result['data'], 'final_response': result['response']}

async def support_node(state: DashboardState) -> Dict[str, Any]:
    result = await support_agent.process_query(state['user_query'], state.get('context', {}))
    return {'support_data': result['data'], 'final_response': result['response']}

async def workforce_node(state: DashboardState) -> Dict[str, Any]:
    result = await workforce_agent.process_query(state['user_query'], state.get('context', {}))
    return {'workforce_data': result['data'], 'final_response': result['response']}

async def stock_node(state: DashboardState) -> Dict[str, Any]:
    result = await stock_agent.process_query(state['user_query'], state.get('context', {}))
    return {'stock_data': result['data'], 'final_response': result['response']}

async def synthesize_response_node(state: DashboardState) -> Dict[str, Any]:
    if state.get('final_response'):
        return {'final_response': state['final_response']}
    
    response = 'Based on the current dashboard data:\n\n'
    
    if state.get('products_data'):
        total_orders = state['products_data'].get('total_orders', 'N/A')
        response += f"Products: {total_orders} total orders\n"
    
    if state.get('revenue_data'):
        total_actual = state['revenue_data'].get('total_actual', 0)
        response += f"Revenue: ${total_actual/1000000:.1f}M actual\n"
    
    if state.get('budget_data'):
        q4 = state['budget_data']['quarters'][0]
        response += f"Budget: ${q4['total_spent']/1000000:.0f}M spent of ${q4['total_allocated']/1000000:.0f}M\n"
    
    if state.get('support_data'):
        total_open = state['support_data'].get('total_open', 0)
        response += f"Support: {total_open} open tickets\n"
    
    if state.get('workforce_data'):
        total_emp = state['workforce_data'].get('total_employees', 0)
        response += f"Workforce: {total_emp} employees\n"
    
    if state.get('stock_data'):
        price = state['stock_data'].get('current_price', 0)
        response += f"Stock: ${price} per share\n"
    
    return {'final_response': response}