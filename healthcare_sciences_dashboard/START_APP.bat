@echo off
echo ============================================================
echo    LeaderDashboard - Voice Agent Application
echo ============================================================
echo.
echo Starting API server on http://localhost:8000
echo.

cd /d "%~dp0"
start "API Server" python api/server.py

echo.
echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo    APPLICATION IS READY!
echo ============================================================
echo.
echo    Voice Interface:   file:///%~dp0voice_agent_full.html
echo    API Server:        http://localhost:8000
echo    API Docs:          http://localhost:8000/docs
echo.
echo Opening Voice Interface in your browser...
start "" "voice_agent_full.html"

echo.
echo Press any key to stop the server...
pause >nul
