
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import sys
from pathlib import Path

# Ensure parent directory is in path
root_dir = Path(__file__).resolve().parent.parent
# Ensure both possible roots are on sys.path so that 'data.*' and other
# absolute imports work whether the app is copied to /app or /app/healthcare_sciences_dashboard
alt_root = root_dir / "healthcare_sciences_dashboard"
for p in [root_dir, alt_root]:
    p_str = str(p)
    if p_str not in sys.path:
        sys.path.insert(0, p_str)

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

# Serve static dashboard files under /dash (e.g., /dash/dashboard.html, /dash/config.js)
try:
    static_dir = root_dir  # healthcare_sciences_dashboard directory
    app.mount("/dash", StaticFiles(directory=str(static_dir)), name="dash")
    print(f"[OK] Static files mounted at /dash -> {static_dir}")
except Exception as e:
    print(f"[WARNING] Could not mount static files: {e}")

@app.get('/')
async def root():
    return {
        'message': 'HealthCare Sciences CEO Dashboard API',
        'version': '2.0.0',
        'status': 'running',
        'endpoints': {
            'health': '/health',
            'docs': '/docs',
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
            'query': '/api/query/ask',
            'voice_agent': '/voice-agent/query',
            'inbox_summary': '/voice-agent/inbox/summary',
            'calendar_check': '/voice-agent/calendar/check',
            'voice_websocket': '/voice-agent/ws'
        }
    }

@app.get('/health')
async def health_check():
    return {'status': 'healthy'}

# Import and register routes
# Load routers independently so one failure doesn't block others
try:
    from api.routes.dashboard import router as dashboard_router
    app.include_router(dashboard_router, prefix='/api/dashboard', tags=['dashboard'])
    print('[OK] Dashboard routes loaded')
except Exception as e:
    print(f'[WARNING] Could not load dashboard routes: {e}')

try:
    from api.routes.query import router as query_router
    app.include_router(query_router, prefix='/api/query', tags=['query'])
    print('[OK] Query routes loaded')
except Exception as e:
    print(f'[WARNING] Could not load query routes: {e}')

try:
    from ui.routes import router as ui_router
    app.include_router(ui_router)
    print('[OK] UI routes loaded')
except Exception as e:
    print(f'[WARNING] Could not load UI routes: {e}')
    print('Proceeding without /ui endpoints')

# Import and register voice agent routes
try:
    from voice_agent.api.routes import router as voice_agent_router

    app.include_router(voice_agent_router, tags=['voice-agent'])

    print('[OK] Voice Agent routes loaded successfully')
    print('     • Voice Agent API: /voice-agent/query')
    print('     • Inbox Summary: /voice-agent/inbox/summary')
    print('     • Calendar Check: /voice-agent/calendar/check')
    print('     • WebSocket: /voice-agent/ws')
except Exception as e:
    print(f'[WARNING] Could not load voice agent routes: {e}')
    print('Voice Agent endpoints not available')

if __name__ == '__main__':
    print(f'Starting HealthCare Sciences Dashboard API on port {config.PORT}...')
    uvicorn.run(
        app,
        host='0.0.0.0',
        port=config.PORT,
        reload=config.DEBUG
    )
