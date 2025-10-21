# HealthCare Sciences CEO Dashboard

Agentic AI-powered executive dashboard with LangGraph orchestration.

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
pip install -e .
```

### 2. Configure Environment
```powershell
# Copy example env file
copy .env.example .env

# Edit .env and add your API key
notepad .env
```

Add your OpenAI key:
```env
OPENAI_API_KEY=sk-your-key-here
```

### 3. Run the Application

**Option A: Demo Mode (Test Agents)**
```powershell
python run_demo.py
```

**Option B: API Server**
```powershell
python run_server.py
```
Then visit: http://localhost:8000/docs

**Option C: Run Tests**
```powershell
python run_tests.py
```

## 📡 API Endpoints

Once the server is running:

- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **Products Tile**: http://localhost:8000/api/dashboard/tiles/products
- **All Tiles**: http://localhost:8000/api/dashboard/tiles/all
- **Ask Query**: POST http://localhost:8000/api/query/ask

## 🧪 Testing
```powershell
# Run all tests
python run_tests.py

# Or use pytest directly
pytest tests/ -v
```

## 📁 Project Structure
```
healthcare_sciences_dashboard/
├── agents/              # AI agents for each tile
├── api/                 # FastAPI backend
├── data/                # Data models & repositories
├── graph/               # LangGraph workflow
├── prompts/             # LLM prompts
├── tests/               # Unit & integration tests
├── run_server.py        # Start API server
├── run_demo.py          # Demo agents
└── run_tests.py         # Run tests
```

## 🎯 What Each Script Does

| Script | Purpose |
|--------|---------|
| run_server.py | Starts FastAPI server on port 8000 |
| run_demo.py | Tests agents with sample queries |
| run_tests.py | Runs all unit and integration tests |

## 🔧 Development

### Add New Agent
1. Create gents/new_agent.py
2. Extend BaseAgent
3. Add to graph/nodes.py
4. Update routing logic

### Connect Real Data
1. Update data/repositories/
2. Add database connector
3. Replace mock data

## 📝 License

Proprietary - HealthCare Sciences
