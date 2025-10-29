import pytest
from fastapi.testclient import TestClient
from api.server import app


client = TestClient(app)


@pytest.mark.asyncio
async def test_ask_tab_success(monkeypatch):
    """Ensure /api/query/ask-tab returns success when agent succeeds."""
    from api.routes import query as query_routes

    async def fake_ask(question: str, tab: str, tab_data=None):
        return {
            "success": True,
            "answer": f"Stubbed answer for {tab}: {question}",
            "tab": tab,
            "tab_name": tab.capitalize(),
            "question": question,
            "has_reasoning": True,
            "model": "stub-model",
        }

    # Patch the module-level TabQAAgent instance
    monkeypatch.setattr(query_routes.tab_qa_agent, "ask", fake_ask)

    resp = client.post(
        "/api/query/ask-tab",
        json={
            "question": "Compare performance across all departments",
            "tab": "overview",
            "tab_data": {"dummy": True},
        },
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "Stubbed answer" in data["answer"]


def test_list_tabs():
    """List available tabs should respond successfully."""
    resp = client.get("/api/query/tabs")
    assert resp.status_code == 200
    body = resp.json()
    assert body.get("success") is True
    assert isinstance(body.get("tabs"), dict)

