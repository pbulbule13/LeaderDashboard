

import pytest
from agents.products_agent import ProductsAgent

@pytest.mark.asyncio
async def test_products_agent_get_tile_data():
    '''Test products agent can fetch tile data'''
    agent = ProductsAgent()
    data = await agent.get_tile_data()
    
    assert 'products' in data
    assert 'total_orders' in data
    assert len(data['products']) > 0

@pytest.mark.asyncio
async def test_products_agent_process_query():
    '''Test products agent can process queries'''
    agent = ProductsAgent()
    result = await agent.process_query(
        'How is Cologuard performing?',
        {}
    )
    
    assert 'agent' in result
    assert 'response' in result
    assert result['agent'] == 'ProductsAgent'
