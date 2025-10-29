# How to Run the Dashboard

## Quick Start (Easiest Way)

### Option 1: Double-click the batch file
1. Navigate to: `healthcare_sciences_dashboard` folder
2. Double-click: **`START_DASHBOARD.bat`**
3. Wait for browser to open automatically
4. Dashboard will open at: http://localhost:3000/dashboard.html

### Option 2: Command Line
```powershell
cd healthcare_sciences_dashboard
python run_app.py
```

## Important: DO NOT Open HTML File Directly!

❌ **WRONG**: Opening `dashboard.html` by double-clicking or dragging to browser
- This uses `file://` protocol which blocks API calls (CORS error)
- AI Assistant won't work
- Data won't load

✅ **CORRECT**: Use the server (http://localhost:3000/dashboard.html)
- Enables API communication
- AI Assistant works perfectly
- All features enabled

## What You Should See

When servers start successfully:
```
🌐 Starting API server on port 8000...
✅ API server running at http://localhost:8000

🎨 Starting frontend server on port 3000...
✅ Frontend server running at http://localhost:3000

============================================================
🎉 LeaderDashboard is now running!
============================================================
📍 Dashboard:  http://localhost:3000/dashboard.html
📍 API Docs:   http://localhost:8000/docs
📍 API Health: http://localhost:8000/health

💡 Press Ctrl+C to stop all servers
============================================================
```

## Testing AI Assistant

Once the dashboard loads:

1. **Look for the AI Assistant button** (top right, blue button with 🤖)
2. **Click it** to open the sidebar
3. **Ask a question** like:
   - "Compare performance across all departments"
   - "What's the trend in order volume?"
   - "Analyze compliance metrics"

The AI will respond using **DeepSeek** (most cost-effective LLM).

## Troubleshooting

### "Nothing shows at http://localhost:3000/dashboard.html"
- Check if servers are running (you should see the success message above)
- Make sure you're in the `healthcare_sciences_dashboard` directory
- Try closing and restarting: Press `Ctrl+C`, then run again

### "AI Assistant button doesn't work"
- Clear browser cache: `Ctrl+Shift+Delete`
- Hard refresh: `Ctrl+F5`
- Check browser console (F12) for errors

### "Port already in use" error
- Another process is using port 3000 or 8000
- Kill existing processes:
  ```powershell
  # Find process on port 3000
  netstat -ano | findstr :3000
  # Kill it (replace PID with actual number)
  taskkill /F /PID <PID>
  ```

## Stopping the Server

Press **`Ctrl+C`** in the command window where the server is running.

## URLs to Remember

- **Dashboard**: http://localhost:3000/dashboard.html
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health
