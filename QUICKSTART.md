# LeaderDashboard - Quick Start Guide

> Get your AI-Powered Executive Dashboard running in 5 minutes!

## 🎯 What You'll Get

- **API Server** running on `http://localhost:8000`
- **Dashboard UI** running on `http://localhost:3000/dashboard.html`
- **18 AI Agents** ready to analyze your business data
- **15+ Dashboard Tiles** with real-time insights

---

## 🚀 Three Ways to Start

### Option 1: Windows (Easiest)

**Double-click `start.bat` in the `healthcare_sciences_dashboard` folder**

That's it! The script will:
- ✅ Check Python installation
- ✅ Activate virtual environment
- ✅ Verify environment configuration
- ✅ Start both servers
- ✅ Open your browser automatically

### Option 2: macOS/Linux (One Command)

```bash
cd healthcare_sciences_dashboard
./start.sh
```

The script will handle everything automatically!

### Option 3: Manual Python Script (Cross-Platform)

```bash
cd healthcare_sciences_dashboard
python run_app.py
```

Or with Python 3:
```bash
python3 run_app.py
```

---

## 📋 Prerequisites

Before running, make sure you have:

1. **Python 3.9+** installed
   - Check: `python --version` or `python3 --version`
   - Download: https://www.python.org/

2. **Virtual Environment** (recommended)
   ```bash
   python -m venv .venv
   ```

3. **Dependencies** installed
   ```bash
   # Activate virtual environment first!
   # Windows:
   .venv\Scripts\activate

   # macOS/Linux:
   source .venv/bin/activate

   # Then install dependencies:
   pip install -r requirements.txt
   ```

4. **Environment Variables** configured
   - Copy `.env.example` to `.env`
   - Add your `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`

---

## 🔧 Detailed Setup Instructions

### Step 1: Clone and Navigate

```bash
git clone https://github.com/pbulbule13/LeaderDashboard.git
cd LeaderDashboard/healthcare_sciences_dashboard
```

### Step 2: Create Virtual Environment

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install Dependencies

**Using pip (traditional):**
```bash
pip install -r requirements.txt
```

**Using uv (faster, recommended):**
```bash
# Install uv first
# Windows:
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# macOS/Linux:
curl -LsSf https://astral.sh/uv/install.sh | sh

# Then install dependencies:
uv pip install -r requirements.txt
```

### Step 4: Configure Environment

```bash
# Windows:
copy .env.example .env
notepad .env

# macOS/Linux:
cp .env.example .env
nano .env
```

**Add your API key to `.env`:**
```bash
# Choose one:
ANTHROPIC_API_KEY=your_anthropic_key_here
# OR
OPENAI_API_KEY=your_openai_key_here
```

### Step 5: Run the Application

**Windows:**
```bash
# Option A: Batch file
start.bat

# Option B: Python script
python run_app.py
```

**macOS/Linux:**
```bash
# Option A: Shell script
./start.sh

# Option B: Python script
python3 run_app.py
```

---

## 🌐 Access Your Dashboard

Once started, open your browser and visit:

| Service | URL | Description |
|---------|-----|-------------|
| **Dashboard** | http://localhost:3000/dashboard.html | Main UI interface |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |
| **API Health** | http://localhost:8000/health | Health check endpoint |
| **API Root** | http://localhost:8000/ | API information |

The browser should open automatically to the dashboard!

---

## 🛑 Stopping the Application

**To stop all servers:**
- Press `Ctrl+C` in the terminal window

Both the API server and frontend server will be stopped gracefully.

---

## ✅ Verification Commands

### Check Prerequisites

Run this to verify your setup without starting the servers:

```bash
python run_app.py --check
```

This will check:
- ✅ Python version (3.9+)
- ✅ Virtual environment
- ✅ Project structure
- ✅ Dependencies
- ✅ Environment configuration

### Test Individual Components

**Test API Server Only:**
```bash
cd healthcare_sciences_dashboard
python api/server.py
```

**Test Frontend Only:**
```bash
cd healthcare_sciences_dashboard
python -m http.server 3000
```

---

## 🐛 Troubleshooting

### Problem: "Python is not installed"

**Solution:**
- Install Python 3.9+ from https://www.python.org/
- Make sure to check "Add Python to PATH" during installation

### Problem: "No module named 'fastapi'"

**Solution:**
- Activate your virtual environment first
- Then run: `pip install -r requirements.txt`

### Problem: "API server failed to start"

**Solution:**
1. Check if port 8000 is already in use
2. Verify your `.env` file has valid API keys
3. Check dependencies are installed: `pip list`
4. Run with verbose output: `python api/server.py`

### Problem: "Frontend server failed to start"

**Solution:**
1. Check if port 3000 is already in use
2. Make sure `dashboard.html` exists in the directory
3. Try a different port: `python -m http.server 8080`

### Problem: "No .env file"

**Solution:**
```bash
# Windows:
copy .env.example .env

# macOS/Linux:
cp .env.example .env
```

Then edit `.env` and add your API keys.

### Problem: Virtual environment not activating

**Windows PowerShell:**
```powershell
# Enable script execution first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate:
.venv\Scripts\Activate.ps1
```

