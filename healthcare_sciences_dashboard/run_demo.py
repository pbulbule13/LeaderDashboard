import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from dashboard_orchestrator import DashboardOrchestrator

async def main():
    print('='*60)
    print('HealthCare Sciences Dashboard - Agent Demo')
    print('='*60)
    print()
    
    orchestrator = DashboardOrchestrator()
    
    queries = [
        'How is DiagnosticTest A performing?',
        'What is our revenue vs target this quarter?',
        'Show me product revenue breakdown',
        'Are we hitting our Q4 revenue goals?',
        'Which product has the highest margin?',
        'What is the variance in October revenue?'
    ]
    
    for i, query in enumerate(queries, 1):
        print(f'\\n[Query {i}/{len(queries)}]')
        print(f'Question: {query}')
        print('-'*60)
        
        try:
            response = await orchestrator.process_query(query)
            print(f'Response: {response}')
        except Exception as e:
            print(f'Error: {e}')
        
        print()
    
    print('='*60)
    print('Demo completed!')

if __name__ == '__main__':
    asyncio.run(main())
