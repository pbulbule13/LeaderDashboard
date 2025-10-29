# 🎙️ Vinegar Voice Agent - Complete Setup & Usage Guide

Your AI Executive Assistant with Full Voice Capabilities

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Gmail Setup](#gmail-setup)
3. [Voice Configuration](#voice-configuration)
4. [Calendar Setup](#calendar-setup)
5. [Testing the System](#testing-the-system)
6. [Using the Dashboard](#using-the-dashboard)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Start the Server

```bash
cd healthcare_sciences_dashboard
python run_server.py
```

The server will start on **http://localhost:8000**

### Step 2: Open the Voice Interface

Open in your browser:
- **Full Voice Interface**: `healthcare_sciences_dashboard/voice_agent_full.html`
- **Simple Test Page**: `healthcare_sciences_dashboard/voice_agent_test.html`
- **Main Dashboard**: `healthcare_sciences_dashboard/dashboard.html`

### Step 3: Test It!

**With Voice**:
1. Click the microphone button
2. Say: "What emails need my attention?"
3. Vinegar will respond in text (and voice if configured)

**With Text**:
1. Type your question in the text box
2. Click "Ask Vinegar"

---

## 📧 Gmail Setup

###  Status: ✅ **CONFIGURED**

Your Gmail is already connected! Here's what's configured:

**Location**: `healthcare_sciences_dashboard/.env`

```env
GMAIL_CLIENT_ID=1041232517013-dieofgsdddvuepht3220h8oqujplrebh.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=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
GMAIL_REFRESH_TOKEN=1//047y0uZ0NJA7MCgYIARAAGAQSNwF-L9IrNLWSL-fUG7omlREXbLP48Ocb4YU4jDt2F6qeTTYUJXGAMKqg0PTxtmFleCqcH1wwFqs
```

**Files**:
- ✅ `config/gmail_credentials.json` - OAuth credentials
- ✅ `config/gmail_token.pickle` - Refresh token

### How It Works

The voice agent can:
- ✅ **Read your emails** from Gmail
- ✅ **Send emails** on your behalf (with authorization)
- ✅ **Draft replies** using AI
- ✅ **Mark as read**, archive, and manage your inbox

### Test Gmail Connection

```bash
curl http://localhost:8000/voice-agent/inbox/summary
```

You should see your real emails!

---

## 🎤 Voice Configuration

### Voice Input (Speech-to-Text)

**Current Setup**: ✅ **Browser-Based** (No setup required!)

The system uses your browser's built-in **Web Speech API** for voice input.

**Supported Browsers**:
- ✅ Chrome/Edge (Best)
- ✅ Safari
- ❌ Firefox (limited support)

**How to Use**:
1. Open `voice_agent_full.html`
2. Click the **blue microphone button**
3. Grant microphone permission when prompted
4. Speak your question clearly
5. The system will process and respond

### Voice Output (Text-to-Speech)

**Option 1: Browser TTS** (Current - Free)
- ✅ Works out of the box
- Uses your browser's speech synthesis
- Click "Speak Response" button to hear answers

**Option 2: ElevenLabs** (Better Quality)

#### Setup ElevenLabs:

1. **Get API Key**: https://elevenlabs.io/
2. **Add to `.env`**:

```env
ELEVENLABS_API_KEY=your_actual_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

3. **Choose Your Voice**:
   - Go to https://elevenlabs.io/app/voice-library
   - Pick a voice
   - Copy the Voice ID
   - Update `ELEVENLABS_VOICE_ID` in `.env`

4. **Restart the server**

**Popular Voice IDs**:
- `21m00Tcm4TlvDq8ikWAM` - Rachel (Professional Female)
- `VR6AewLTigWG4xSOukaG` - Arnold (Professional Male)
- `ErXwobaYiN019PkySvjV` - Antoni (Warm Male)

---

## 📅 Calendar Setup

### Status: 🔄 **Optional - Not Required**

Calendar integration uses the same Gmail OAuth credentials.

### Enable Calendar:

1. **Update `.env`**:

```env
GOOGLE_CALENDAR_ENABLED=true
```

2. **Enable Calendar API in Google Cloud Console**:
   - Go to https://console.cloud.google.com/
   - Select your project
   - Go to **APIs & Services** → **Library**
   - Search "Google Calendar API"
   - Click **ENABLE**

3. **Restart the server**

### Calendar Commands:

- "What's on my calendar today?"
- "What meetings do I have this week?"
- "Schedule a meeting with John for tomorrow at 2pm"

---

## 🧪 Testing the System

### Test 1: Voice Input/Output

1. **Open**: `voice_agent_full.html` in Chrome/Edge
2. **Click** the microphone button
3. **Say**: "What emails need my attention?"
4. **Watch** Vinegar process your request
5. **Click** "Speak Response" to hear the answer

### Test 2: Gmail Integration

```bash
# Terminal command
curl http://localhost:8000/voice-agent/inbox/summary
```

Or in the browser:
1. Open `voice_agent_full.html`
2. Click "Check Inbox" quick action
3. You should see your real emails!

### Test 3: Draft Generation

**Voice Command**:
"Draft a reply to John saying I'll review the document tomorrow"

**Text Command**:
Type the above in the text box and click "Ask Vinegar"

You'll see:
- ✍️ Generated draft email
- 📧 Original email context
- ✅ Authorization code required before sending

### Test 4: Calendar

```bash
curl "http://localhost:8000/voice-agent/calendar/check?timeframe=today"
```

---

## 💻 Using the Dashboard

### Communications Tab

The main dashboard at `dashboard.html` has a Communications tab that shows:
- 📨 Email inbox
- 📅 Calendar events
- ✈️ Travel plans

**Note**: The Communications tab currently shows **static data**. To see your real emails:
1. Use `voice_agent_full.html` for now
2. Or we can integrate the voice agent into the Communications tab (let me know!)

### Integration Options

**Want to see real emails in the Communications tab?**

Let me know and I can:
1. Connect the Communications tab to pull real Gmail data
2. Add voice controls directly in the dashboard
3. Make it fully interactive with drag-and-drop email management

---

## 🔧 Troubleshooting

### Issue: "Microphone not working"

**Solution**:
- Use Chrome or Edge (best support)
- Grant microphone permission when prompted
- Check browser settings → Site settings → Microphone

### Issue: "Gmail not showing my emails"

**Solution**:
```bash
# Check if server is running
curl http://localhost:8000/health

# Test Gmail connection
curl http://localhost:8000/voice-agent/inbox/summary

# If fails, check:
# 1. Server is running
# 2. Gmail credentials are in config/
# 3. Check server logs
```

### Issue: "Voice output not working"

**Solution**:
- Browser TTS: Click "Speak Response" button after getting an answer
- ElevenLabs: Make sure API key is in `.env` and server is restarted

### Issue: "Calendar not working"

**Solution**:
1. Calendar is optional - system works without it
2. To enable: Follow [Calendar Setup](#calendar-setup) above
3. Make sure `GOOGLE_CALENDAR_ENABLED=true` in `.env`

### Issue: "Server won't start"

**Solution**:
```bash
# Check Python environment
cd healthcare_sciences_dashboard
python --version  # Should be 3.9+

# Install dependencies
uv pip install -r requirements.txt

# Start server
python run_server.py
```

---

## 📝 Configuration Summary

### Your Current Setup

**Location**: `healthcare_sciences_dashboard/.env`

```env
# ✅ Configured
OPENAI_API_KEY=sk-proj-...
GMAIL_CLIENT_ID=1041232517013-...
GMAIL_CLIENT_SECRET=GOCSPX-...
GMAIL_REFRESH_TOKEN=1//047y0uZ0...
VOICE_AGENT_email_provider=gmail_api
VOICE_AGENT_voice_agent_name=Vinegar

# ⏳ Add Your ElevenLabs Key Here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# 📅 Optional - Calendar
GOOGLE_CALENDAR_ENABLED=false
```

---

## 🎯 What Works Now

✅ **Voice Input** - Speak to Vinegar using your microphone
✅ **Voice Output** - Hear responses (browser TTS or ElevenLabs)
✅ **Gmail Reading** - Read your real emails
✅ **Draft Generation** - AI-generated email responses
✅ **Smart Inbox Triage** - Prioritize emails automatically
✅ **Authorization System** - 4-digit codes before sending emails
✅ **Action Logging** - Complete audit trail

---

## 🔜 What's Next

### Want to Add:

1. **Calendar Integration** - Manage meetings and schedule
2. **Dashboard Integration** - Show real emails in Communications tab
3. **Voice-First UI** - Talk to dashboard directly
4. **Email Sending** - Actually send drafted emails (currently generates only)
5. **Meeting Scheduling** - "Schedule a meeting with John tomorrow at 2pm"

**Let me know what you want to prioritize!**

---

## 📞 Quick Reference

### URLs:
- **API Server**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Full Voice Interface**: Open `voice_agent_full.html` in browser
- **Simple Test**: Open `voice_agent_test.html` in browser
- **Main Dashboard**: Open `dashboard.html` in browser

### API Endpoints:
- `POST /voice-agent/query` - Ask anything
- `GET /voice-agent/inbox/summary` - Email summary
- `GET /voice-agent/calendar/check` - Calendar check
- `GET /voice-agent/config` - System configuration
- `WS /voice-agent/ws` - WebSocket real-time

### Files:
- **Config**: `.env`
- **Gmail Credentials**: `config/gmail_credentials.json`
- **Gmail Token**: `config/gmail_token.pickle`
- **Server Logs**: Terminal where `run_server.py` is running

---

## 🎉 You're All Set!

Your Vinegar voice agent is configured and ready to use!

**Next Steps**:
1. Open `voice_agent_full.html`
2. Click the microphone
3. Say "What emails do I have?"
4. Watch the magic happen! ✨

For questions or issues, check the [Troubleshooting](#troubleshooting) section above.

---

**Built with LangGraph, FastAPI, Gmail API, and Voice AI** 🚀
