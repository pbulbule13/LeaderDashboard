#!/usr/bin/env python3
"""
LeaderDashboard - Simple Startup Script
Just run: python run_app.py
"""

import os
import sys
import subprocess
import time
import threading
import webbrowser
from pathlib import Path

def start_api_server():
    """Start the FastAPI server"""
    print("🌐 Starting API server on port 8000...")
    
    # Start API server
    process = subprocess.Popen(
        [sys.executable, "api/server.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait a moment for server to start
    time.sleep(3)
    
    if process.poll() is None:
        print("✅ API server running at http://localhost:8000")
        return process
    else:
        stdout, stderr = process.communicate()
        print(f"❌ API server failed: {stderr}")
        return None

def start_frontend_server():
    """Start the frontend HTTP server"""
    print("🎨 Starting frontend server on port 3000...")
    
    # Start HTTP server for frontend
    process = subprocess.Popen(
        [sys.executable, "-m", "http.server", "3000"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait a moment for server to start
    time.sleep(2)
    
    if process.poll() is None:
        print("✅ Frontend server running at http://localhost:3000")
        return process
    else:
        stdout, stderr = process.communicate()
        print(f"❌ Frontend server failed: {stderr}")
        return None

def open_dashboard():
    """Open dashboard in browser after delay"""
    time.sleep(5)
    dashboard_url = "http://localhost:3000/dashboard.html"
    print(f"🌐 Opening dashboard: {dashboard_url}")
    webbrowser.open(dashboard_url)

def main():
    """Main function"""
    import sys
    import io
    # Set UTF-8 encoding for Windows console
    if sys.platform == 'win32':
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    print("=" * 60)
    print("🚀 LeaderDashboard - Starting Application")
    print("=" * 60)

    # Check if api/server.py exists
    if not Path("api/server.py").exists():
        print("❌ Error: api/server.py not found!")
        print("Make sure you're in the healthcare_sciences_dashboard directory")
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Start API server
    api_process = start_api_server()
    if not api_process:
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Start frontend server
    frontend_process = start_frontend_server()
    if not frontend_process:
        print("🛑 Stopping API server...")
        api_process.terminate()
        input("Press Enter to exit...")
        sys.exit(1)
    
    # Open browser in background
    browser_thread = threading.Thread(target=open_dashboard)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Show success message
    print("\n" + "=" * 60)
    print("🎉 LeaderDashboard is now running!")
    print("=" * 60)
    print("📍 Dashboard:  http://localhost:3000/dashboard.html")
    print("📍 API Docs:   http://localhost:8000/docs")
    print("📍 API Health: http://localhost:8000/health")
    print("\n💡 Press Ctrl+C to stop all servers")
    print("=" * 60)
    
    try:
        # Keep script running
        while True:
            time.sleep(1)
            
            # Check if processes are still alive
            if api_process.poll() is not None:
                print("❌ API server stopped unexpectedly")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend server stopped unexpectedly")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        
        # Terminate processes
        api_process.terminate()
        frontend_process.terminate()
        
        # Wait for clean shutdown
        try:
            api_process.wait(timeout=5)
            frontend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            api_process.kill()
            frontend_process.kill()
        
        print("✅ All servers stopped successfully")

if __name__ == "__main__":
    main()