from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from dashboard_orchestrator import DashboardOrchestrator

router = APIRouter()
orchestrator = DashboardOrchestrator()

class QueryRequest(BaseModel):
    query: str
    context: Dict[str, Any] = {}

@router.post("/ask")
async def process_query(request: QueryRequest) -> Dict[str, Any]:
    """Process a user query through the agent graph"""
    try:
        response = await orchestrator.process_query(
            request.query,
            request.context
        )
        return {"success": True, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))