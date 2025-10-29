# 🚀 Running the Voice-Enabled CEO Dashboard

Complete guide with Gmail integration configured and ready to use.

## 📋 Prerequisites Checklist

- [x] Python 3.9+ installed
- [ ] OpenAI API key
- [ ] (Optional) Gmail API credentials for real email access

## ⚡ Quick Start (3 Commands)

```bash
cd healthcare_sciences_dashboard
python run_server.py
```

That's it! The server will start on http://localhost:8000

**Note:** Without Gmail credentials, the system runs in **mock mode** with fake email data - perfect for testing!

---

## 🎯 Option 1: Run with Mock Data (No Setup Required)

### Step 1: Install Dependencies

```bash
cd healthcare_sciences_dashboard
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
# Copy example environment file
copy .env.example .env   # Windows
# or
cp .env.example .env     # Linux/Mac
```

Edit `.env` and add your OpenAI key:

```env
OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Start the Server

```bash
python run_server.py
```

You'll see:

```
✅ Gmail API service initialized
⚠️  Gmail credentials not configured
⚠️  Using mock data instead
✅ Voice Agent routes loaded successfully
     • Voice Agent API: /voice-agent/query
     • Inbox Summary: /voice-agent/inbox/summary
     • Calendar Check: /voice-agent/calendar/check
     • WebSocket: /voice-agent/ws

INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 4: Test the System

Open a new terminal:

```bash
cd healthcare_sciences_dashboard
python test_voice_agent.py
```

You'll see the voice agent working with mock emails!

---

## 📧 Option 2: Run with Real Gmail (Full Features)

### Step 1: Get Gmail API Credentials

**Follow this guide:** `voice_agent/config/gmail_setup_guide.md`

**Quick steps:**

1. Go to https://console.cloud.google.com/
2. Create a project → Enable Gmail API
3. Create OAuth 2.0 credentials (Desktop app)
4. Download as `config/gmail_credentials.json`

### Step 2: Place Credentials

```bash
# Create config directory
mkdir config

# Move your downloaded credentials
move Downloads\client_secret_*.json config\gmail_credentials.json   # Windows
# or
mv ~/Downloads/client_secret_*.json config/gmail_credentials.json   # Linux/Mac
```

### Step 3: Configure Environment

Edit `.env`:

```env
OPENAI_API_KEY=sk-your-key-here

# Gmail Configuration
VOICE_AGENT_email_provider=gmail_api
VOICE_AGENT_gmail_credentials_path=./config/gmail_credentials.json
```

### Step 4: First Run - Authorization

```bash
python run_server.py
```

A browser window will open asking you to:
1. Sign in to Google
2. Allow the Voice Agent to access your Gmail

Click **Allow**. The system saves a token so you only do this once.

### Step 5: Verify Real Email Access

```bash
python test_voice_agent.py
```

You should see your REAL emails!

---

## 🌐 Access the Application

### API Server
**URL:** http://localhost:8000

**Interactive Docs:** http://localhost:8000/docs

### Dashboard UI
Open in browser: `healthcare_sciences_dashboard/dashboard.html`

### Test Endpoints

**1. Query the Voice Agent:**
```bash
curl -X POST http://localhost:8000/voice-agent/query \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"What emails need my attention?\", \"mode\": \"text\"}"
```

**2. Check Inbox Summary:**
```bash
curl http://localhost:8000/voice-agent/inbox/summary
```

**3. Check Calendar:**
```bash
curl "http://localhost:8000/voice-agent/calendar/check?timeframe=today"
```

**4. Get Configuration:**
```bash
curl http://localhost:8000/voice-agent/config
```

---

## 💡 Example Usage

### From Command Line (using curl)

**Ask about inbox:**
```bash
curl -X POST http://localhost:8000/voice-agent/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What emails do I have?", "mode": "text"}'
```

**Draft a reply:**
```bash
curl -X POST http://localhost:8000/voice-agent/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Draft a reply to John saying I am available Thursday at 2pm", "mode": "text"}'
```

### From Python

```python
import httpx
import asyncio

async def ask_vinegar(query):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:8000/voice-agent/query",
            json={"query": query, "mode": "text"}
        )
        data = response.json()
        print(f"Intent: {data['intent']}")
        print(f"Response: {data['text']}")
        print(f"Drafts: {len(data['drafts'])}")

asyncio.run(ask_vinegar("What's in my inbox?"))
```

