from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from dashboard_orchestrator import DashboardOrchestrator
from agents.tab_qa_agent import TabQAAgent

router = APIRouter()
orchestrator = DashboardOrchestrator()
tab_qa_agent = TabQAAgent()

class QueryRequest(BaseModel):
    query: str
    context: Dict[str, Any] = {}

class TabQueryRequest(BaseModel):
    question: str
    tab: str
    tab_data: Optional[Dict[str, Any]] = None

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

@router.post("/ask-tab")
async def ask_tab_question(request: TabQueryRequest) -> Dict[str, Any]:
    """
    Ask a question about a specific dashboard tab with context-aware reasoning.
    The AI will analyze the question in the context of the specific tab and its data.
    """
    try:
        response = await tab_qa_agent.ask(
            question=request.question,
            tab=request.tab,
            tab_data=request.tab_data
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tabs")
async def list_tabs() -> Dict[str, Any]:
    """Get information about all available dashboard tabs"""
    try:
        tabs = tab_qa_agent.list_tabs()
        return {"success": True, "tabs": tabs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tabs/{tab}")
async def get_tab_info(tab: str) -> Dict[str, Any]:
    """Get information about a specific dashboard tab"""
    try:
        tab_info = tab_qa_agent.get_tab_info(tab)
        return {"success": True, "tab": tab, "info": tab_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))