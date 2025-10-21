import pytest
from agents.revenue_agent import RevenueAgent

@pytest.mark.asyncio
async def test_revenue_agent_get_tile_data():
    '''Test revenue agent can fetch tile data'''
    agent = RevenueAgent()
    data = await agent.get_tile_data()
    
    assert 'records' in data
    assert 'total_actual' in data
    assert 'overall_performance' in data
    assert len(data['records']) > 0

@pytest.mark.asyncio
async def test_revenue_agent_process_query():
    '''Test revenue agent can process queries'''
    agent = RevenueAgent()
    result = await agent.process_query(
        'How is our revenue performing vs target?',
        {}
    )
    
    assert 'agent' in result
    assert 'response' in result
    assert result['agent'] == 'RevenueAgent'

@pytest.mark.asyncio
async def test_revenue_agent_analyze_performance():
    '''Test revenue performance analysis'''
    agent = RevenueAgent()
    result = await agent.analyze_metric('performance')
    
    assert 'metric' in result
    assert 'value' in result
    assert result['metric'] == 'overall_performance'