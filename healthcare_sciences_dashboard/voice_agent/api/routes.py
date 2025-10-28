"""
Voice Agent API Routes
FastAPI endpoints for the voice-enabled email & calendar automation system
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import Literal
from ..orchestrator import VoiceAgentOrchestrator
from ..models.settings import SystemSettings
import json

# Initialize router
router = APIRouter(prefix="/voice-agent", tags=["voice-agent"])

# Initialize orchestrator (in production, use dependency injection)
settings = SystemSettings()
orchestrator = VoiceAgentOrchestrator(settings=settings)


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
