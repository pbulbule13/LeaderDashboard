"""
Voice Agent API Routes
FastAPI endpoints for the voice-enabled email & calendar automation system
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Literal
try:
    from ..orchestrator import VoiceAgentOrchestrator
    from ..models.settings import SystemSettings
except Exception:
    VoiceAgentOrchestrator = None  # type: ignore
    SystemSettings = None  # type: ignore
import json
from ..utils.email_query import parse_email_nl_to_gmail_query

# Initialize router
router = APIRouter(prefix="/voice-agent", tags=["voice-agent"])

# Initialize orchestrator (in production, use dependency injection)
class _StubOrchestrator:
    async def process_query(self, *args, **kwargs):
        return {"text": "stub", "intent": "unknown", "drafts": [], "calendar_actions": [], "executed": [], "logs": []}

try:
    settings = SystemSettings() if SystemSettings else None
    orchestrator = VoiceAgentOrchestrator(settings=settings) if VoiceAgentOrchestrator else _StubOrchestrator()
except Exception:
    orchestrator = _StubOrchestrator()


# Request/Response Models
class QueryRequest(BaseModel):
    """Request model for processing queries"""
    query: str
    mode: Literal["voice", "text"] = "text"
    user_id: str | None = None
    session_id: str | None = None
    authorization_code: str | None = None


class QueryResponse(BaseModel):
    """Response model for query results"""
    text: str
    intent: str
    drafts: list[dict] = []
    calendar_actions: list[dict] = []
    executed: list[dict] = []
    logs: list[dict] = []
    session_id: str | None = None
    error: str | None = None


# API Endpoints

@router.post("/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """
    Process a user query through the voice agent system.

    This endpoint accepts natural language queries and returns:
    - Email drafts
    - Calendar action proposals
    - Executed actions (if authorized)
    - Complete action logs

    Example queries:
    - "What's in my inbox?"
    - "Draft a reply to John's email about the Q4 review"
    - "Do I have any meetings tomorrow?"
    - "Accept the board meeting invite"
    """
    try:
        if orchestrator is None:
            # Minimal stub response when full orchestrator isn't available
            return QueryResponse(
                text="Stubbed voice response (orchestrator unavailable)",
                intent="unknown",
                drafts=[],
                calendar_actions=[],
                executed=[],
                logs=[],
                session_id=request.session_id,
                error=None,
            )

        result = await orchestrator.process_query(
            query=request.query,
            mode=request.mode,
            user_id=request.user_id,
            session_id=request.session_id,
            authorization_code=request.authorization_code
        )

        return QueryResponse(
            text=result.get("text", ""),
            intent=result.get("intent", "unknown"),
            drafts=result.get("drafts", []),
            calendar_actions=result.get("calendar_actions", []),
            executed=result.get("executed", []),
            logs=result.get("logs", []),
            session_id=request.session_id,
            error=result.get("error")
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/inbox/summary")
async def summarize_inbox(user_id: str | None = None):
    """
    Get a summary of the user's inbox.

    Returns prioritized emails that need attention, with AI-generated reasoning.
    """
    try:
        result = await orchestrator.summarize_inbox(user_id=user_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Direct Email Send API (no authorization code required) ---
class EmailSendRequest(BaseModel):
    to: list[str] | str
    subject: str
    body: str
    cc: list[str] | None = None
    bcc: list[str] | None = None
    thread_id: str | None = None


@router.post("/email/send")
async def send_email_direct(request: EmailSendRequest):
    """
    Send an email directly via the configured email adapter.

    This endpoint is intended for UI flows like "Approve & Send" and does
    not require an authorization code. If Gmail credentials are not present,
    the Gmail adapter falls back to mock mode and still returns success.
    """
    try:
        # Lazy import to avoid circulars when running minimal routes
        from voice_agent.adapters.email.gmail_adapter import GmailAdapter

        adapter = GmailAdapter()
        to_list = request.to if isinstance(request.to, list) else [request.to]

        result = await adapter.send_email(
            to=to_list,
            subject=request.subject,
            body=request.body,
            cc=request.cc or [],
            bcc=request.bcc or [],
            thread_id=request.thread_id
        )

        if not result.get("success", False):
            raise HTTPException(status_code=500, detail=result.get("error", "Failed to send email"))

        return {
            "success": True,
            "message_id": result.get("message_id"),
            "thread_id": result.get("thread_id")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Calendar Events API ---
@router.get("/calendar/events")
async def get_calendar_events(timeframe: str = "week"):
    """
    Return calendar events for a timeframe: "today", "tomorrow", "week".
    Uses the orchestrator's calendar adapter (mock if not configured).
    """
    from datetime import datetime, timedelta, timezone

    try:
        adapter = orchestrator.calendar_adapter
        if adapter is None:
            # Fallback to mock Google adapter
            from voice_agent.adapters.calendar.google_calendar_adapter import GoogleCalendarAdapter
            adapter = GoogleCalendarAdapter()

        now = datetime.now(timezone.utc)
        if timeframe in ("today", "day"):
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(days=1)
        elif timeframe in ("tomorrow",):
            start = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(days=1)
        else:  # week (default)
            start = now - timedelta(days=now.weekday())  # Monday
            start = start.replace(hour=0, minute=0, second=0, microsecond=0)
            end = start + timedelta(days=7)

        events = await adapter.get_events(start_time=start, end_time=end)
        return {"events": events}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/emails/search")
async def search_emails(nl: str, max_results: int = 25, unread_only: bool = False):
    """
    Search emails using a simple natural-language filter.

    Example: nl="show me emails from recruiters" → Gmail query with recruiter terms.
    """
    try:
        from voice_agent.adapters.email.gmail_adapter import GmailAdapter

        gmail_query = parse_email_nl_to_gmail_query(nl)

        gmail = GmailAdapter()
        threads = await gmail.fetch_threads(
            max_results=max_results,
            unread_only=unread_only,
            query=gmail_query
        )

        emails = []
        for thread in threads:
            emails.append({
                "id": thread.get("thread_id", ""),
                "from": thread.get("from", "Unknown"),
                "subject": thread.get("subject", "No Subject"),
                "preview": thread.get("preview", "")[:200],
                "date": thread.get("timestamp", ""),
                "unread": thread.get("unread", False)
            })

        return {"emails": emails, "count": len(emails), "query": gmail_query}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/emails")
async def get_emails(max_results: int = 10, query: str | None = None, unread_only: bool = False):
    """
    Get a simple list of emails from Gmail.

    Returns a clean list of email threads for display in the dashboard.
    """
    try:
        import sys
        import os
        from pathlib import Path

        # Add parent directory to path for imports
        current_dir = Path(__file__).parent.parent.parent
        if str(current_dir) not in sys.path:
            sys.path.insert(0, str(current_dir))

        from voice_agent.adapters.email.gmail_adapter import GmailAdapter

        # Initialize Gmail adapter (uses environment variables internally)
        gmail = GmailAdapter()

        # Get recent email threads (optionally filtered by Gmail query)
        threads = await gmail.fetch_threads(
            max_results=max_results,
            unread_only=unread_only,
            query=query
        )

        # Format for dashboard
        emails = []
        for thread in threads:
            emails.append({
                "id": thread.get("thread_id", ""),
                "from": thread.get("from", "Unknown"),
                "subject": thread.get("subject", "No Subject"),
                "preview": thread.get("preview", "")[:200],
                "date": thread.get("timestamp", ""),
                "unread": thread.get("unread", False)
            })

        return {
            "emails": emails,
            "count": len(emails)
        }
    except Exception as e:
        import traceback
        print(f"Error fetching emails: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/calendar/check")
async def check_calendar(
    timeframe: str = "today",
    user_id: str | None = None
):
    """
    Check calendar for a specific timeframe.

    Args:
        timeframe: "today", "tomorrow", "this week", etc.
        user_id: Optional user identifier
    """
    try:
        result = await orchestrator.check_calendar(
            timeframe=timeframe,
            user_id=user_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """
    Retrieve a session by ID.

    Used for continuing conversations and tracking pending actions.
    """
    session = await orchestrator.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.get("/config")
async def get_config():
    """
    Get current voice agent configuration.

    Returns the agent name, providers, and other settings.
    """
    return {
        "agent_name": orchestrator.get_agent_name(),
        "email_provider": settings.email_provider,
        "calendar_provider": settings.calendar_provider,
        "tts_provider": settings.tts_provider,
        "stt_provider": settings.stt_provider,
        "cloud_provider": settings.cloud_provider
    }


@router.post("/tts")
async def text_to_speech(request: dict):
    """
    Convert text to speech using ElevenLabs API.

    Args:
        text: The text to convert to speech

    Returns:
        Audio file as bytes (MP3 format)
    """
    import os
    from elevenlabs.client import ElevenLabs
    from fastapi.responses import Response

    try:
        text = request.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="No text provided")

        # Get API key and voice ID from environment
        api_key = os.getenv("ELEVENLABS_API_KEY")
        voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")

        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="ElevenLabs API key not configured"
            )

        # Initialize ElevenLabs client
        client = ElevenLabs(api_key=api_key)

        # Generate speech using the new API
        audio_generator = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_monolingual_v1"
        )

        # Convert generator to bytes
        audio_bytes = b"".join(audio_generator)

        # Return audio as MP3
        return Response(
            content=audio_bytes,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=speech.mp3"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")


@router.websocket("/ws")
async def voice_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time voice interactions.

    Supports streaming audio input/output for hands-free voice control.
    """
    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)

            # Process based on message type
            if message["type"] == "query":
                result = await orchestrator.process_query(
                    query=message["query"],
                    mode="voice",
                    user_id=message.get("user_id"),
                    session_id=message.get("session_id"),
                    authorization_code=message.get("authorization_code")
                )

                # Send response back
                await websocket.send_json(result)

            elif message["type"] == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close()
