from fastapi.testclient import TestClient
from api.server import app


client = TestClient(app)


def test_tts_synthesize_base64():
    r = client.post("/voice-agent/voice/tts", json={"text": "Hello CEO"})
    assert r.status_code == 200
    body = r.json()
    assert "audio_base64" in body
    assert body.get("mime_type") == "audio/wav"

