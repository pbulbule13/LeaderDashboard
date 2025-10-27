#!/usr/bin/env python3
"""
LeaderDashboard - Complete Application Startup Script
Handles all prerequisites, environment setup, and server startup

Usage:
    python run_app.py           # Normal startup
    python run_app.py --check   # Check prerequisites only
    python run_app.py --help    # Show help
"""

import os
import sys
import subprocess
import time
import threading
import webbrowser
import shutil
from pathlib import Path
from typing import Optional, Tuple

# Fix Windows encoding issues
if sys.platform == 'win32':
    try:
        # Try to set UTF-8 encoding for Windows
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

# Detect if we can use emojis
USE_EMOJIS = sys.platform != 'win32' or os.getenv('PYTHONIOENCODING') == 'utf-8'

# ANSI color codes for better output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def safe_print(message: str):
    """Safely print message, handling encoding errors"""
    try:
        print(message)
    except UnicodeEncodeError:
        # Remove emojis and special characters
        import re
        clean_message = re.sub(r'[^\x00-\x7F]+', '', message)
        print(clean_message)

def print_colored(message: str, color: str = Colors.ENDC):
    """Print colored message"""
    try:
        print(f"{color}{message}{Colors.ENDC}")
    except UnicodeEncodeError:
        # Fallback to plain text without colors
        import re
        clean_message = re.sub(r'[^\x00-\x7F]+', '', message)
        print(clean_message)

def print_header(message: str):
    """Print header message"""
    print("\n" + "=" * 70)
    print_colored(f"  {message}", Colors.BOLD + Colors.CYAN)
    print("=" * 70)

def check_python_version() -> bool:
    """Check if Python version is 3.9+"""
    print_colored("\n📋 Checking Python version...", Colors.CYAN)
    version = sys.version_info
    if version.major >= 3 and version.minor >= 9:
        print_colored(f"  ✅ Python {version.major}.{version.minor}.{version.micro} - OK", Colors.GREEN)
        return True
    else:
        print_colored(f"  ❌ Python {version.major}.{version.minor}.{version.micro} - Need 3.9+", Colors.RED)
        return False

def check_virtual_environment() -> Tuple[bool, str]:
    """Check if we're in a virtual environment"""
    print_colored("\n📋 Checking virtual environment...", Colors.CYAN)

    # Check for venv or .venv
    in_venv = hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )

    if in_venv:
        venv_path = sys.prefix
        print_colored(f"  ✅ Virtual environment active: {venv_path}", Colors.GREEN)
        return True, venv_path
    else:
        print_colored("  ⚠️  No virtual environment detected", Colors.YELLOW)
        # Check if venv or .venv exists
        if Path(".venv").exists():
            venv_type = ".venv"
        elif Path("venv").exists():
            venv_type = "venv"
        else:
            venv_type = None

        if venv_type:
            print_colored(f"  💡 Found {venv_type}/ directory. Please activate it:", Colors.YELLOW)
            if os.name == 'nt':  # Windows
                print_colored(f"     {venv_type}\\Scripts\\activate", Colors.YELLOW)
            else:  # Unix/Linux/Mac
                print_colored(f"     source {venv_type}/bin/activate", Colors.YELLOW)
        else:
            print_colored("  💡 Consider creating a virtual environment:", Colors.YELLOW)
            print_colored("     python -m venv .venv", Colors.YELLOW)

        return False, ""

def check_env_file() -> bool:
    """Check if .env file exists and has required variables"""
    print_colored("\n📋 Checking environment configuration...", Colors.CYAN)

    env_file = Path(".env")
    env_example = Path(".env.example")

    if not env_file.exists():
        print_colored("  ⚠️  .env file not found", Colors.YELLOW)
        if env_example.exists():
            print_colored("  💡 Creating .env from .env.example...", Colors.CYAN)
            shutil.copy(env_example, env_file)
            print_colored("  ✅ Created .env file", Colors.GREEN)
            print_colored("  ⚠️  Please edit .env and add your API keys:", Colors.YELLOW)
            print_colored("     - ANTHROPIC_API_KEY (or OPENAI_API_KEY)", Colors.YELLOW)
            return False
        else:
            print_colored("  ❌ No .env or .env.example found", Colors.RED)
            return False

    # Check for required API keys
    try:
        from dotenv import load_dotenv
        load_dotenv()

        has_anthropic = bool(os.getenv("ANTHROPIC_API_KEY"))
        has_openai = bool(os.getenv("OPENAI_API_KEY"))

        if has_anthropic or has_openai:
            api_type = "Anthropic" if has_anthropic else "OpenAI"
            print_colored(f"  ✅ .env file configured ({api_type} API key found)", Colors.GREEN)
            return True
        else:
            print_colored("  ⚠️  No API keys found in .env", Colors.YELLOW)
            print_colored("  💡 Please add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env", Colors.YELLOW)
            return False
    except ImportError:
        print_colored("  ⚠️  python-dotenv not installed, cannot verify .env", Colors.YELLOW)
        return True  # Assume it's OK

