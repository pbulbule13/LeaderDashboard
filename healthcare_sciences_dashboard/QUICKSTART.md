# 🚀 Quick Start Guide - Voice-Enabled CEO Dashboard

## Prerequisites

- **Python 3.9+** installed
- **OpenAI API Key** (for AI reasoning) or Anthropic API Key
- **(Optional)** Gmail & Google Calendar OAuth credentials for real email/calendar access
- **(Optional)** ElevenLabs API key for voice features

## Step 1: Set Up Environment

### Windows:

```cmd
cd healthcare_sciences_dashboard

# Create virtual environment (if not exists)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Linux/Mac:

```bash
cd healthcare_sciences_dashboard

# Create virtual environment (if not exists)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

## Step 3: Start the Application

### Method 1: Using the startup script (Recommended)

**Windows:**
```cmd
start.bat
```

**Linux/Mac:**
```bash
./start.sh
```

### Method 2: Run the server directly

```bash
python run_server.py
```

The API will start on: **http://localhost:8000**

## Step 4: Test the Voice Agent

Open a new terminal and run the test script:

```bash
python test_voice_agent.py
```

This will test all voice agent endpoints and show you example interactions!

## Step 5: Explore the API

Open your browser and go to:

**📚 Interactive API Docs:** http://localhost:8000/docs

Here you can:
- See all available endpoints
- Test the voice agent interactively
- View request/response schemas
- Try different queries

## Example Queries to Try

### 1. Check Inbox
```json
POST /voice-agent/query
{
  "query": "What's in my inbox?",
  "mode": "text"
}
```

### 2. Draft Email Reply
```json
POST /voice-agent/query
{
  "query": "Draft a warm reply to John saying I'm available Thursday at 2pm",
  "mode": "text"
}
```

### 3. Check Calendar
```json
GET /voice-agent/calendar/check?timeframe=today
```

## Available Endpoints

### Voice Agent System
- `POST /voice-agent/query` - Main query endpoint (text or voice)
- `GET /voice-agent/inbox/summary` - Get inbox summary
- `GET /voice-agent/calendar/check` - Check calendar
- `GET /voice-agent/config` - Get agent configuration
- `WS /voice-agent/ws` - WebSocket for real-time voice

## Documentation

- **Voice Agent System:** `voice_agent/README.md`
- **API Documentation:** http://localhost:8000/docs (when running)
