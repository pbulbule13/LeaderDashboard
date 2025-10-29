import pytest
from fastapi.testclient import TestClient
from api.server import app


client = TestClient(app)


@pytest.mark.asyncio
async def test_voice_agent_query_stub(monkeypatch):
    """Stub orchestrator.process_query to validate /voice-agent/query wiring without calling LLMs."""
    from voice_agent.api import routes as va_routes

    async def fake_process_query(*args, **kwargs):
        return {
            "text": "Stubbed voice response",
            "intent": "summarize",
            "drafts": [],
            "calendar_actions": [],
            "executed": [],
            "logs": [],
        }

    monkeypatch.setattr(va_routes.orchestrator, "process_query", fake_process_query)

    r = client.post(
        "/voice-agent/query",
        json={"query": "What's in my inbox?", "mode": "text"},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["text"] == "Stubbed voice response"
    assert body["intent"] == "summarize"

