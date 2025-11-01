from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
from dashboard_orchestrator import DashboardOrchestrator

# Robust TabQAAgent setup: fall back to a lightweight mock in TEST/MOCK mode
# or if the real agent cannot be created (e.g., missing API keys in Cloud Run).
try:
    from agents.tab_qa_agent import TabQAAgent  # real agent class

    def _create_tab_agent():
        if os.getenv("TEST_MODE") in ("1", "true", "True") or os.getenv("MOCK_LLM") in ("1", "true", "True"):
            raise RuntimeError("TEST_MODE enabled; using mock TabQAAgent")
        return TabQAAgent()
except Exception:
    # Import failed (package missing). Force mock below.
    def _create_tab_agent():
        raise RuntimeError("TabQAAgent import unavailable; using mock")

router = APIRouter()
orchestrator = DashboardOrchestrator()

# Safe instantiation that never fails at import time
try:
    tab_qa_agent = _create_tab_agent()
except Exception:
    class _MockTabQA:
        def __init__(self, *args, **kwargs):
            pass
        async def ask(self, question: str, tab: str, tab_data=None):
            return {
                "success": True,
                "answer": f"[mock] {tab}: {question}",
                "tab": tab,
                "tab_name": tab,
                "model": "mock"
            }
        def list_tabs(self):
            return {"overview": {"name": "Overview"}}
        def get_tab_info(self, tab: str):
            return {"name": tab}
    tab_qa_agent = _MockTabQA()

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
