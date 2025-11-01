import asyncio
from dashboard_orchestrator import DashboardOrchestrator

async def main():
    """Test the dashboard orchestrator"""
    orchestrator = DashboardOrchestrator()
    
    # Test queries
    queries = [
        "How is DiagnosticTest A performing?",
        "What's our revenue status?",
        "Show me budget for Q4",
        "Any critical support tickets?",
        "Tell me about employee headcount"
    ]
    
    for query in queries:
        print(f"\n{'='*60}")
        print(f"Query: {query}")
        print(f"{'='*60}")
        
        response = await orchestrator.process_query(query)
        print(f"\nResponse:\n{response}\n")

if __name__ == "__main__":
    asyncio.run(main())