**Windows CMD:**
```cmd
.venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source .venv/bin/activate
```

---

## 📚 Command Reference

### Run Application

| Command | Description |
|---------|-------------|
| `python run_app.py` | Start the full application |
| `python run_app.py --check` | Check prerequisites only |
| `python run_app.py --help` | Show help message |
| `start.bat` | Windows quick start |
| `./start.sh` | Unix/Linux/macOS quick start |

### Development Commands

| Command | Description |
|---------|-------------|
| `python run_tests.py` | Run test suite |
| `python run_demo.py` | Run demo scenarios |
| `python api/server.py` | Run API server only |
| `python -m http.server 3000` | Run frontend only |

---

## 🎓 Next Steps

After successfully starting the dashboard:

1. **Explore the Dashboard**
   - Check out all 15+ dashboard tiles
   - Try the AI chat assistant
   - View real-time metrics

2. **Customize Configuration**
   - Edit `config.js` for frontend settings
   - Edit `config/prompts_config.py` for AI behavior
   - See [CONFIG_GUIDE.md](healthcare_sciences_dashboard/CONFIG_GUIDE.md)

3. **Run Tests**
   ```bash
   python run_tests.py
   ```

4. **Read Documentation**
   - [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture details
   - [README.md](README.md) - Full documentation
   - [CONFIG_GUIDE.md](healthcare_sciences_dashboard/CONFIG_GUIDE.md) - Configuration guide

---

## 💡 Tips & Best Practices

### 1. Always Use Virtual Environments

Never install packages globally. Always use a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
```

### 2. Keep Dependencies Updated

Regularly update your dependencies:
```bash
pip install --upgrade -r requirements.txt
```

### 3. Use Environment Variables

Never commit API keys to git. Always use `.env` files:
```bash
# .env is in .gitignore by default
echo "ANTHROPIC_API_KEY=your_key" > .env
```

### 4. Monitor Server Logs

Keep an eye on the terminal output for errors or warnings.

### 5. Use the Check Command

Before reporting issues, run:
```bash
python run_app.py --check
```

This will diagnose common problems.

---

## 🔐 Security Notes

- ✅ Never commit `.env` files to version control
- ✅ Keep your API keys secret
- ✅ Use environment-specific configurations
- ✅ Regularly update dependencies for security patches

---

## 📞 Getting Help

### Check Documentation

1. [README.md](README.md) - Full project documentation
2. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture and structure
3. [CONFIG_GUIDE.md](healthcare_sciences_dashboard/CONFIG_GUIDE.md) - Configuration options

### Run Diagnostics

```bash
python run_app.py --check
```

### Common Issues

See the [Troubleshooting](#-troubleshooting) section above.

### Report Issues

If you encounter a bug:
1. Run diagnostics: `python run_app.py --check`
2. Check the terminal output for errors
3. Review the troubleshooting section
4. Open an issue on GitHub with full details

---

## 📊 What's Running?

When you start the application, here's what happens:

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1. Prerequisites Check                             │
│     ├─ Python Version ✓                             │
│     ├─ Virtual Environment ✓                        │
│     ├─ Project Structure ✓                          │
│     ├─ Dependencies ✓                               │
│     └─ Environment Config ✓                         │
│                                                     │
│  2. API Server (port 8000)                          │
│     ├─ FastAPI Application                          │
│     ├─ 18 AI Agents                                 │
│     ├─ Dashboard Orchestrator                       │
│     └─ RESTful Endpoints                            │
│                                                     │
│  3. Frontend Server (port 3000)                     │
│     ├─ HTTP Static File Server                      │
│     ├─ dashboard.html                               │
│     ├─ dashboard.js                                 │
│     └─ config.js                                    │
│                                                     │
│  4. Browser                                         │
│     └─ Opens automatically to dashboard             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features You'll Have Access To

### Dashboard Tiles
- 📈 Order Volume & Growth
- ✅ Compliance & Quality
- 💵 Reimbursement Tracking
- 💰 Operating Costs
- 🔬 Lab Metrics
- 🗺️ Regional Performance
- 🔮 AI Forecasting
- 📰 Market Intelligence
- 🎯 Project Milestones
- 📊 Stock Performance
- And more!

### AI Capabilities
- 🤖 Natural language queries
- 💬 Intelligent chat assistant
- 📊 Automated data analysis
- 🎯 Context-aware responses
- 📝 Email management
- 📅 Calendar integration

---

## 🎉 Success!

If you see this message in your terminal:

```
======================================================================
  🎉 APPLICATION RUNNING SUCCESSFULLY
======================================================================

📍 Access Points:
  • Dashboard:    http://localhost:3000/dashboard.html
  • API Docs:     http://localhost:8000/docs
  • API Health:   http://localhost:8000/health
  • API Root:     http://localhost:8000/

💡 Controls:
  • Press Ctrl+C to stop all servers
```

**Congratulations! Your LeaderDashboard is now running! 🎊**

Open your browser to http://localhost:3000/dashboard.html and start exploring!

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Support

Built with ❤️ using AI and modern web technologies

For issues, questions, or contributions:
- GitHub: https://github.com/pbulbule13/LeaderDashboard
- Documentation: See README.md

---

**Happy Dashboarding! 🚀**
