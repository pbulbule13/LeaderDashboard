# Architecture Diagrams

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[CEO Dashboard HTML/JS]
        Charts[Chart.js Visualizations]
        Chat[AI Chat Interface]
    end

    subgraph "API Layer"
        FastAPI[FastAPI Server :8000]
        Health[/health endpoint]
        Tiles[/api/dashboard/tiles/*]
        Query[/api/query/ask]
    end

    subgraph "Orchestration Layer"
        Orchestrator[Dashboard Orchestrator]
        Router[Query Router]
        Graph[LangGraph Workflow]
    end

    subgraph "Agent Layer"
        ProductsAgent[Products Agent]
        RevenueAgent[Revenue Agent]
        BudgetAgent[Budget Agent]
        SupportAgent[Support Agent]
        WorkforceAgent[Workforce Agent]
        StockAgent[Stock Agent]
        BaseAgent[Base Agent]
    end

    subgraph "Data Layer"
        ProductRepo[Product Repository]
        RevenueRepo[Revenue Repository]
        BudgetRepo[Budget Repository]
        SupportRepo[Support Repository]
        WorkforceRepo[Workforce Repository]
        StockRepo[Stock Repository]
    end

    subgraph "External Services"
        OpenAI[OpenAI API]
        AlphaVantage[Alpha Vantage API]
    end

    UI --> FastAPI
    Charts --> FastAPI
    Chat --> FastAPI

    FastAPI --> Health
    FastAPI --> Tiles
    FastAPI --> Query

    Query --> Orchestrator
    Tiles --> ProductRepo
    Tiles --> RevenueRepo
    Tiles --> BudgetRepo
    Tiles --> SupportRepo
    Tiles --> WorkforceRepo

    Orchestrator --> Router
    Router --> Graph

    Graph --> ProductsAgent
    Graph --> RevenueAgent
    Graph --> BudgetAgent
    Graph --> SupportAgent
    Graph --> WorkforceAgent
    Graph --> StockAgent

    ProductsAgent --> BaseAgent
    RevenueAgent --> BaseAgent
    BudgetAgent --> BaseAgent
    SupportAgent --> BaseAgent
    WorkforceAgent --> BaseAgent
    StockAgent --> BaseAgent

    ProductsAgent --> ProductRepo
    RevenueAgent --> RevenueRepo
    BudgetAgent --> BudgetRepo
    SupportAgent --> SupportRepo
    WorkforceAgent --> WorkforceRepo
    StockAgent --> StockRepo

    BaseAgent --> OpenAI
    StockAgent --> AlphaVantage

    style UI fill:#e1f5ff
    style FastAPI fill:#ffe1e1
    style Orchestrator fill:#fff4e1
    style BaseAgent fill:#e1ffe1
    style OpenAI fill:#f0e1ff
```

## 2. Agent Query Processing Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant FastAPI
    participant Orchestrator
    participant Router
    participant Agent
    participant LLM
    participant DataRepo

    User->>Dashboard: Ask query: "How is Cologuard performing?"
    Dashboard->>FastAPI: POST /api/query/ask
    FastAPI->>Orchestrator: process_query(query, context)
    Orchestrator->>Router: Analyze query intent
    Router->>Router: Determine target agent
    Router-->>Orchestrator: Route to ProductsAgent
    Orchestrator->>Agent: Execute agent
    Agent->>DataRepo: Fetch product data
    DataRepo-->>Agent: Return product metrics
    Agent->>LLM: Generate natural language response
    LLM-->>Agent: "Cologuard shows strong performance..."
    Agent-->>Orchestrator: Return formatted response
    Orchestrator-->>FastAPI: final_response
    FastAPI-->>Dashboard: JSON response
    Dashboard-->>User: Display AI response
```

## 3. LangGraph State Machine

```mermaid
stateDiagram-v2
    [*] --> Router: User Query
    Router --> ProductsAgent: Product query
    Router --> RevenueAgent: Revenue query
    Router --> BudgetAgent: Budget query
    Router --> SupportAgent: Support query
    Router --> WorkforceAgent: Workforce query
    Router --> StockAgent: Stock query
    Router --> AssistantAgent: General query

    ProductsAgent --> Aggregator: Return data
    RevenueAgent --> Aggregator: Return data
    BudgetAgent --> Aggregator: Return data
    SupportAgent --> Aggregator: Return data
    WorkforceAgent --> Aggregator: Return data
    StockAgent --> Aggregator: Return data
    AssistantAgent --> Aggregator: Return data

    Aggregator --> FinalResponse: Format response
    FinalResponse --> [*]: Return to user
```

## 4. Dashboard Tile Loading Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Dashboard
    participant FastAPI
    participant Repository
    participant DataSource

    Browser->>Dashboard: Load page
    Dashboard->>Dashboard: Render static content
    Dashboard->>FastAPI: GET /api/dashboard/tiles/products
    FastAPI->>Repository: get_products()
    Repository->>DataSource: Fetch data
    DataSource-->>Repository: Mock data
    Repository-->>FastAPI: Product metrics
    FastAPI-->>Dashboard: JSON response
    Dashboard->>Dashboard: Render Chart.js graph
    Dashboard-->>Browser: Display visualization

    Note over Dashboard,FastAPI: Same flow for all tiles:<br/>revenue, budget, support, workforce
```

## 5. Component Layer Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        HTML[HTML/CSS/JS]
        Components[UI Components]
        Charts[Chart.js]
    end

    subgraph "API Gateway Layer"
        Routes[API Routes]
        Middleware[Middleware]
        Validation[Request Validation]
    end

    subgraph "Business Logic Layer"
        Orchestrator[Orchestrator]
        AgentFactory[Agent Factory]
        StateMachine[State Machine]
    end

    subgraph "Agent Layer"
        Agents[Specialized Agents]
        BaseLogic[Base Agent Logic]
        PromptMgmt[Prompt Management]
    end

    subgraph "Integration Layer"
        LLMClient[LLM Client]
        APIClients[API Clients]
        DataAdapters[Data Adapters]
    end

    subgraph "Data Access Layer"
        Repositories[Repositories]
        Models[Data Models]
        Cache[Cache Layer]
    end

    HTML --> Routes
    Components --> Routes
    Charts --> Routes

    Routes --> Middleware
    Middleware --> Validation
    Validation --> Orchestrator

    Orchestrator --> AgentFactory
    AgentFactory --> StateMachine
    StateMachine --> Agents

    Agents --> BaseLogic
    BaseLogic --> PromptMgmt
    PromptMgmt --> LLMClient

    Agents --> DataAdapters
    DataAdapters --> Repositories
    LLMClient --> APIClients

    Repositories --> Models
    Repositories --> Cache
```

## 6. Data Flow: AI Query Processing

```mermaid
flowchart TD
    Start([User Query]) --> Input[Receive Query]
    Input --> InitState[Initialize Dashboard State]
    InitState --> Router{Query Router}

    Router -->|Product| PA[Products Agent]
    Router -->|Revenue| RA[Revenue Agent]
    Router -->|Budget| BA[Budget Agent]
    Router -->|Support| SA[Support Agent]
    Router -->|Workforce| WA[Workforce Agent]
    Router -->|Stock| STA[Stock Agent]
    Router -->|General| AA[Assistant Agent]

    PA --> FetchData1[Fetch Product Data]
    RA --> FetchData2[Fetch Revenue Data]
    BA --> FetchData3[Fetch Budget Data]
    SA --> FetchData4[Fetch Support Data]
    WA --> FetchData5[Fetch Workforce Data]
    STA --> FetchData6[Fetch Stock Data]
    AA --> FetchData7[Fetch Context Data]

    FetchData1 --> BuildPrompt1[Build LLM Prompt]
    FetchData2 --> BuildPrompt2[Build LLM Prompt]
    FetchData3 --> BuildPrompt3[Build LLM Prompt]
    FetchData4 --> BuildPrompt4[Build LLM Prompt]
    FetchData5 --> BuildPrompt5[Build LLM Prompt]
    FetchData6 --> BuildPrompt6[Build LLM Prompt]
    FetchData7 --> BuildPrompt7[Build LLM Prompt]

    BuildPrompt1 --> LLM[Call LLM API]
    BuildPrompt2 --> LLM
    BuildPrompt3 --> LLM
    BuildPrompt4 --> LLM
    BuildPrompt5 --> LLM
    BuildPrompt6 --> LLM
    BuildPrompt7 --> LLM

    LLM --> Format[Format Response]
    Format --> UpdateState[Update State]
    UpdateState --> Response([Return Response])
```

## 7. Agent Class Hierarchy

```mermaid
classDiagram
    class BaseAgent {
        +llm: LLM
        +prompt_template: str
        +run(state: DashboardState)
        #format_data(data: dict)
        #generate_response(prompt: str)
    }

    class ProductsAgent {
        +repository: ProductRepository
        +run(state: DashboardState)
        -analyze_products()
    }

    class RevenueAgent {
        +repository: RevenueRepository
        +run(state: DashboardState)
        -analyze_revenue()
    }

    class BudgetAgent {
        +repository: BudgetRepository
        +run(state: DashboardState)
        -analyze_budget()
    }

    class SupportAgent {
        +repository: SupportRepository
        +run(state: DashboardState)
        -analyze_tickets()
    }

    class WorkforceAgent {
        +repository: WorkforceRepository
        +run(state: DashboardState)
        -analyze_workforce()
    }

    class StockAgent {
        +api_client: AlphaVantageClient
        +run(state: DashboardState)
        -fetch_stock_price()
    }

    BaseAgent <|-- ProductsAgent
    BaseAgent <|-- RevenueAgent
    BaseAgent <|-- BudgetAgent
    BaseAgent <|-- SupportAgent
    BaseAgent <|-- WorkforceAgent
    BaseAgent <|-- StockAgent
```

## 8. Deployment Architecture

```mermaid
graph LR
    subgraph "Client Tier"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end

    subgraph "Load Balancer"
        LB[nginx/Load Balancer]
    end

    subgraph "Application Tier"
        API1[FastAPI Instance 1]
        API2[FastAPI Instance 2]
        API3[FastAPI Instance N]
    end

    subgraph "Service Tier"
        Orchestrator[Agent Orchestrator]
        Agents[AI Agents Pool]
    end

    subgraph "External APIs"
        OpenAI[OpenAI API]
        AlphaVantage[Alpha Vantage]
    end

    subgraph "Data Tier"
        Primary[(Primary DB)]
        Replica[(Read Replica)]
        Redis[(Redis Cache)]
    end

    Browser --> LB
    Mobile --> LB
    LB --> API1
    LB --> API2
    LB --> API3

    API1 --> Orchestrator
    API2 --> Orchestrator
    API3 --> Orchestrator

    Orchestrator --> Agents

    Agents --> OpenAI
    Agents --> AlphaVantage

    API1 --> Redis
    API2 --> Redis
    API3 --> Redis

    Agents --> Primary
    Agents --> Replica

    Primary -.Replication.-> Replica
```

## 9. Request-Response Cycle

```mermaid
graph LR
    A[User] -->|1. HTTP Request| B[FastAPI]
    B -->|2. Validate| C[Pydantic Model]
    C -->|3. Route| D[API Endpoint]
    D -->|4. Invoke| E[Orchestrator]
    E -->|5. Create State| F[DashboardState]
    F -->|6. Execute| G[LangGraph]
    G -->|7. Route| H[Agent]
    H -->|8. Query| I[Repository]
    I -->|9. Return Data| H
    H -->|10. Call| J[LLM]
    J -->|11. Response| H
    H -->|12. Update State| G
    G -->|13. Final State| E
    E -->|14. Extract Response| D
    D -->|15. JSON| B
    B -->|16. HTTP Response| A
```

## 10. Technology Stack Overview

```mermaid
mindmap
    root((LeaderDashboard))
        Frontend
            HTML5
            Tailwind CSS
            Chart.js
            JavaScript
        Backend
            Python 3.x
            FastAPI
            Uvicorn
            Pydantic
        AI/ML
            LangChain
            LangGraph
            OpenAI
            
        Data
            Repositories
            Mock Data
            Future: PostgreSQL
        DevOps
            pytest
            dotenv
            Git
        External APIs
            Alpha Vantage
            Healthcare Sciences API
```

## 11. Error Handling Flow

```mermaid
flowchart TD
    Start([Request]) --> Try{Try Processing}
    Try -->|Success| Process[Process Query]
    Try -->|Error| ErrorType{Error Type}

    Process --> Success([Return Success])

    ErrorType -->|Validation| ValError[Validation Error]
    ErrorType -->|LLM API| LLMError[LLM Error]
    ErrorType -->|Data| DataError[Data Error]
    ErrorType -->|Unknown| UnknownError[Unknown Error]

    ValError --> Log1[Log Error]
    LLMError --> Log2[Log Error]
    DataError --> Log3[Log Error]
    UnknownError --> Log4[Log Error]

    Log1 --> Return1[Return 400 Error]
    Log2 --> Retry{Retry?}
    Log3 --> Return3[Return 500 Error]
    Log4 --> Return4[Return 500 Error]

    Retry -->|Yes| Process
    Retry -->|No| Return2[Return 503 Error]
```

## 12. Agent Orchestration Pattern

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Orchestrator
    participant LangGraph
    participant Router
    participant Agent
    participant Repository
    participant LLM

    Client->>API: POST /api/query/ask
    API->>Orchestrator: process_query()
    Orchestrator->>LangGraph: ainvoke(initial_state)

    LangGraph->>Router: route_query(state)
    Router->>Router: Analyze intent
    Router-->>LangGraph: target_agent = "products"

    LangGraph->>Agent: execute_agent(state)
    Agent->>Repository: get_products()
    Repository-->>Agent: product_data

    Agent->>Agent: build_prompt(data)
    Agent->>LLM: generate(prompt)
    LLM-->>Agent: response_text

    Agent->>Agent: update_state(response)
    Agent-->>LangGraph: updated_state

    LangGraph->>LangGraph: aggregate_results()
    LangGraph-->>Orchestrator: final_state

    Orchestrator->>Orchestrator: extract final_response
    Orchestrator-->>API: response_text

    API-->>Client: JSON response
```

## 13. Future Architecture with Microservices

```mermaid
graph TB
    subgraph "API Gateway"
        Gateway[API Gateway]
        Auth[Auth Service]
    end

    subgraph "Frontend Services"
        WebApp[Web Application]
        MobileApp[Mobile App]
    end

    subgraph "Microservices"
        ProductSvc[Product Service]
        RevenueSvc[Revenue Service]
        BudgetSvc[Budget Service]
        SupportSvc[Support Service]
        WorkforceSvc[Workforce Service]
        QuerySvc[Query Service]
    end

    subgraph "AI Services"
        LLMGateway[LLM Gateway]
        AgentPool[Agent Pool]
        PromptMgmt[Prompt Management]
    end

    subgraph "Data Services"
        PostgreSQL[(PostgreSQL)]
        MongoDB[(MongoDB)]
        Redis[(Redis)]
        S3[S3 Storage]
    end

    subgraph "Message Queue"
        RabbitMQ[RabbitMQ]
    end

    WebApp --> Gateway
    MobileApp --> Gateway

    Gateway --> Auth
    Auth --> ProductSvc
    Auth --> RevenueSvc
    Auth --> BudgetSvc
    Auth --> SupportSvc
    Auth --> WorkforceSvc
    Auth --> QuerySvc

    QuerySvc --> LLMGateway
    LLMGateway --> AgentPool
    AgentPool --> PromptMgmt

    ProductSvc --> PostgreSQL
    RevenueSvc --> PostgreSQL
    BudgetSvc --> MongoDB
    SupportSvc --> MongoDB
    WorkforceSvc --> PostgreSQL

    ProductSvc --> Redis
    RevenueSvc --> Redis

    QuerySvc --> RabbitMQ
    AgentPool --> RabbitMQ
```
