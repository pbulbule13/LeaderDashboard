#!/bin/bash
################################################################################
# LeaderDashboard - Unix/Linux/macOS Startup Script
# Comprehensive startup script for Unix-based systems
################################################################################

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

print_header() {
    echo ""
    echo "========================================================================"
    print_color "${BOLD}${CYAN}" "  $1"
    echo "========================================================================"
}

print_error() {
    print_color "${RED}" "[ERROR] $1"
}

print_warning() {
    print_color "${YELLOW}" "[WARNING] $1"
}

print_info() {
    print_color "${CYAN}" "[INFO] $1"
}

print_success() {
    print_color "${GREEN}" "[OK] $1"
}

# Main header
echo ""
echo "========================================================================"
print_color "${BOLD}${CYAN}" "  LEADERDASHBOARD - UNIX/LINUX/MACOS STARTUP SCRIPT"
echo "========================================================================"
print_color "${CYAN}" "  AI-Powered Executive Dashboard"
print_color "${CYAN}" "  Healthcare Sciences Dashboard System"
echo "========================================================================"
echo ""

# Check if Python is available
print_info "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed or not in PATH"
    echo ""
    echo "Please install Python 3.9+ from:"
    echo "  - macOS: brew install python3"
    echo "  - Ubuntu/Debian: sudo apt-get install python3"
    echo "  - Fedora: sudo dnf install python3"
    echo ""
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
print_success "Python $PYTHON_VERSION is installed"
echo ""

# Check if we're in the correct directory
print_info "Verifying project structure..."
if [ ! -f "api/server.py" ]; then
    print_error "Cannot find api/server.py"
    echo ""
    echo "Please make sure you're running this script from the"
    echo "healthcare_sciences_dashboard directory"
    echo ""
    exit 1
fi

print_success "Project structure verified"
echo ""

# Check for virtual environment
print_info "Checking for virtual environment..."
if [ -f ".venv/bin/activate" ]; then
    print_info "Found .venv virtual environment"
    print_info "Activating virtual environment..."
    source .venv/bin/activate
    print_success "Virtual environment activated"
    echo ""
elif [ -f "venv/bin/activate" ]; then
    print_info "Found venv virtual environment"
    print_info "Activating virtual environment..."
    source venv/bin/activate
    print_success "Virtual environment activated"
    echo ""
else
    print_warning "No virtual environment found"
    print_info "Running with system Python"
    echo ""
    print_color "${YELLOW}" "[TIP] Consider creating a virtual environment:"
    echo "      python3 -m venv .venv"
    echo "      source .venv/bin/activate"
    echo "      pip install -r requirements.txt"
    echo ""
fi

# Check for .env file
print_info "Checking environment configuration..."
if [ ! -f ".env" ]; then
    print_warning ".env file not found"
    if [ -f ".env.example" ]; then
        print_info "Copying .env.example to .env..."
        cp .env.example .env
        print_success "Created .env file"
        echo ""
        print_color "${YELLOW}" "[ACTION REQUIRED] Please edit .env and add your API keys:"
        echo "                  - ANTHROPIC_API_KEY or OPENAI_API_KEY"
        echo ""
        echo "Opening .env in default editor..."
        echo "Press Enter to continue..."
        read -r

        # Try to open with various editors
        if command -v nano &> /dev/null; then
            nano .env
        elif command -v vim &> /dev/null; then
            vim .env
        elif command -v vi &> /dev/null; then
            vi .env
        else
            echo "Please edit .env manually with your preferred editor"
        fi

        echo ""
        echo "After saving your API keys, press Enter to continue..."
        read -r
    else
        print_error "No .env.example file found"
        echo ""
        exit 1
    fi
fi

print_success "Environment configuration found"
echo ""

# Start the application
print_header "STARTING APPLICATION"
echo ""
echo "Running: python3 run_app.py"
echo ""
echo "NOTE: The script will:"
echo "  1. Check all prerequisites"
echo "  2. Start the API server (port 8000)"
echo "  3. Start the frontend server (port 3000)"
echo "  4. Open your browser automatically"
echo ""
echo "To stop: Press Ctrl+C in this terminal"
echo ""
echo "========================================================================"
echo ""

# Run the application
python3 run_app.py
EXIT_CODE=$?

# Check exit code
if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "========================================================================"
    print_error "Application exited with an error"
    echo "========================================================================"
    echo ""
    echo "Troubleshooting tips:"
    echo "  1. Make sure you activated your virtual environment"
    echo "  2. Install dependencies: pip install -r requirements.txt"
    echo "  3. Check your .env file has valid API keys"
    echo "  4. Run: python3 run_app.py --check"
    echo ""
else
    echo ""
    echo "========================================================================"
    print_info "Application stopped normally"
    echo "========================================================================"
    echo ""
fi

echo "Press Enter to exit..."
read -r
