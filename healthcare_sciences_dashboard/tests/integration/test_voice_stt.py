from fastapi.testclient import TestClient
from api.server import app


client = TestClient(app)


def test_stt_transcribe_mock():
    # Empty audio is acceptable for mock
    r = client.post("/voice-agent/voice/stt", json={"audio_base64": "", "mime_type": "audio/wav"})
    assert r.status_code == 200
    body = r.json()
    assert body.get("text") == "mock transcription"

