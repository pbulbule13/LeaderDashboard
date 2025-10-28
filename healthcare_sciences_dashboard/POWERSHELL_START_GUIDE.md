# PowerShell Quick Start Guide
## Healthcare Sciences Dashboard - Voice Agent System

This guide provides step-by-step PowerShell commands to run the application on Windows.

---

## Prerequisites

- Python 3.10 or higher installed
- Git installed (optional)
- PowerShell 5.1 or higher

---

## Step 1: Navigate to Project Directory

```powershell
cd C:\Users\pbkap\Downloads\EuronDownloads\Projects\LeaderDashboard\healthcare_sciences_dashboard
```

---

## Step 2: Create Virtual Environment (First Time Only)

```powershell
python -m venv venv
```

---

## Step 3: Activate Virtual Environment

```powershell
.\venv\Scripts\Activate.ps1
```

**Note**: If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Step 4: Install Dependencies (First Time or After Updates)

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

**Note**: If you encounter issues with voice packages (pyaudio, whisper, etc.), they are optional. Comment them out in requirements.txt with `#`:
```
# elevenlabs==1.0.0
# openai-whisper==20231117
# SpeechRecognition==3.10.4
# pyaudio==0.2.14
```

---

## Step 5: Verify Gmail Configuration

Check that your `.env` file has the correct Gmail credentials:

```powershell
Get-Content .env
```

Ensure these lines are present and filled:
```
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
```

---

## Step 6: Start the API Server

```powershell
python api/server.py
```

**Expected output:**
```
[OK] Dashboard and Query routes loaded successfully
[OK] Voice Agent routes loaded successfully
Starting HealthCare Sciences Dashboard API on port 8000...
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Leave this PowerShell window open!**

---

## Step 7: Open Dashboard in Browser

Open a new PowerShell window and run:

```powershell
cd C:\Users\pbkap\Downloads\EuronDownloads\Projects\LeaderDashboard\healthcare_sciences_dashboard
python run_app.py
```

**Or manually open** your browser to:
- **Dashboard**: http://localhost:5000
- **API Docs**: http://localhost:8000/docs

---

## Quick Commands Summary

### Start Everything (Two Commands in Separate PowerShell Windows)

**Window 1 - API Server:**
```powershell
cd C:\Users\pbkap\Downloads\EuronDownloads\Projects\LeaderDashboard\healthcare_sciences_dashboard
.\venv\Scripts\Activate.ps1
python api/server.py
```

**Window 2 - Dashboard:**
```powershell
cd C:\Users\pbkap\Downloads\EuronDownloads\Projects\LeaderDashboard\healthcare_sciences_dashboard
.\venv\Scripts\Activate.ps1
python run_app.py
```

---

## Testing Gmail Connection

Run this test script to verify Gmail is working:

```powershell
python test_gmail_connection.py
```

**Expected output:**
```
Testing Gmail connection...
Refreshing Gmail access token from refresh token...
SUCCESS: Gmail credentials refreshed successfully
SUCCESS: Gmail API service initialized
[SUCCESS] Connected to your Gmail!
Found X email threads:
...
```

---

## Troubleshooting

### Issue: Port Already in Use

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual number)
taskkill /F /PID <PID>
```

### Issue: Virtual Environment Not Activating

```powershell
# Use full path
C:\Users\pbkap\Downloads\EuronDownloads\Projects\LeaderDashboard\healthcare_sciences_dashboard\venv\Scripts\Activate.ps1

# Or change execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Gmail Not Loading

1. Check server logs in the API server window
2. Test Gmail connection:
   ```powershell
   python test_gmail_connection.py
   ```
3. If refresh token expired, regenerate:
   ```powershell
   python generate_gmail_token.py
   ```

### Issue: Module Not Found

```powershell
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

---

## Stop the Application

1. In API Server window: Press `Ctrl+C`
2. In Dashboard window: Press `Ctrl+C`
3. Deactivate virtual environment:
   ```powershell
   deactivate
   ```

---

## One-Line Startup (After Initial Setup)

Create a `start.ps1` file with:

```powershell
# Navigate to project
cd C:\Users\pbkap\Downloads\EuronDownloads\Projects\LeaderDashboard\healthcare_sciences_dashboard

# Activate venv
.\venv\Scripts\Activate.ps1

# Start API server in background
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; .\venv\Scripts\Activate.ps1; python api/server.py"

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:8000/docs"

Write-Host "Dashboard is starting..."
Write-Host "API Server: http://localhost:8000"
Write-Host "Dashboard will open in your browser shortly"
```

Then run:
```powershell
.\start.ps1
```

---

## Environment Variables

Your `.env` file should contain:

```env
# LLM Configuration
OPENAI_API_KEY=your_openai_api_key
MODEL_NAME=gpt-4o
FALLBACK_MODELS=deepseek-chat,grok-2,gpt-4o-mini,gemini-1.5-pro

# Gmail Configuration (Desktop App)
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token

# Voice Agent Configuration
VOICE_AGENT_email_provider=gmail
VOICE_AGENT_voice_agent_name=Vinegar
```

---

## Features Available

Once running, you can:

1. **View Dashboard** - Real-time business metrics
2. **Communications Tab** - See your Gmail emails loaded automatically
3. **Voice Agent API** - `/voice-agent/query` for natural language commands
4. **Email Drafting** - AI-powered email composition
5. **Calendar Integration** - Google Calendar support
6. **Multi-Model Fallback** - Automatic failover between LLM providers

---

## API Endpoints

- `GET /voice-agent/emails` - Get list of Gmail emails
- `GET /voice-agent/inbox/summary` - AI-powered inbox analysis
- `POST /voice-agent/query` - Process natural language queries
- `GET /voice-agent/calendar/check` - Check calendar events
- `GET /voice-agent/config` - Get system configuration

Access full API documentation at: http://localhost:8000/docs

---

## Support

For issues:
1. Check server logs in the API terminal window
2. Review `.env` file configuration
3. Test Gmail connection with `test_gmail_connection.py`
4. Verify all dependencies installed: `pip list`

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `.\venv\Scripts\Activate.ps1` | Activate virtual environment |
| `python api/server.py` | Start API server |
| `python run_app.py` | Start dashboard |
| `python test_gmail_connection.py` | Test Gmail |
| `python generate_gmail_token.py` | Generate new OAuth token |
| `pip install -r requirements.txt` | Install dependencies |
| `deactivate` | Deactivate virtual environment |

---

**Last Updated**: October 2025
**Version**: 2.0.0
