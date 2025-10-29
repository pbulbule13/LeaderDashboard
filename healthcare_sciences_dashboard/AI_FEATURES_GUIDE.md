# AI Features Guide
## Tab-Specific Q&A and Enhanced Voice Agent

This guide explains the new AI-powered features that make your dashboard intelligent and context-aware.

---

## 🎯 Overview

Two major AI features have been implemented:

1. **Tab-Specific "Ask Me Anything"** - Context-aware AI assistant for each dashboard tab
2. **Enhanced Voice Agent ("Vinegar")** - Friendly, reasoning-capable personal secretary with full Communications tab management

---

## 📊 Tab-Specific Q&A

### What It Does

Every dashboard tab now has its own intelligent AI assistant that understands the context of what you're viewing. Ask questions about any metric, and get answers with reasoning and insights.

### How It Works

**Backend: Tab Q&A Agent** (`agents/tab_qa_agent.py`)
- Context-aware analysis for each dashboard tab
- Powered by Claude 3.5 Sonnet for deep reasoning
- Understands 12 different tab contexts (Overview, Communications, Orders, Compliance, etc.)
- Provides specific insights based on current data

**API Endpoints** (`api/routes/query.py`)
```
POST /api/query/ask-tab
- question: Your question
- tab: Current tab identifier
- tab_data: Current data displayed on the tab

GET /api/tabs
- Get information about all available tabs

GET /api/tabs/{tab}
- Get information about a specific tab
```

**Frontend Integration** (`dashboard.js`)
- Tracks current active tab automatically
- Displays tab context in AI panel header
- Shows which tab AI is analyzing
- Sends tab-specific data with queries

### Available Tab Contexts

Each tab has specialized knowledge:

| Tab | Context | Capabilities |
|-----|---------|--------------|
| **Overview** | Executive summary | Compare metrics, identify trends, highlight issues |
| **Communications** | Email management | Summarize inbox, draft responses, prioritize |
| **Personal** | Calendar & tasks | Manage schedule, track goals, productivity insights |
| **Orders** | Order tracking | Analyze trends, growth analysis, forecasting |
| **Compliance** | Quality metrics | Track compliance, analyze returns, quality issues |
| **Reimbursement** | Claims processing | Monitor reimbursement, analyze rejections |
| **Costs** | Operating expenses | Cost breakdown, trends, optimization opportunities |
| **Lab** | Lab performance | TAT, capacity, quality, efficiency metrics |
| **Regional** | Territory analysis | Regional performance, geographic trends |
| **Forecasting** | Predictions | Future projections, growth predictions |
| **Market** | Market intelligence | News summaries, competitor analysis, trends |
| **Milestones** | Project tracking | FDA submissions, project status, timelines |

### Example Queries

**On Orders Tab:**
- "What's driving the growth this quarter?"
- "Which regions are underperforming?"
- "How does this compare to last year?"

**On Compliance Tab:**
- "Why is the return rate increasing?"
- "What quality issues should I focus on?"
- "Are we meeting compliance targets?"

**On Costs Tab:**
- "Where are we overspending?"
- "What are the biggest cost drivers?"
- "How can we optimize AWS costs?"

### Usage

1. **Navigate to any tab** - The AI automatically knows which tab you're on
2. **Click the AI button** (bottom right) to open the AI panel
3. **Ask your question** - AI will respond with context-aware insights
4. **Tab indicator** shows which tab AI is analyzing (e.g., "📈 Orders")

---

## 🎙️ Enhanced Voice Agent: "Vinegar"

### What's New

The voice agent has been completely enhanced to be:
- **More friendly and conversational** - Talks like a trusted colleague, not a robot
- **Reasoning-capable** - Explains decisions with strategic thinking
- **Proactive and protective** - Acts as a personal secretary who guards your time
- **Communications-aware** - Full management of the Communications tab

### Architecture

**Voice Agent Pipeline:**

