from abc import ABC, abstractmethod
from typing import Tuple


class BaseSpeechToText(ABC):
    @abstractmethod
    async def transcribe(self, audio_bytes: bytes, mime_type: str = "audio/wav") -> str:
        """Convert audio bytes to text"""
        raise NotImplementedError


class BaseTextToSpeech(ABC):
    @abstractmethod
    async def synthesize(self, text: str, voice: str | None = None) -> Tuple[bytes, str]:
        """Convert text to audio bytes. Returns (audio_bytes, mime_type)."""
        raise NotImplementedError

