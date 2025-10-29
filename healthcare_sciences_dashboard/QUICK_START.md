# 🚀 Vinegar Voice Agent - Quick Start

## In 3 Steps:

### 1. Start Server
```bash
cd healthcare_sciences_dashboard
python run_server.py
```

### 2. Open Voice Interface
Open in Chrome/Edge: `voice_agent_full.html`

### 3. Talk to Vinegar!
Click microphone → Say "What emails do I have?" → Done!

---

## 📧 Your Gmail is Connected!

✅ Gmail OAuth configured
✅ Token saved in `config/gmail_token.pickle`
✅ Ready to read your emails

**Test it:**
```bash
curl http://localhost:8000/voice-agent/inbox/summary
```

---

## 🎤 Voice Capabilities

### Voice Input (Speech-to-Text)
✅ **Works Now** - Uses browser's speech recognition
- Click microphone button
- Speak clearly
- System processes automatically

### Voice Output (Text-to-Speech)
✅ **Works Now** - Uses browser's TTS
- Click "Speak Response" button after asking a question

🔧 **Optional**: Add ElevenLabs for better quality

**Add to `.env`:**
```env
ELEVENLABS_API_KEY=your_key_here
```

Get key: https://elevenlabs.io/

---

## 📂 Your Configuration

**File**: `healthcare_sciences_dashboard/.env`

```env
# ✅ Already Configured
OPENAI_API_KEY=sk-proj-...
GMAIL_CLIENT_ID=1041232517013-...
GMAIL_CLIENT_SECRET=GOCSPX-...
GMAIL_REFRESH_TOKEN=1//047y0uZ0...
VOICE_AGENT_voice_agent_name=Vinegar

# 🔧 Add This (Optional - For Better Voice)
ELEVENLABS_API_KEY=your_key_here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# 📅 Calendar (Optional)
GOOGLE_CALENDAR_ENABLED=false
```

---

## 🧪 Test Commands

### Via Voice:
1. Open `voice_agent_full.html`
2. Click microphone
3. Say any of these:
   - "What emails need my attention?"
   - "Show me urgent emails"
   - "What's on my calendar today?"
   - "Draft a reply saying I'll review tomorrow"

### Via API:
```bash
# Get inbox summary
curl http://localhost:8000/voice-agent/inbox/summary

# Check calendar
curl "http://localhost:8000/voice-agent/calendar/check?timeframe=today"

# Ask a question
curl -X POST http://localhost:8000/voice-agent/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What emails do I have?", "mode": "text"}'
```

---

## 📱 Available Interfaces

1. **voice_agent_full.html** ⭐ RECOMMENDED
   - Full voice interface
   - Microphone button
   - Real-time responses
   - Gmail display

2. **voice_agent_test.html**
   - Simple test page
   - Text-only
   - API testing

3. **dashboard.html**
   - Main dashboard
   - Communications tab (static for now)
   - Business analytics

---

## ❓ Common Questions

**Q: Can it read my Gmail?**
✅ Yes! Already configured and working

**Q: Can it speak to me?**
✅ Yes! Click "Speak Response" button (or add ElevenLabs for better quality)

**Q: Can I use voice input?**
✅ Yes! Works in Chrome/Edge. Click the microphone button

**Q: Does calendar work?**
⏳ Optional - needs Google Calendar API enabled (see full guide)

**Q: Will it send emails automatically?**
❌ No - generates drafts only. Requires authorization code to send

**Q: Where do I add my ElevenLabs key?**
📝 In `healthcare_sciences_dashboard/.env` file

---

## 🔧 Troubleshooting

**Server won't start?**
```bash
cd healthcare_sciences_dashboard
uv pip install -r requirements.txt
python run_server.py
```

**Microphone not working?**
- Use Chrome or Edge browser
- Grant microphone permission
- Check browser settings

**Gmail not showing emails?**
```bash
# Test connection
curl http://localhost:8000/voice-agent/inbox/summary

# Check server logs
```

**Voice output not working?**
- Click "Speak Response" button after getting a response
- Check browser supports speech synthesis (Chrome/Edge/Safari)

---

## 📚 Full Documentation

For complete details, see:
- **`VOICE_AGENT_COMPLETE_GUIDE.md`** - Full setup & config
- **`voice_agent/README.md`** - Technical architecture
- **`RUN_APPLICATION.md`** - Running guide

---

## 🎯 You're Ready!

Server running? ✅
Voice interface open? ✅
Microphone permission granted? ✅

**→ Click the microphone and say "What emails do I have?"**

Enjoy your AI executive assistant! 🎉