```
1. Intent Classification → What does the CEO want?
2. Context Retrieval → Fetch relevant emails, calendar, history
3. Strategic Reasoning → Assess priority, decide best action
4. Draft Generation → Create emails or calendar proposals
5. Authorization Check → Request auth code if needed
6. Action Execution → Perform approved actions
7. Response Generation → Friendly, human-like response
8. Action Logging → Record everything for audit trail
```

### Key Components

**1. Enhanced Reasoning Agent** (`voice_agent/agents/reasoning_agent.py`)
- Acts as strategic advisor, not just a processor
- Explains reasoning like a knowledgeable colleague
- Protective of CEO's time and attention
- Considers business impact and priorities
- Proactive about suggesting follow-ups

**2. Response Generation Agent** (`voice_agent/agents/response_agent.py`)
- Natural, conversational responses
- Warm and professional personality
- Uses contractions and casual language
- Shows empathy and understanding
- Offers next steps and follow-ups

**3. Enhanced Intent Classification** (`voice_agent/agents/intent_agent.py`)
New intents for Communications management:
- `manage_communications` - Manage Communications tab
- `send_email` - Send or compose new email
- `archive_email` - Archive, delete, organize emails
- `prioritize_inbox` - Help prioritizing inbox

### Personality Traits

**"Vinegar" acts like:**
- A trusted personal secretary
- Someone who truly cares about helping
- A strategic advisor who thinks ahead
- A protective gatekeeper of your time
- A proactive problem-solver

**Communication style:**
- Warm greetings and acknowledgments
- Concise but thorough
- Always provides reasoning
- Uses phrases like "I've reviewed...", "Based on my analysis...", "I recommend..."
- Ends with helpful offers: "Would you like me to...", "I can also...", "Shall I..."

### Voice Agent API

**Main Endpoints:**

```
POST /voice-agent/query
- Process natural language queries
- Returns: drafts, actions, reasoning, logs

GET /voice-agent/inbox/summary
- AI-generated inbox summary with priorities

GET /voice-agent/emails
- Fetch recent emails from Gmail

POST /voice-agent/email/send
- Send email directly (no auth code required)

GET /voice-agent/calendar/events
- Get calendar events for timeframe

GET /voice-agent/calendar/check
- Check calendar with natural language

POST /voice-agent/tts
- Text-to-speech conversion (ElevenLabs)

WebSocket /voice-agent/ws
- Real-time voice interactions
```

### Communications Tab Management

The voice agent can now fully manage your Communications tab:

**Email Management:**
- Summarize inbox with priority assessment
- Draft replies with appropriate tone
- Send emails with approval
- Archive or organize messages
- Flag urgent communications

**Smart Features:**
- VIP sender recognition
- Urgency detection
- Calendar conflict checking
- Strategic prioritization
- Follow-up recommendations

### Example Interactions

**Inbox Triage:**
```
You: "What's in my inbox that needs my attention?"

Vinegar: "Good morning! I've reviewed your inbox and here's what needs
your attention today:

🔴 URGENT (2 emails):
- Board meeting agenda from Sarah Chen - requires your input by EOD
- FDA submission question from Dr. Williams - blocking the team

🟡 HIGH PRIORITY (3 emails):
- Q4 budget review from Finance - meeting prep needed
- Partnership proposal from Vertex - strategic opportunity
- Customer escalation from Support - high-value client

The rest can wait. Would you like me to draft replies to any of these?"
```

**Strategic Email Reply:**
```
You: "Draft a reply to the FDA submission question"

Vinegar: "I've drafted a response to Dr. Williams. Here's my approach:

Since this is blocking the team and FDA submissions are critical to our
timeline, I've prioritized a quick, clear response with specific guidance
and an offer to schedule a follow-up call if needed.

[Shows draft]

The tone is professional but supportive - we want to unblock the team
quickly while ensuring accuracy. Shall I send this?"
```

