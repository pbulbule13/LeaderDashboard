from fastapi.testclient import TestClient
from api.server import app
import pytest


client = TestClient(app)


def test_ui_home_loads():
    """GET /ui should render the Ask form without JavaScript."""
    r = client.get("/ui/")
    assert r.status_code == 200
    html = r.text
    assert "Executive Assistant" in html
    assert "<form" in html
    assert "name=\"question\"" in html


@pytest.mark.asyncio
async def test_ui_ask_post(monkeypatch):
    """POST /ui/ask should render the answer using TabQAAgent (stubbed)."""
    from ui import routes as ui_routes

    async def fake_ask(self, question: str, tab: str, tab_data=None):
        return {"success": True, "answer": f"UI stub for {tab}: {question}"}

    monkeypatch.setattr(ui_routes.TabQAAgent, "ask", fake_ask)

    r = client.post(
        "/ui/ask",
        data={"question": "What are key risks?", "tab": "overview"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert r.status_code == 200
    assert "UI stub for overview" in r.text

