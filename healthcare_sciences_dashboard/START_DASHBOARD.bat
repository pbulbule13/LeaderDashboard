@echo off
echo ============================================================
echo    LeaderDashboard - Quick Start Script
echo ============================================================
echo.

cd /d "%~dp0"

echo Checking if servers are already running...
timeout /t 1 >nul

echo.
echo Starting Dashboard...
echo.
echo This will:
echo   1. Start API server on port 8000
echo   2. Start Web server on port 3000
echo   3. Open browser automatically
echo.

python run_app.py

pause