**Calendar Management:**
```
You: "What's my schedule today?"

Vinegar: "You have a busy day ahead! Here's your schedule:

📅 Today, October 29:
- 9:00 AM: Leadership standup (30 min)
- 10:30 AM: Budget review with Finance (1 hour)
- 1:00 PM: Lunch with potential investor
- 3:00 PM: FDA submission strategy call (1 hour)

You have 2 open slots: 11:30 AM-12:30 PM and 4:00 PM-5:00 PM.

I noticed the board meeting email - would you like me to find time
this week to prepare for that?"
```

---

## 🛠️ Technical Implementation

### Tab Q&A Implementation

**1. Backend Agent** (`agents/tab_qa_agent.py`)
```python
# Creates context-aware AI for each tab
tab_qa_agent = TabQAAgent(model_name="claude-3-5-sonnet-20241022")

# Answer question with tab context
response = await tab_qa_agent.ask(
    question="Why are costs increasing?",
    tab="costs",
    tab_data=current_costs_data
)
```

**2. API Route** (`api/routes/query.py`)
```python
@router.post("/ask-tab")
async def ask_tab_question(request: TabQueryRequest):
    response = await tab_qa_agent.ask(
        question=request.question,
        tab=request.tab,
        tab_data=request.tab_data
    )
    return response
```

**3. Frontend Integration** (`dashboard.js`)
```javascript
// Track current tab
let currentTab = 'overview';
let currentTabData = null;

// Update on tab switch
function switchTab(tabName) {
    currentTab = tabName;
    updateAIPanelContext(tabName);
    // Load tab data...
}

// Ask question with context
async function askAI() {
    const response = await fetch('/api/query/ask-tab', {
        method: 'POST',
        body: JSON.stringify({
            question: query,
            tab: currentTab,
            tab_data: currentTabData
        })
    });
}
```

### Voice Agent Enhancement

**1. Enhanced Graph** (`voice_agent/graph/graph_builder.py`)
```python
# Updated pipeline with response generation
workflow.add_node("classify_intent", intent_agent.run)
workflow.add_node("retrieve_context", context_agent.run)
workflow.add_node("reason", reasoning_agent.run)
workflow.add_node("generate_drafts", draft_agent.run)
workflow.add_node("check_authorization", auth_agent.run)
workflow.add_node("execute_actions", execution_agent.run)
workflow.add_node("generate_response", response_agent.run)  # NEW
workflow.add_node("log_actions", logging_agent.run)
```

**2. Response Agent** (`voice_agent/agents/response_agent.py`)
```python
# Generates friendly, human-like responses
response_agent = ResponseGenerationAgent()

# Creates natural conversation
response = await response_agent.run(state)
# Returns warm, professional, strategic response
```

**3. Enhanced Reasoning** (`voice_agent/agents/reasoning_agent.py`)
```python
# Strategic thinking prompts
"""
Act as the CEO's trusted personal secretary.
Protect their time, anticipate their needs.
Think strategically about business impact.
Be proactive with follow-ups and suggestions.
"""
```

---

## 🚀 Usage Examples

### Tab-Specific Q&A

```javascript
// Example 1: Overview Tab
Tab: Overview
Question: "What are the biggest concerns this month?"
Answer: "Based on the dashboard data, I see three areas needing attention:

1. **Reimbursement Rate** (87.3%) - Down 2.1% from last month. The
   increase in claim rejections is concerning and could impact cash flow.

2. **Lab Capacity** (89.4%) - Approaching operational limits. This could
   cause TAT delays if orders continue growing at current rate.

3. **Operating Costs** ($2.8M) - Up 8% month-over-month, primarily due
   to AWS costs and contractor expenses.

I recommend prioritizing the reimbursement issues first, as they have the
most immediate financial impact."

// Example 2: Orders Tab
Tab: Orders
Question: "Which regions should we focus on for Q4?"
Answer: "Looking at the regional breakdown, I recommend focusing on:

1. **Northeast** (+24% growth) - Strong momentum, should continue investing
2. **West Coast** (-5% decline) - Needs attention, possibly territory
   coverage or competitive pressure
3. **Southwest** (Flat) - Untapped potential, consider increased resources

The Northeast is your star performer with the highest growth rate AND
highest absolute volume. The West Coast decline is concerning given the
market size - I'd investigate competitor activity there."
```

