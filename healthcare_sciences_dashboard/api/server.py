
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
from pathlib import Path

# Ensure parent directory is in path
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))

from app_config import config

app = FastAPI(
    title='HealthCare Sciences CEO Dashboard API',
    description='Agentic AI Dashboard Backend',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get('/')
async def root():
    return {
        'message': 'HealthCare Sciences CEO Dashboard API',
        'version': '2.0.0',
        'status': 'running',
        'endpoints': {
            'health': '/health',
            'overview': '/api/dashboard/overview',
            'order_volume': '/api/dashboard/tiles/order-volume',
            'compliance': '/api/dashboard/tiles/compliance',
            'reimbursement': '/api/dashboard/tiles/reimbursement',
            'operating_costs': '/api/dashboard/tiles/operating-costs',
            'lab_metrics': '/api/dashboard/tiles/lab-metrics',
            'regional': '/api/dashboard/tiles/regional',
            'forecasting': '/api/dashboard/tiles/forecasting',
            'market_intelligence': '/api/dashboard/tiles/market-intelligence',
            'milestones': '/api/dashboard/tiles/milestones',
            'products': '/api/dashboard/tiles/products',
            'stock': '/api/dashboard/tiles/stock',
            'all_tiles': '/api/dashboard/tiles/all',
            'query': '/api/query/ask'
        }
    }

@app.get('/health')
async def health_check():
    return {'status': 'healthy'}

# Import and register routes
try:
    from api.routes.dashboard import router as dashboard_router
    from api.routes.query import router as query_router
    
    app.include_router(dashboard_router, prefix='/api/dashboard', tags=['dashboard'])
    app.include_router(query_router, prefix='/api/query', tags=['query'])
    
    print('[OK] Routes loaded successfully')
except Exception as e:
    print(f'[WARNING] Could not load routes: {e}')
    print('API running with basic endpoints only')

if __name__ == '__main__':
    print(f'Starting HealthCare Sciences Dashboard API on port {config.PORT}...')
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=config.PORT,
        reload=config.DEBUG
    )
