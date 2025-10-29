from fastapi import APIRouter, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pathlib import Path
import asyncio

from agents.tab_qa_agent import TabQAAgent


router = APIRouter(prefix="/ui", tags=["ui"])

# Configure Jinja2 templates under this package directory
_templates_dir = Path(__file__).parent / "templates"
templates = Jinja2Templates(directory=str(_templates_dir))


_DEFAULT_TABS = [
    ("overview", "Dashboard Overview"),
    ("orders", "Orders"),
    ("compliance", "Compliance"),
    ("reimbursement", "Reimbursement"),
    ("costs", "Costs"),
    ("lab", "Lab"),
    ("regional", "Regional"),
    ("forecasting", "Forecasting"),
    ("market", "Market"),
    ("milestones", "Projects"),
]


@router.get("/", response_class=HTMLResponse)
async def ui_home(request: Request):
    return templates.TemplateResponse(
        "ask.html",
        {
            "request": request,
            "tabs": _DEFAULT_TABS,
            "selected_tab": "overview",
            "question": "",
            "answer": None,
            "error": None,
        },
    )


@router.post("/ask", response_class=HTMLResponse)
async def ui_ask(
    request: Request,
    question: str = Form(...),
    tab: str = Form("overview"),
):
    agent = TabQAAgent()
    answer = None
    error = None

    try:
        result = await agent.ask(question=question.strip(), tab=tab.strip(), tab_data=None)
        if result.get("success"):
            answer = result.get("answer")
        else:
            error = result.get("error", "Failed to get a response")
    except Exception as e:
        error = str(e)

    return templates.TemplateResponse(
        "ask.html",
        {
            "request": request,
            "tabs": _DEFAULT_TABS,
            "selected_tab": tab,
            "question": question,
            "answer": answer,
            "error": error,
        },
    )

