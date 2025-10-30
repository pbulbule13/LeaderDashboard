import io
import wave
from typing import Tuple
from .base import BaseSpeechToText, BaseTextToSpeech


class MockSTT(BaseSpeechToText):
    async def transcribe(self, audio_bytes: bytes, mime_type: str = "audio/wav") -> str:
        # In tests/mock mode, just return a fixed string
        return "mock transcription"


class MockTTS(BaseTextToSpeech):
    async def synthesize(self, text: str, voice: str | None = None) -> Tuple[bytes, str]:
        # Generate a tiny silent WAV placeholder (1 second, 16kHz mono)
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)  # 16-bit
            wf.setframerate(16000)
            wf.writeframes(b"\x00\x00" * 16000)
        return buf.getvalue(), "audio/wav"

