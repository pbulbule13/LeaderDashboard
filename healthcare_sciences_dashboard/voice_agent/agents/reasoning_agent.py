"""
Reasoning Agent
Analyzes context and decides the best course of action
"""

from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from ..graph.state import VoiceAgentState
import json


class ReasoningAgent:
    """
    Reasons about emails, calendar, and context to determine:
    - Priority of emails
    - Whether to accept/decline meetings
    - What actions to take
    - Tone and approach for communications
    """

    def __init__(self, model_name: str = "gpt-4"):
        self.llm = ChatOpenAI(model=model_name, temperature=0.7)

        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are the reasoning engine for an executive assistant AI named {agent_name}.

Your job is to analyze emails, calendar events, and context to determine:
1. Priority level (high/medium/low) and WHY
2. Recommended action (reply, schedule, decline, snooze, etc.)
3. Reasoning behind your recommendation

Consider:
- Sender relationship and history
- Urgency and deadlines
- User's calendar and availability
- Context from previous interactions
- VIP domains: {vip_domains}

Be concise but thorough. Prioritize user's time and focus."""),
            ("human", """Intent: {intent}
User Query: {query}

Email Context: {email_context}
Calendar Context: {calendar_context}
Sender History: {sender_history}

Analyze this and provide:
1. Priority assessment
2. Recommended action
3. Reasoning""")
        ])

    async def run(self, state: VoiceAgentState) -> VoiceAgentState:
        """Run reasoning analysis"""
        intent = state["intent"]
        query = state["user_query"]

        # Prepare context
        email_context = json.dumps(state.get("email_threads", []), indent=2)
        calendar_context = json.dumps(state.get("calendar_events", []), indent=2)
        sender_history = json.dumps(state.get("sender_history", {}), indent=2)

        # Get settings (in real implementation, load from config)
        agent_name = "Vinegar"  # This would come from SystemSettings
        vip_domains = ["partner.com", "investor.org"]

        # Prepare prompt
        prompt_value = self.prompt.format_messages(
            agent_name=agent_name,
            vip_domains=", ".join(vip_domains),
            intent=intent,
            query=query,
            email_context=email_context,
            calendar_context=calendar_context,
            sender_history=sender_history
        )

        # Get LLM reasoning
        try:
            response = await self.llm.ainvoke(prompt_value)
            reasoning_text = response.content

            # Parse the reasoning (in production, use structured output)
            state["reasoning"] = reasoning_text
            state["priority_assessment"] = self._extract_priority(reasoning_text)
            state["recommended_action"] = self._extract_action(reasoning_text)

        except Exception as e:
            state["error"] = f"Reasoning error: {str(e)}"
            state["reasoning"] = "Unable to analyze context"
            state["recommended_action"] = "manual_review"

        return state

    def _extract_priority(self, reasoning: str) -> dict:
        """Extract priority assessment from reasoning text"""
        # Simple keyword-based extraction (in production, use structured output)
        if "high priority" in reasoning.lower() or "urgent" in reasoning.lower():
            return {"level": "high", "reason": "Urgent or high-priority sender"}
        elif "low priority" in reasoning.lower():
            return {"level": "low", "reason": "Routine or informational"}
        else:
            return {"level": "medium", "reason": "Standard priority"}

    def _extract_action(self, reasoning: str) -> str:
        """Extract recommended action from reasoning text"""
        reasoning_lower = reasoning.lower()
        if "draft a reply" in reasoning_lower or "respond" in reasoning_lower:
            return "draft_reply"
        elif "decline" in reasoning_lower:
            return "decline_meeting"
        elif "accept" in reasoning_lower:
            return "accept_meeting"
        elif "schedule" in reasoning_lower:
            return "propose_meeting"
        else:
            return "review"
