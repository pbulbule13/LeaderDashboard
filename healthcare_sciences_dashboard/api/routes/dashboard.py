from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from agents.products_agent import ProductsAgent
from agents.revenue_agent import RevenueAgent
from agents.budget_agent import BudgetAgent
from agents.support_agent import SupportAgent
from agents.workforce_agent import WorkforceAgent
from agents.stock_agent import StockAgent

router = APIRouter()
products_agent = ProductsAgent()
revenue_agent = RevenueAgent()
budget_agent = BudgetAgent()
support_agent = SupportAgent()
workforce_agent = WorkforceAgent()
stock_agent = StockAgent()

@router.get('/tiles/products')
async def get_products_tile() -> Dict[str, Any]:
    try:
        data = await products_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/revenue')
async def get_revenue_tile() -> Dict[str, Any]:
    try:
        data = await revenue_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/budget')
async def get_budget_tile() -> Dict[str, Any]:
    try:
        data = await budget_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/support')
async def get_support_tile() -> Dict[str, Any]:
    try:
        data = await support_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/workforce')
async def get_workforce_tile() -> Dict[str, Any]:
    try:
        data = await workforce_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/stock')
async def get_stock_tile() -> Dict[str, Any]:
    try:
        data = await stock_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/all')
async def get_all_tiles() -> Dict[str, Any]:
    try:
        products_data = await products_agent.get_tile_data()
        revenue_data = await revenue_agent.get_tile_data()
        budget_data = await budget_agent.get_tile_data()
        support_data = await support_agent.get_tile_data()
        workforce_data = await workforce_agent.get_tile_data()
        stock_data = await stock_agent.get_tile_data()
        
        return {
            'success': True,
            'data': {
                'products': products_data,
                'revenue': revenue_data,
                'budget': budget_data,
                'support': support_data,
                'workforce': workforce_data,
                'stock': stock_data,
                'timestamp': '2025-10-17T08:45:00Z'
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))