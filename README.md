# LeaderDashboard - AI-Powered Executive Dashboard

<div align="center">

![Status](https://img.shields.io/badge/status-production--ready-green)
![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/python-3.9+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)

**Comprehensive executive dashboard powered by AI for real-time business insights**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Configuration](#-configuration)

</div>

---

## 🎯 Overview

LeaderDashboard is an intelligent executive command center for **HealthCare Sciences**, providing real-time analytics and AI-powered insights across 15+ critical business metrics.

### Key Highlights

- 🤖 **18 AI Agents** for intelligent data analysis
- 📊 **15+ Dashboard Tiles** covering all business areas
- ⚙️ **100% Configurable** from central config files
- 🔄 **Real-time Updates** with auto-refresh
- 📈 **Predictive Analytics** with forecasting
- 🎨 **Modern UI** with Tailwind CSS & Chart.js

---

## ✨ Features

### Business Intelligence
- 📈 **Order Volume** - Real-time order tracking and growth analysis
- ✅ **Compliance** - Quality metrics and return analysis
- 💵 **Reimbursement** - Claims processing and rejection tracking
- 💰 **Operating Costs** - AWS, salaries, lab costs breakdown
- 🔬 **Lab Metrics** - TAT, capacity, and quality tracking
- 🗺️ **Regional Performance** - Territory-wise analysis
- 🔮 **Forecasting** - AI-powered future projections
- 📰 **Market Intelligence** - News and competitor tracking
- 🎯 **Project Milestones** - FDA submissions and project status
- 📊 **Stock Performance** - Real-time stock tracking

### AI Capabilities
- 🤖 **Executive Assistant** - Email, calendar, priority management
- 💬 **Natural Language Queries** - Ask questions in plain English
- 📊 **Automated Analysis** - AI-driven insights and recommendations
- 🎯 **Intelligent Routing** - LangGraph multi-agent orchestration
- 📝 **Context-Aware Responses** - Tailored to your role

### User Experience
- 📧 **Email Integration** - Inbox, categorization, smart replies
- 📅 **Calendar Management** - Schedule, meetings, time tracking
- 💼 **Personal Assistant** - Tasks, goals, health tracking
- 📝 **Quick Notes** - Persistent note-taking
- 🎨 **Responsive Design** - Works on all devices
- 🌓 **Theme Support** - Light/dark mode ready

---

## 🚀 Quick Start

### Prerequisites

```bash
Python 3.9+
Node.js 16+ (for frontend dependencies)
Anthropic API Key
uv (recommended) or pip
```

### Installation

#### Option A: Using uv (Recommended - Fast & Modern)

1. **Install uv** (if not already installed)
```bash
# On macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# On Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

2. **Clone the repository**
```bash
git clone https://github.com/pbulbule13/LeaderDashboard.git
cd LeaderDashboard
```

3. **Create virtual environment and install dependencies**
```bash
cd healthcare_sciences_dashboard

# Create virtual environment with uv
uv venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate

# On macOS/Linux:
source .venv/bin/activate

# Install dependencies with uv (much faster than pip)
uv pip install -r requirements.txt
```

4. **Set up environment**
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
# Windows: notepad .env
# macOS/Linux: nano .env
ANTHROPIC_API_KEY=your_key_here
```

5. **Run the API server**
```bash
# Make sure you're in healthcare_sciences_dashboard directory
python api/server.py
```

6. **Open dashboard in another terminal**
```bash
# Navigate to healthcare_sciences_dashboard directory
cd healthcare_sciences_dashboard

# Start HTTP server for frontend
python -m http.server 3000
```

7. **Access the dashboard**
```
API Server: http://localhost:8000
Dashboard: http://localhost:3000/dashboard.html
```

#### Option B: Using Traditional pip

1. **Clone the repository**
```bash
git clone https://github.com/pbulbule13/LeaderDashboard.git
cd LeaderDashboard
```

2. **Create and activate virtual environment**
```bash
cd healthcare_sciences_dashboard

# Create virtual environment
# python -m venv venv
python -m venv leadershipdashboard

# Activate virtual environment
# On Windows:
leadershipdashboard\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment**
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
ANTHROPIC_API_KEY=your_key_here
```

5. **Run the servers**
```bash
# Terminal 1: Start API server
python api/server.py

# Terminal 2: Start HTTP server for frontend
python -m http.server 3000
```

6. **Open dashboard**
```
API Server: http://localhost:8000
Dashboard: http://localhost:3000/dashboard.html
```

### Running Tests

```bash
# Make sure virtual environment is activated first
# Then run tests from healthcare_sciences_dashboard directory
python run_tests.py

# Or with pytest directly
pytest tests/
```

### Running Demo

```bash
# Make sure virtual environment is activated first
# Then run demo from healthcare_sciences_dashboard directory
python run_demo.py
```

### Environment Activation Reminder

Always activate your virtual environment before running commands:

```bash
# Windows
.venv\Scripts\activate   # if using uv
# or
venv\Scripts\activate    # if using pip

# macOS/Linux
source .venv/bin/activate   # if using uv
# or
source venv/bin/activate    # if using pip
```

---

## 📚 Documentation

### Core Documentation

| Document | Description |
|----------|-------------|
| **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | 📁 Complete project structure with Mermaid diagrams |
| **[CONFIG_GUIDE.md](healthcare_sciences_dashboard/CONFIG_GUIDE.md)** | ⚙️ Comprehensive configuration guide |
| **[CONFIGURATION_SUMMARY.md](CONFIGURATION_SUMMARY.md)** | 📋 Configuration implementation details |
| **[CLEANUP_SUMMARY.md](CLEANUP_SUMMARY.md)** | 🧹 Code cleanup documentation |

### Quick Links

- 🏗️ [Architecture Diagrams](PROJECT_STRUCTURE.md#architecture-diagrams)
- 📁 [Folder Structure](PROJECT_STRUCTURE.md#folder-structure)
- 🔧 [Configuration](CONFIG_GUIDE.md)
- 🎯 [Usage Examples](PROJECT_STRUCTURE.md#usage-examples)
- 🎨 [Design Patterns](PROJECT_STRUCTURE.md#design-patterns-used)

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
│  dashboard.html │ dashboard.js │ config.js                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                              │
│         FastAPI Routes │ WebSocket Support                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Business Logic Layer                       │
│    Dashboard Orchestrator │ LangGraph │ 18 AI Agents        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│   Repositories │ Pydantic Models │ Data Connectors          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Configuration Layer                         │
│    prompts_config.py │ config.js │ .env                     │
└─────────────────────────────────────────────────────────────┘
```

**[View Detailed Diagrams →](PROJECT_STRUCTURE.md#architecture-diagrams)**

### Key Components

#### 1. AI Agents (18 Specialized Agents)
- Stock, Orders, Compliance, Reimbursement, Costs
- Lab Metrics, Regional, Forecasting, Market Intelligence
- Milestones, Assistant, Budget, Products, Revenue
- Support, Workforce, and more

#### 2. Data Layer
- **15 Pydantic Models** for type-safe data
- **15 Repositories** for data access
- **Repository Pattern** for clean architecture

#### 3. Configuration System
- **Frontend Config** (`config.js`) - 650+ options
- **Backend Config** (`config/prompts_config.py`) - 40+ prompts
- **Environment** (`.env`) - Secrets management

#### 4. API Layer
- RESTful endpoints
- WebSocket support (ready)
- JSON responses
- CORS enabled

---

## ⚙️ Configuration

### Everything is Configurable!

The dashboard is **100% configurable** without touching code:

### Frontend Configuration (`config.js`)

```javascript
// Change company branding
branding: {
    companyName: 'Your Company',
    companyShortName: 'YC',
    dashboardTitle: 'Your Dashboard'
}

// Customize AI behavior
agentBehaviors: {
    responseStyle: {
        defaultTone: 'professional',
        verbosity: 'concise',
        format: 'bullet_points'
    }
}

// Email categorization
emailBehavior: {
    categorization: {
        urgent: {
            keywords: ['urgent', 'critical'],
            senders: ['ceo@company.com']
        }
    }
}
```

### Backend Configuration (`config/prompts_config.py`)

```python
# Customize AI prompts
STOCK_PROMPTS = {
    'analysis': """
    Your custom stock analysis prompt...
    """
}

# Company context
COMPANY_CONTEXT = {
    'name': 'Your Company',
    'industry': 'Your Industry'
}
```

**[Complete Configuration Guide →](healthcare_sciences_dashboard/CONFIG_GUIDE.md)**

---

## 📂 Project Structure

```
LeaderDashboard/
├── healthcare_sciences_dashboard/
│   ├── agents/              # 18 AI agents
│   ├── api/                 # FastAPI routes
│   ├── config/              # Centralized configuration
│   ├── data/                # Models, repositories, connectors
│   ├── graph/               # LangGraph orchestration
│   ├── tests/               # Test suite
│   ├── config.js            # Frontend configuration
│   ├── dashboard.html       # Main dashboard UI
│   ├── dashboard.js         # Frontend logic
│   └── run_server.py        # Server entry point
├── docs/                    # Additional documentation
├── PROJECT_STRUCTURE.md     # Complete structure docs
├── CONFIG_GUIDE.md          # Configuration guide
├── CONFIGURATION_SUMMARY.md # Implementation summary
├── CLEANUP_SUMMARY.md       # Cleanup documentation
└── README.md                # This file
```

**[View Detailed Structure →](PROJECT_STRUCTURE.md)**

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - LLM orchestration
- **LangGraph** - Multi-agent workflows
- **Anthropic Claude** - AI reasoning
- **Pydantic** - Data validation
- **Python 3.9+** - Core language

### Frontend
- **HTML5/CSS3** - Structure and styling
- **Tailwind CSS** - Utility-first CSS
- **Chart.js** - Data visualization
- **Vanilla JavaScript** - No heavy frameworks

### Infrastructure
- **Uvicorn** - ASGI server
- **CORS** - Cross-origin support
- **Async/Await** - Non-blocking I/O
- **Git** - Version control

---

## 🎨 Dashboard Screenshots

### Main Dashboard
- 15+ interactive tiles
- Real-time data updates
- AI-powered insights

### AI Assistant
- Natural language queries
- Context-aware responses
- Quick action buttons

### Email & Calendar
- Integrated inbox
- Smart categorization
- Schedule management

---

## 🧪 Testing

### Test Coverage

```bash
# Run all tests
python run_tests.py

# Run specific test
pytest tests/unit/test_agents.py

# Run with coverage
pytest --cov=healthcare_sciences_dashboard
```

### Test Structure
- **Unit Tests** - Individual components
- **Integration Tests** - Component interactions
- **API Tests** - Endpoint testing

---

## 🚢 Deployment

### Development

```bash
# Activate virtual environment first
source .venv/bin/activate  # macOS/Linux
# or
.venv\Scripts\activate     # Windows

# Start API server
cd healthcare_sciences_dashboard
python api/server.py

# In another terminal, start frontend server
python -m http.server 3000
```

### Production

```bash
# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
# or
.venv\Scripts\activate     # Windows

# Using Uvicorn directly
cd healthcare_sciences_dashboard
uvicorn api.server:app --host 0.0.0.0 --port 8000 --workers 4

# Using Docker (future)
docker-compose up -d
```

### Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=your_key

# Optional
ENVIRONMENT=production
LOG_LEVEL=info
DEBUG=false
PORT=8000
```

---

## 🔐 Security

### Best Practices
- ✅ API keys in environment variables
- ✅ `.env` files in `.gitignore`
- ✅ Input validation with Pydantic
- ✅ CORS properly configured
- ✅ No secrets in code

### Security Features
- Environment-based configuration
- Type-safe data models
- Error handling
- Secure API endpoints

---

## 📈 Performance

### Optimization Features
- ✅ Async operations throughout
- ✅ Parallel agent execution
- ✅ Frontend caching
- ✅ Lazy loading
- ✅ Efficient data models

### Scalability
- Stateless API design
- Ready for load balancing
- Database-ready repositories
- Caching layer ready

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes
4. Update documentation
5. Run tests (`python run_tests.py`)
6. Commit (`git commit -m 'Add amazing feature'`)
7. Push (`git push origin feature/amazing-feature`)
8. Open Pull Request

### Coding Standards
- Follow PEP 8 for Python
- Use type hints
- Write docstrings
- Add tests for new features
- Update documentation

---

## 📋 Roadmap

### Current Version (2.0)
- ✅ 18 AI agents
- ✅ 15+ dashboard tiles
- ✅ Centralized configuration
- ✅ Comprehensive documentation
- ✅ Clean architecture

### Future Enhancements
- 🔄 Real-time WebSocket updates
- 🌓 Dark mode
- 📊 Custom dashboard builder
- 🔌 Plugin system
- 📱 Mobile app
- 🔔 Push notifications
- 📤 Data export
- 🎨 Theme customization UI
- 🔒 Enhanced authentication
- 📊 Advanced analytics

---

## 📞 Support

### Documentation
- [Project Structure](PROJECT_STRUCTURE.md)
- [Configuration Guide](healthcare_sciences_dashboard/CONFIG_GUIDE.md)
- [Configuration Summary](CONFIGURATION_SUMMARY.md)

### Issues
Report issues on [GitHub Issues](https://github.com/pbulbule13/LeaderDashboard/issues)

### Questions
Check the documentation first, then open a discussion

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

**Development Team**
- Initial work and architecture
- AI integration
- Full-stack implementation

---

## 🙏 Acknowledgments

- Anthropic for Claude API
- FastAPI community
- LangChain team
- Open source contributors

---

## 📊 Project Stats

- **Lines of Code:** 10,000+
- **AI Agents:** 18
- **Configuration Options:** 650+
- **Dashboard Tiles:** 15+
- **Test Coverage:** 80%+
- **Documentation Pages:** 2,500+ lines

---

<div align="center">

**Built with ❤️ using AI and modern web technologies**

[⬆ Back to Top](#leaderdashboard---ai-powered-executive-dashboard)

</div>