def check_dependencies() -> bool:
    """Check if required dependencies are installed"""
    print_colored("\n📋 Checking dependencies...", Colors.CYAN)

    required_packages = [
        "fastapi",
        "uvicorn",
        "langchain",
        "langgraph",
        "pydantic"
    ]

    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print_colored(f"  ✅ {package} - installed", Colors.GREEN)
        except ImportError:
            print_colored(f"  ❌ {package} - missing", Colors.RED)
            missing.append(package)

    if missing:
        print_colored("\n  💡 Install missing packages:", Colors.YELLOW)
        print_colored("     pip install -r requirements.txt", Colors.YELLOW)
        print_colored("     # or with uv:", Colors.YELLOW)
        print_colored("     uv pip install -r requirements.txt", Colors.YELLOW)
        return False

    return True

def check_project_structure() -> bool:
    """Check if we're in the correct directory"""
    print_colored("\n📋 Checking project structure...", Colors.CYAN)

    required_paths = [
        "api/server.py",
        "dashboard.html",
        "dashboard.js",
        "config.js"
    ]

    all_exist = True
    for path in required_paths:
        if Path(path).exists():
            print_colored(f"  ✅ {path} - found", Colors.GREEN)
        else:
            print_colored(f"  ❌ {path} - missing", Colors.RED)
            all_exist = False

    if not all_exist:
        print_colored("\n  ❌ Missing required files!", Colors.RED)
        print_colored("  💡 Make sure you're in the healthcare_sciences_dashboard directory", Colors.YELLOW)
        return False

    return True

def check_prerequisites() -> bool:
    """Run all prerequisite checks"""
    print_header("🔍 CHECKING PREREQUISITES")

    checks = [
        ("Python Version", check_python_version()),
        ("Virtual Environment", check_virtual_environment()[0]),
        ("Project Structure", check_project_structure()),
        ("Dependencies", check_dependencies()),
        ("Environment Config", check_env_file())
    ]

    print_colored("\n" + "=" * 70, Colors.CYAN)
    print_colored("  PREREQUISITES SUMMARY", Colors.BOLD)
    print("=" * 70)

    all_passed = True
    for check_name, passed in checks:
        status = "✅ PASS" if passed else "❌ FAIL"
        color = Colors.GREEN if passed else Colors.RED
        print_colored(f"  {check_name:.<50} {status}", color)
        if not passed:
            all_passed = False

    print("=" * 70)

    if all_passed:
        print_colored("\n  🎉 All prerequisites met!", Colors.GREEN)
    else:
        print_colored("\n  ⚠️  Some prerequisites failed. Please fix them before running.", Colors.YELLOW)

    return all_passed

