#!/usr/bin/env python
'''
HealthCare Sciences Dashboard - API Server Launcher
Run this from the project root directory
'''
import uvicorn
import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from app_config import config

def main():
    print('='*60)
    print('HealthCare Sciences CEO Dashboard API')
    print('='*60)
    print(f'Server: http://localhost:{config.PORT}')
    print(f'Health: http://localhost:{config.PORT}/health')
    print(f'Docs:   http://localhost:{config.PORT}/docs')
    print('='*60)
    print('Press CTRL+C to stop')
    print()
    
    uvicorn.run(
        'api.server:app',
        host='0.0.0.0',
        port=config.PORT,
        reload=config.DEBUG,
        log_level='info'
    )

if __name__ == '__main__':
    main()
