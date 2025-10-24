# HealthCare Sciences CEO Dashboard

Agentic AI-powered executive dashboard with LangGraph orchestration.

## What's New in V2.0

The dashboard has been enhanced with **15 comprehensive CEO dashboard tiles** based on executive requirements:

1. **Order Volume & Growth** - Track orders and growth trends across all time periods
2. **Compliance & Returns** - Monitor kit returns and compliance metrics
3. **Reimbursement Metrics** - Analyze claim reimbursement rates and rejection reasons
4. **Financial KPIs/Revenue** - Revenue tracking by period and product line
5. **Operating Costs** - AWS, salaries, lab costs, and efficiency metrics
6. **Lab Metrics** - Processing volumes, turnaround time, quality metrics
7. **Regional Performance** - Territory-wise performance with map visualization
8. **Forecasting** - AI-powered order and revenue projections
9. **Market Intelligence** - Competitor updates, regulatory changes, industry trends
10. **Project Milestones** - FDA submissions and key project tracking
11. **Stock Price** - Real-time stock tracking (existing, enhanced)
12. **Products Overview** - Product performance metrics
13-15. **Support, Workforce, Budget** - Existing operational dashboards

**New Overview Endpoint**: Get all dashboard data in one API call at `/api/dashboard/overview`

## 🚀 Quick Start

### 1. Navigate to Project Directory
```powershell
cd healthcare_sciences_dashboard
```

### 2. Install Dependencies
```powershell
pip install -e .
```

### 3. Configure Environment
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

### 4. Run the Application

**Option A: API Server (Main Dashboard)**
```powershell
python run_server.py
```
Then visit:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

**Option B: Demo Mode (Test Agents)**
```powershell
python run_demo.py
```

**Option C: Run Tests**
```powershell
python run_tests.py
```

### Troubleshooting

If you get `ModuleNotFoundError`, ensure dependencies are installed:
```powershell
pip install -e .
```

## 📡 API Endpoints

Once the server is running:

### Core Endpoints
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs
- **Dashboard Overview**: http://localhost:8000/api/dashboard/overview

### CEO Dashboard Tiles (New)
- **Order Volume & Growth**: http://localhost:8000/api/dashboard/tiles/order-volume
- **Compliance & Returns**: http://localhost:8000/api/dashboard/tiles/compliance
- **Reimbursement Metrics**: http://localhost:8000/api/dashboard/tiles/reimbursement
- **Operating Costs**: http://localhost:8000/api/dashboard/tiles/operating-costs
- **Lab Metrics**: http://localhost:8000/api/dashboard/tiles/lab-metrics
- **Regional Performance**: http://localhost:8000/api/dashboard/tiles/regional
- **Forecasting**: http://localhost:8000/api/dashboard/tiles/forecasting
- **Market Intelligence**: http://localhost:8000/api/dashboard/tiles/market-intelligence
- **Project Milestones**: http://localhost:8000/api/dashboard/tiles/milestones

### Existing Tiles
- **Products**: http://localhost:8000/api/dashboard/tiles/products
- **Revenue**: http://localhost:8000/api/dashboard/tiles/revenue
- **Budget**: http://localhost:8000/api/dashboard/tiles/budget
- **Support**: http://localhost:8000/api/dashboard/tiles/support
- **Workforce**: http://localhost:8000/api/dashboard/tiles/workforce
- **Stock Price**: http://localhost:8000/api/dashboard/tiles/stock
- **All Legacy Tiles**: http://localhost:8000/api/dashboard/tiles/all

### Query
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