### Voice Agent Interactions

```javascript
// Example 1: Inbox Summarization
POST /voice-agent/query
{
    "query": "Summarize my inbox",
    "mode": "text"
}

Response:
{
    "text": "I've reviewed your inbox - you have 47 emails, and here are
    the 8 that need your attention:\n\n**Urgent (3):**\n- Board meeting
    prep (Sarah Chen)\n- FDA question blocking team (Dr. Williams)\n-
    Investor follow-up needed (John Smith)\n\n**High Priority (5):**\n[...]\n\n
    Would you like me to draft replies to any of these?",
    "intent": "triage_inbox",
    "reasoning": "Prioritized based on sender importance, urgency
    indicators, and business impact...",
    "drafts": [],
    "calendar_actions": []
}

// Example 2: Draft Reply
POST /voice-agent/query
{
    "query": "Draft a reply to the FDA question",
    "mode": "text"
}

Response:
{
    "text": "I've drafted a response to Dr. Williams about the FDA
    submission. My approach:\n\n**Strategy:** Quick, clear response to
    unblock the team\n**Tone:** Professional but supportive\n**Key Points:**\n
    - Direct answer to their question\n- Reference to relevant guidance\n
    - Offer follow-up call if needed\n\n[Draft shown]\n\nThis should
    unblock them immediately. Shall I send it?",
    "intent": "draft_reply",
    "drafts": [{
        "to": ["williams@company.com"],
        "subject": "Re: FDA Submission Question",
        "body": "Dr. Williams,\n\n[Draft content...]",
        "reasoning": "Team blocker, needs immediate response..."
    }],
    "requires_authorization": true
}

// Example 3: Calendar Check
POST /voice-agent/query
{
    "query": "Do I have any meetings today?",
    "mode": "voice"
}

Response:
{
    "text": "You have 4 meetings today:\n\n9:00 AM - Leadership Standup
    (30 min)\n10:30 AM - Budget Review with Finance (1 hour)\n1:00 PM -
    Lunch with potential investor\n3:00 PM - FDA Strategy Call (1 hour)\n\n
    You have open slots at 11:30 AM and 4:00 PM if you need to schedule
    anything else. Your day is quite packed - I've blocked time for lunch
    prep and follow-ups.",
    "intent": "check_calendar",
    "calendar_actions": []
}
```

---

## 🔧 Configuration

### Tab Q&A Configuration

**Model Selection** (`agents/tab_qa_agent.py`)
```python
# Default: Claude 3.5 Sonnet
tab_qa_agent = TabQAAgent(model_name="claude-3-5-sonnet-20241022")

# Can be configured to use other models
# Requires ANTHROPIC_API_KEY environment variable
```

**Tab Contexts**
Edit `TAB_CONTEXTS` dictionary to customize:
- Tab descriptions
- Available data types
- Capabilities
- Add new tabs

### Voice Agent Configuration

**Environment Variables** (`.env`)
```bash
# Required
ANTHROPIC_API_KEY=your_key_here

# Voice Agent Name
VOICE_AGENT_NAME=Vinegar

# Model Selection
MODEL_NAME=gpt-4
FALLBACK_MODELS=deepseek-chat,grok-2,gpt-4o-mini,gemini-1.5-pro

# Gmail Integration
GMAIL_CLIENT_ID=your_gmail_client_id
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_REDIRECT_URI=http://localhost:8000/oauth2callback

# Optional: Text-to-Speech
ELEVENLABS_API_KEY=your_elevenlabs_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

**System Settings** (`voice_agent/models/settings.py`)
```python
settings = SystemSettings(
    voice_agent_name="Vinegar",
    email_provider="gmail_api",
    calendar_provider="google_calendar",
    tts_provider="elevenlabs",
    stt_provider="whisper"
)
```

---

## 📝 Testing

### Test Tab Q&A

```python
# Test tab-specific questions
import asyncio
from agents.tab_qa_agent import TabQAAgent

