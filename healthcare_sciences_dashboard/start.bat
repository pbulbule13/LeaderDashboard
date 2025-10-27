@echo off
REM ============================================================================
REM LeaderDashboard - Windows Startup Script
REM Comprehensive startup script for Windows systems
REM ============================================================================

title LeaderDashboard - AI-Powered Executive Dashboard

echo.
echo ========================================================================
echo   LEADERDASHBOARD - WINDOWS STARTUP SCRIPT
echo ========================================================================
echo   AI-Powered Executive Dashboard
echo   Healthcare Sciences Dashboard System
echo ========================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo.
    echo Please install Python 3.9+ from https://www.python.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Python is installed
echo.

REM Check if we're in the correct directory
if not exist "api\server.py" (
    echo [ERROR] Cannot find api\server.py
    echo.
    echo Please make sure you're running this script from the
    echo healthcare_sciences_dashboard directory
    echo.
    pause
    exit /b 1
)

echo [OK] Project structure verified
echo.

REM Check for virtual environment
if exist ".venv\Scripts\activate.bat" (
    echo [INFO] Found .venv virtual environment
    echo [INFO] Activating virtual environment...
    call .venv\Scripts\activate.bat
    echo [OK] Virtual environment activated
    echo.
) else if exist "venv\Scripts\activate.bat" (
    echo [INFO] Found venv virtual environment
    echo [INFO] Activating virtual environment...
    call venv\Scripts\activate.bat
    echo [OK] Virtual environment activated
    echo.
) else (
    echo [WARNING] No virtual environment found
    echo [INFO] Running with system Python
    echo.
    echo [TIP] Consider creating a virtual environment:
    echo       python -m venv .venv
    echo       .venv\Scripts\activate
    echo       pip install -r requirements.txt
    echo.
)

REM Check for .env file
if not exist ".env" (
    echo [WARNING] .env file not found
    if exist ".env.example" (
        echo [INFO] Copying .env.example to .env...
        copy .env.example .env >nul
        echo [OK] Created .env file
        echo.
        echo [ACTION REQUIRED] Please edit .env and add your API keys:
        echo                   - ANTHROPIC_API_KEY or OPENAI_API_KEY
        echo.
        echo Press any key to open .env in notepad...
        pause >nul
        notepad .env
        echo.
        echo After saving your API keys, press any key to continue...
        pause >nul
    ) else (
        echo [ERROR] No .env.example file found
        echo.
        pause
        exit /b 1
    )
)

echo [OK] Environment configuration found
echo.

REM Start the application
echo ========================================================================
echo   STARTING APPLICATION
echo ========================================================================
echo.
echo Running: python run_app.py
echo.
echo NOTE: The script will:
echo   1. Check all prerequisites
echo   2. Start the API server (port 8000)
echo   3. Start the frontend server (port 3000)
echo   4. Open your browser automatically
echo.
echo To stop: Press Ctrl+C in this window
echo.
echo ========================================================================
echo.

python run_app.py

REM Check exit code
if errorlevel 1 (
    echo.
    echo ========================================================================
    echo [ERROR] Application exited with an error
    echo ========================================================================
    echo.
    echo Troubleshooting tips:
    echo   1. Make sure you activated your virtual environment
    echo   2. Install dependencies: pip install -r requirements.txt
    echo   3. Check your .env file has valid API keys
    echo   4. Run: python run_app.py --check
    echo.
) else (
    echo.
    echo ========================================================================
    echo [INFO] Application stopped normally
    echo ========================================================================
    echo.
)

echo Press any key to exit...
pause >nul