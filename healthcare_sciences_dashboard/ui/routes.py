from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
try:
    from fastapi.templating import Jinja2Templates
except Exception:
    Jinja2Templates = None  # type: ignore
from pathlib import Path
import asyncio
from urllib.parse import parse_qs

try:
    from agents.tab_qa_agent import TabQAAgent  # real agent
except Exception:
    # Fallback placeholder to keep routes importable in minimal envs
    class TabQAAgent:  # type: ignore
        async def ask(self, question: str, tab: str, tab_data=None):
            return {"success": True, "answer": f"[mock-ui] {tab}: {question}"}


router = APIRouter(prefix="/ui", tags=["ui"])

# Configure Jinja2 templates under this package directory
_templates_dir = Path(__file__).parent / "templates"
if Jinja2Templates is not None:
    _tmp = None
    try:
        _tmp = Jinja2Templates(directory=str(_templates_dir))
    except AssertionError:
        _tmp = None
    templates = _tmp
else:
    templates = None  # HTML will be returned directly


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
    if templates is None:
        html = _render_fallback_html(tabs=_DEFAULT_TABS, selected_tab="overview", question="", answer=None, error=None)
        return HTMLResponse(html)
    else:
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
async def ui_ask(request: Request):
    # Parse urlencoded form manually to avoid python-multipart dependency
    if request.headers.get("content-type", "").startswith("application/x-www-form-urlencoded"):
        raw = (await request.body()).decode("utf-8", errors="ignore")
        form = {k: v[0] for k, v in parse_qs(raw).items()}
        question = form.get("question", "")
        tab = form.get("tab", "overview")
    else:
        question = ""
        tab = "overview"
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

    if templates is None:
        html = _render_fallback_html(tabs=_DEFAULT_TABS, selected_tab=tab, question=question, answer=answer, error=error)
        return HTMLResponse(html)
    else:
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


def _render_fallback_html(*, tabs, selected_tab, question, answer, error) -> str:
    # Simple server-side HTML when Jinja2 is not available
    options = "\n".join(
        [f'<option value="{val}"' + (" selected" if selected_tab == val else "") + f'>{label}</option>' for val, label in tabs]
    )
    answer_block = f'<div class="answer">{answer}</div>' if answer else ''
    error_block = f'<div class="error">{error}</div>' if error else ''
    return f"""
<!DOCTYPE html>
<html><head><meta charset='utf-8'><title>HCS Executive Assistant</title></head>
<body>
  <h1>Executive Assistant</h1>
  <form action="/ui/ask" method="post">
    <label>Context</label>
    <select name="tab">{options}</select>
    <br/>
    <label>Ask</label>
    <textarea name="question">{question}</textarea>
    <br/>
    <button type="submit">Ask Assistant</button>
  </form>
  {error_block}
  {answer_block}
</body></html>
"""