### From JavaScript (Dashboard Integration)

```javascript
async function queryVoiceAgent(query) {
    const response = await fetch('http://localhost:8000/voice-agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: query,
            mode: 'text',
            user_id: 'ceo_user'
        })
    });

    const data = await response.json();
    console.log('Voice Agent Response:', data);
    return data;
}

// Use it
queryVoiceAgent("What emails need my attention?");
```

---

## 🔧 Configuration Options

### Email Providers

Currently supported: **Gmail API** (fully functional)

Coming soon: IMAP/SMTP, Outlook Graph

**Switch providers in `.env`:**

```env
# Use Gmail (default - recommended)
VOICE_AGENT_email_provider=gmail_api

# Use IMAP/SMTP (coming soon)
# VOICE_AGENT_email_provider=imap_smtp

# Use Outlook (coming soon)
# VOICE_AGENT_email_provider=outlook_graph
```

See `voice_agent/config/EMAIL_PROVIDERS.md` for full guide.

### Voice Agent Name

Change the agent's name (default: "Vinegar"):

```env
VOICE_AGENT_voice_agent_name=MyAssistant
```

### Authorization Settings

```env
# 4-digit codes by default
VOICE_AGENT_auth_code_length=4

# Codes expire after 10 minutes
VOICE_AGENT_auth_code_expiry_minutes=10
```

### Communication Tone

```env
# Options: formal, warm, concise, friendly
VOICE_AGENT_tone_default=warm
```

---

## 📁 Project Structure

```
healthcare_sciences_dashboard/
├── voice_agent/                    # Voice agent system
│   ├── models/                     # Pydantic models
│   ├── agents/                     # LangGraph agents
│   ├── adapters/
│   │   ├── email/                 # Email provider adapters
│   │   │   ├── gmail_adapter.py   # ✅ Gmail (fully functional)
│   │   │   ├── gmail_oauth.py     # OAuth2 handler
│   │   │   └── factory.py         # Provider factory
│   │   └── calendar/              # Calendar adapters
│   ├── api/
│   │   └── routes.py              # FastAPI endpoints
│   └── config/
│       ├── gmail_setup_guide.md   # Gmail setup instructions
│       └── EMAIL_PROVIDERS.md     # Provider configuration
├── api/
│   └── server.py                   # Main FastAPI server
├── dashboard.html                  # Dashboard UI
├── run_server.py                   # Server launcher
├── test_voice_agent.py            # Test script
├── .env.example                    # Environment template
└── requirements.txt               # Python dependencies
```

---

## 🐛 Troubleshooting

### "Module not found" errors

```bash
# Make sure you're in the right directory
cd healthcare_sciences_dashboard

# Reinstall dependencies
pip install -r requirements.txt
```

### "OpenAI API key not found"

Add your key to `.env`:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### Gmail credentials not working

1. Delete the token:
   ```bash
   rm config/gmail_token.pickle   # Linux/Mac
   del config\gmail_token.pickle  # Windows
   ```

2. Restart the server - it will ask you to re-authorize

### Port 8000 already in use

Change the port in `.env`:

```env
PORT=8001
```

### Voice Agent uses mock data instead of real Gmail

**This is by design!** If Gmail credentials aren't found or authentication fails, the system gracefully falls back to mock mode so you can still test and develop.

To use real Gmail:
1. Follow `voice_agent/config/gmail_setup_guide.md`
2. Place credentials in `config/gmail_credentials.json`
3. Restart the server

---

## 🎉 What's Next?

### Test the System
```bash
python test_voice_agent.py
```

### View API Docs
http://localhost:8000/docs

### Integrate with Dashboard UI
Edit `dashboard.html` Communications tab to call:
- `/voice-agent/query`
- `/voice-agent/inbox/summary`
- `/voice-agent/calendar/check`

### Set Up Real Gmail
Follow `voice_agent/config/gmail_setup_guide.md`

### Deploy to Production
See `voice_agent/README.md` for deployment guides

---

## 📚 Additional Documentation

- **Voice Agent README:** `voice_agent/README.md`
- **Gmail Setup:** `voice_agent/config/gmail_setup_guide.md`
- **Email Providers:** `voice_agent/config/EMAIL_PROVIDERS.md`
- **Quick Start:** `QUICKSTART.md`

---

**Built with LangGraph, FastAPI, and the Gmail API** 🚀

**Ready to test with mock data - Set up Gmail credentials for production!**