async def test():
    agent = TabQAAgent()

    # Test Orders tab question
    response = await agent.ask(
        question="Why are orders growing?",
        tab="orders",
        tab_data={"growth_rate": 15.2, "monthly_orders": 24500}
    )

    print(response["answer"])

asyncio.run(test())
```

### Test Voice Agent

```bash
# Test via API
curl -X POST http://localhost:8000/voice-agent/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What's in my inbox?",
    "mode": "text"
  }'

# Test inbox summary
curl http://localhost:8000/voice-agent/inbox/summary

# Test email fetch
curl http://localhost:8000/voice-agent/emails?max_results=10
```

---

## 🎨 UI Integration

### Tab Q&A UI

The AI panel automatically updates to show which tab you're on:

```
┌─────────────────────────────────────┐
│ Ask Me Anything (📈 Orders)         │
├─────────────────────────────────────┤
│ [Your question here...]             │
│                              [Send] │
├─────────────────────────────────────┤
│ Chat messages with tab context...   │
└─────────────────────────────────────┘
```

**Features:**
- Tab indicator shows current context
- "With Reasoning" badge on responses
- Formatted responses with structure
- Smooth animations

### Voice Agent UI

Access via:
1. **Main Dashboard** - AI panel for text queries
2. **Voice Agent Full** (`voice_agent_full.html`) - Complete voice interface
3. **API Integration** - Programmatic access

---

## 🚦 Best Practices

### For Tab Q&A

1. **Be Specific** - Ask about specific metrics or trends
2. **Use Context** - The AI knows what data is on screen
3. **Ask Follow-ups** - Build on previous questions
4. **Request Actions** - "Show me...", "Compare...", "Analyze..."

### For Voice Agent

1. **Natural Language** - Speak naturally, like to an assistant
2. **Be Clear** - Specific requests get better results
3. **Review Drafts** - Always review AI-generated content
4. **Use Authorization** - Protect sensitive actions with auth codes
5. **Provide Feedback** - The AI learns from context

---

## 🔒 Security & Privacy

### Tab Q&A
- All processing uses Claude API (Anthropic)
- No data stored permanently
- Questions and answers not logged
- HTTPS encryption in production

### Voice Agent
- Gmail OAuth 2.0 for email access
- Authorization codes for sensitive actions
- Complete audit trail in action logs
- Session-based security
- No storage of email credentials

---

## 📚 Additional Resources

### Documentation
- `VOICE_AGENT_COMPLETE_GUIDE.md` - Comprehensive voice agent guide
- `CONFIG_GUIDE.md` - Configuration reference
- `PROJECT_STRUCTURE.md` - Architecture details

### API Documentation
- FastAPI Docs: `http://localhost:8000/docs`
- API Reference: All endpoints with examples

### Support
- Check documentation first
- Review error logs for issues
- Test with mock adapters first

---

## 🎯 Next Steps

### Immediate

1. **Test Tab Q&A**
   - Navigate to different tabs
   - Ask questions about each tab
   - Verify context awareness

2. **Test Voice Agent**
   - Try inbox summarization
   - Draft an email reply
   - Check calendar

3. **Configure Gmail** (optional)
   - Set up OAuth credentials
   - Test email integration
   - Enable Communications management

### Future Enhancements

- **Custom Tab Contexts** - Add your own business-specific tabs
- **Learning from Feedback** - AI improves with usage
- **Multi-modal Input** - Voice + text seamlessly
- **Advanced Automation** - Rules-based email handling
- **Integration Expansion** - More communication tools

---

## ✅ Summary

You now have:

✅ **Context-aware AI for every dashboard tab**
- Understands what you're looking at
- Provides specific, relevant insights
- Explains reasoning clearly

✅ **Friendly, capable voice assistant**
- Acts like a personal secretary
- Manages communications intelligently
- Thinks strategically about your time
- Explains decisions with reasoning

✅ **Full Communications tab control**
- Inbox summarization with priorities
- Email drafting and sending
- Calendar management
- Strategic recommendations

**The AI is ready to help you work smarter, not harder!**