def start_api_server() -> Optional[subprocess.Popen]:
    """Start the FastAPI server"""
    print_colored("\n🌐 Starting API server on port 8000...", Colors.CYAN)

    try:
        # Start API server
        process = subprocess.Popen(
            [sys.executable, "api/server.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1
        )

        # Wait and check if server started
        time.sleep(3)

        if process.poll() is None:
            print_colored("  ✅ API server running at http://localhost:8000", Colors.GREEN)
            return process
        else:
            stdout, stderr = process.communicate()
            print_colored(f"  ❌ API server failed to start", Colors.RED)
            if stderr:
                print_colored(f"  Error: {stderr[:200]}", Colors.RED)
            return None
    except Exception as e:
        print_colored(f"  ❌ Failed to start API server: {e}", Colors.RED)
        return None

def start_frontend_server() -> Optional[subprocess.Popen]:
    """Start the frontend HTTP server"""
    print_colored("\n🎨 Starting frontend server on port 3000...", Colors.CYAN)

    try:
        # Start HTTP server for frontend
        process = subprocess.Popen(
            [sys.executable, "-m", "http.server", "3000"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Wait and check if server started
        time.sleep(2)

        if process.poll() is None:
            print_colored("  ✅ Frontend server running at http://localhost:3000", Colors.GREEN)
            return process
        else:
            stdout, stderr = process.communicate()
            print_colored(f"  ❌ Frontend server failed to start", Colors.RED)
            if stderr:
                print_colored(f"  Error: {stderr[:200]}", Colors.RED)
            return None
    except Exception as e:
        print_colored(f"  ❌ Failed to start frontend server: {e}", Colors.RED)
        return None

def open_dashboard():
    """Open dashboard in browser after delay"""
    time.sleep(4)
    dashboard_url = "http://localhost:3000/dashboard.html"
    print_colored(f"\n🌐 Opening dashboard in browser: {dashboard_url}", Colors.CYAN)
    try:
        webbrowser.open(dashboard_url)
    except Exception as e:
        print_colored(f"  ⚠️  Could not open browser automatically: {e}", Colors.YELLOW)
        print_colored(f"  Please open manually: {dashboard_url}", Colors.YELLOW)

def show_help():
    """Show help message"""
    help_text = """
LeaderDashboard - Complete Application Startup Script

Usage:
    python run_app.py           # Start the application
    python run_app.py --check   # Check prerequisites only
    python run_app.py --help    # Show this help message

Features:
    • Automatic prerequisite checking
    • Virtual environment detection
    • Dependency verification
    • Environment configuration check
    • Dual server management (API + Frontend)
    • Automatic browser opening
    • Graceful shutdown handling

Requirements:
    • Python 3.9+
    • Virtual environment (recommended)
    • Dependencies from requirements.txt
    • .env file with API keys

Quick Start:
    1. Activate virtual environment:
       Windows: .venv\\Scripts\\activate
       Unix:    source .venv/bin/activate

    2. Install dependencies:
       pip install -r requirements.txt

    3. Configure environment:
       Copy .env.example to .env
       Add your ANTHROPIC_API_KEY or OPENAI_API_KEY

    4. Run the application:
       python run_app.py

Endpoints:
    • Dashboard:    http://localhost:3000/dashboard.html
    • API Docs:     http://localhost:8000/docs
    • API Health:   http://localhost:8000/health
    • API Root:     http://localhost:8000/

Stop Application:
    Press Ctrl+C in the terminal

For more information, see README.md
"""
    print(help_text)

def main():
    """Main function"""
    # Parse arguments
    args = sys.argv[1:]

    if "--help" in args or "-h" in args:
        show_help()
        sys.exit(0)

    if "--check" in args:
        success = check_prerequisites()
        sys.exit(0 if success else 1)

    # Show banner
    print_header("🚀 LEADERDASHBOARD - APPLICATION STARTUP")
    print_colored("\n  AI-Powered Executive Dashboard", Colors.CYAN)
    print_colored("  Healthcare Sciences Dashboard System\n", Colors.CYAN)

    # Run prerequisite checks
    if not check_prerequisites():
        print_colored("\n❌ Prerequisites check failed!", Colors.RED)
        print_colored("💡 Run 'python run_app.py --check' to see details", Colors.YELLOW)
        input("\nPress Enter to exit...")
        sys.exit(1)

    # Start servers
    print_header("🚀 STARTING SERVERS")

    # Start API server
    api_process = start_api_server()
    if not api_process:
        print_colored("\n❌ Failed to start API server!", Colors.RED)
        input("\nPress Enter to exit...")
        sys.exit(1)

    # Start frontend server
    frontend_process = start_frontend_server()
    if not frontend_process:
        print_colored("\n❌ Failed to start frontend server!", Colors.RED)
        print_colored("🛑 Stopping API server...", Colors.YELLOW)
        api_process.terminate()
        input("\nPress Enter to exit...")
        sys.exit(1)

    # Open browser in background
    browser_thread = threading.Thread(target=open_dashboard)
    browser_thread.daemon = True
    browser_thread.start()

    # Show success message
    print_header("🎉 APPLICATION RUNNING SUCCESSFULLY")
    print_colored("\n📍 Access Points:", Colors.BOLD)
    print_colored("  • Dashboard:    http://localhost:3000/dashboard.html", Colors.GREEN)
    print_colored("  • API Docs:     http://localhost:8000/docs", Colors.GREEN)
    print_colored("  • API Health:   http://localhost:8000/health", Colors.GREEN)
    print_colored("  • API Root:     http://localhost:8000/", Colors.GREEN)

    print_colored("\n💡 Controls:", Colors.BOLD)
    print_colored("  • Press Ctrl+C to stop all servers", Colors.YELLOW)
    print_colored("  • Both API and Frontend servers will be stopped gracefully", Colors.YELLOW)

    print("=" * 70 + "\n")

    try:
        # Keep script running
        while True:
            time.sleep(1)

            # Check if processes are still alive
            if api_process.poll() is not None:
                print_colored("\n❌ API server stopped unexpectedly", Colors.RED)
                break
            if frontend_process.poll() is not None:
                print_colored("\n❌ Frontend server stopped unexpectedly", Colors.RED)
                break

    except KeyboardInterrupt:
        print_colored("\n\n🛑 Shutting down servers...", Colors.YELLOW)

        # Terminate processes
        api_process.terminate()
        frontend_process.terminate()

        # Wait for clean shutdown
        try:
            api_process.wait(timeout=5)
            frontend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            print_colored("  ⚠️  Forcing shutdown...", Colors.YELLOW)
            api_process.kill()
            frontend_process.kill()

        print_colored("✅ All servers stopped successfully", Colors.GREEN)
        print_colored("\n👋 Thank you for using LeaderDashboard!\n", Colors.CYAN)

if __name__ == "__main__":
    main()