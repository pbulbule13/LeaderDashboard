from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from agents.products_agent import ProductsAgent
from agents.revenue_agent import RevenueAgent
from agents.budget_agent import BudgetAgent
from agents.support_agent import SupportAgent
from agents.workforce_agent import WorkforceAgent
from agents.stock_agent import StockAgent
from agents.order_volume_agent import OrderVolumeAgent
from agents.compliance_agent import ComplianceAgent
from agents.reimbursement_agent import ReimbursementAgent
from agents.operating_costs_agent import OperatingCostsAgent
from agents.lab_metrics_agent import LabMetricsAgent
from agents.regional_agent import RegionalAgent
from agents.forecasting_agent import ForecastingAgent
from agents.market_intelligence_agent import MarketIntelligenceAgent
from agents.milestones_agent import MilestonesAgent

router = APIRouter()
# Existing agents
products_agent = ProductsAgent()
revenue_agent = RevenueAgent()
budget_agent = BudgetAgent()
support_agent = SupportAgent()
workforce_agent = WorkforceAgent()
stock_agent = StockAgent()
# New agents
order_volume_agent = OrderVolumeAgent()
compliance_agent = ComplianceAgent()
reimbursement_agent = ReimbursementAgent()
operating_costs_agent = OperatingCostsAgent()
lab_metrics_agent = LabMetricsAgent()
regional_agent = RegionalAgent()
forecasting_agent = ForecastingAgent()
market_intelligence_agent = MarketIntelligenceAgent()
milestones_agent = MilestonesAgent()

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

# New endpoints for CEO dashboard tiles
@router.get('/tiles/order-volume')
async def get_order_volume_tile() -> Dict[str, Any]:
    try:
        data = await order_volume_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/compliance')
async def get_compliance_tile() -> Dict[str, Any]:
    try:
        data = await compliance_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/reimbursement')
async def get_reimbursement_tile() -> Dict[str, Any]:
    try:
        data = await reimbursement_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/operating-costs')
async def get_operating_costs_tile() -> Dict[str, Any]:
    try:
        data = await operating_costs_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/lab-metrics')
async def get_lab_metrics_tile() -> Dict[str, Any]:
    try:
        data = await lab_metrics_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/regional')
async def get_regional_tile() -> Dict[str, Any]:
    try:
        data = await regional_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/forecasting')
async def get_forecasting_tile() -> Dict[str, Any]:
    try:
        data = await forecasting_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/market-intelligence')
async def get_market_intelligence_tile() -> Dict[str, Any]:
    try:
        data = await market_intelligence_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/tiles/milestones')
async def get_milestones_tile() -> Dict[str, Any]:
    try:
        data = await milestones_agent.get_tile_data()
        return {'success': True, 'data': data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/overview')
async def get_overview() -> Dict[str, Any]:
    """Get overview dashboard with all tiles summary"""
    try:
        # Fetch all tile data in parallel
        order_volume_data = await order_volume_agent.get_tile_data()
        compliance_data = await compliance_agent.get_tile_data()
        reimbursement_data = await reimbursement_agent.get_tile_data()
        revenue_data = await revenue_agent.get_tile_data()
        operating_costs_data = await operating_costs_agent.get_tile_data()
        lab_metrics_data = await lab_metrics_agent.get_tile_data()
        regional_data = await regional_agent.get_tile_data()
        forecasting_data = await forecasting_agent.get_tile_data()
        market_intelligence_data = await market_intelligence_agent.get_tile_data()
        milestones_data = await milestones_agent.get_tile_data()
        products_data = await products_agent.get_tile_data()
        stock_data = await stock_agent.get_tile_data()

        return {
            'success': True,
            'data': {
                'order_volume': order_volume_data,
                'compliance': compliance_data,
                'reimbursement': reimbursement_data,
                'financial': revenue_data,
                'operating_costs': operating_costs_data,
                'lab_metrics': lab_metrics_data,
                'regional': regional_data,
                'forecasting': forecasting_data,
                'market_intelligence': market_intelligence_data,
                'milestones': milestones_data,
                'products': products_data,
                'stock': stock_data,
                'timestamp': '2025-10-23T00:00:00Z'
            }
        }
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