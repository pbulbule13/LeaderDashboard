"""
Tab-Specific Q&A Agent
Context-aware AI assistant for dashboard tabs with reasoning capabilities
"""

from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Dict, Any
import os


class TabQAAgent:
    """
    Context-aware Q&A agent for dashboard tabs.
    Provides intelligent answers based on tab-specific data and context.

    Supports multiple LLM providers:
    - OpenAI (GPT-4, GPT-3.5)
    - Google Gemini
    - DeepSeek
    """

    # Tab-specific context and capabilities
    TAB_CONTEXTS = {
        "overview": {
            "name": "Dashboard Overview",
            "description": "High-level executive summary of all business metrics, including emails, calendar, reminders, and key performance indicators",
            "data_types": ["orders", "compliance", "costs", "lab_metrics", "stock", "forecasting", "emails", "calendar", "reminders", "critical_alerts"],
            "capabilities": [
                "View emails, calendar events, and reminders from the dashboard widgets",
                "Compare multiple metrics across the business",
                "Identify trends and anomalies",
                "Provide executive summaries",
                "Highlight areas needing attention",
                "Access Quick Reminders to help manage tasks"
            ]
        },
        "email": {
            "name": "Communications",
            "description": "Email management, inbox triage, and communication tools. You have access to view email subjects, senders, previews, and metadata from the dashboard.",
            "data_types": ["emails", "inbox_status", "priorities", "drafts", "email_list", "unread_count"],
            "capabilities": [
                "View and analyze emails shown on the dashboard",
                "Summarize inbox and priorities based on visible emails",
                "Identify urgent emails that need attention",
                "Draft email responses",
                "Categorize emails by urgency and importance",
                "Provide communication workflow recommendations"
            ]
        },
        "personal": {
            "name": "Personal Assistant",
            "description": "Calendar, tasks, goals, and personal productivity. You can see calendar events, meeting schedules, tasks, reminders, and health metrics from the dashboard.",
            "data_types": ["calendar", "tasks", "goals", "health_metrics", "meetings", "schedule", "reminders"],
            "capabilities": [
                "View and analyze calendar events shown on dashboard",
                "See today's meetings and schedule",
                "Track tasks, reminders, and goals",
                "Provide productivity insights based on visible data",
                "Monitor work-life balance",
                "Help with time management and prioritization"
            ]
        },
        "orders": {
            "name": "Order Volume",
            "description": "Order tracking, growth analysis, and volume metrics",
            "data_types": ["monthly_orders", "growth_rate", "order_trends", "regional_breakdown"],
            "capabilities": [
                "Analyze order trends and patterns",
                "Compare period-over-period growth",
                "Identify high-performing regions",
                "Forecast future order volume"
            ]
        },
        "compliance": {
            "name": "Compliance & Quality",
            "description": "Quality metrics, compliance rates, and return analysis",
            "data_types": ["return_rates", "quality_metrics", "compliance_scores"],
            "capabilities": [
                "Track quality and compliance metrics",
                "Analyze return patterns",
                "Identify quality issues",
                "Monitor regulatory compliance"
            ]
        },
        "reimbursement": {
            "name": "Reimbursement",
            "description": "Claims processing, reimbursement rates, and rejections",
            "data_types": ["reimbursement_rate", "claims_status", "rejection_analysis"],
            "capabilities": [
                "Track reimbursement performance",
                "Analyze claim rejections",
                "Monitor payment timelines",
                "Identify reimbursement issues"
            ]
        },
        "costs": {
            "name": "Operating Costs",
            "description": "AWS costs, salaries, lab expenses, and cost breakdown",
            "data_types": ["aws_costs", "salary_costs", "lab_costs", "cost_trends"],
            "capabilities": [
                "Analyze cost breakdown by category",
                "Track cost trends over time",
                "Identify cost optimization opportunities",
                "Compare actual vs. budgeted costs"
            ]
        },
        "lab": {
            "name": "Lab Metrics",
            "description": "Turnaround time, capacity, quality, and lab performance",
            "data_types": ["tat_metrics", "capacity_utilization", "quality_scores", "efficiency"],
            "capabilities": [
                "Monitor lab performance metrics",
                "Track turnaround times",
                "Analyze capacity utilization",
                "Identify bottlenecks and inefficiencies"
            ]
        },
        "regional": {
            "name": "Regional Performance",
            "description": "Territory-wise analysis and regional metrics",
            "data_types": ["regional_sales", "territory_performance", "geographic_trends"],
            "capabilities": [
                "Compare regional performance",
                "Identify top-performing territories",
                "Analyze geographic trends",
                "Provide regional insights"
            ]
        },
        "forecasting": {
            "name": "Forecasting",
            "description": "AI-powered predictions and future projections",
            "data_types": ["order_forecasts", "revenue_projections", "growth_predictions"],
            "capabilities": [
                "Provide future projections",
                "Analyze forecast accuracy",
                "Identify growth opportunities",
                "Predict business trends"
            ]
        },
        "market": {
            "name": "Market Intelligence",
            "description": "News, competitor tracking, and market trends",
            "data_types": ["market_news", "competitor_analysis", "industry_trends"],
            "capabilities": [
                "Summarize market news",
                "Analyze competitive landscape",
                "Track industry trends",
                "Provide strategic insights"
            ]
        },
        "milestones": {
            "name": "Project Milestones",
            "description": "FDA submissions, project status, and milestone tracking",
            "data_types": ["fda_submissions", "project_status", "milestone_progress"],
            "capabilities": [
                "Track project milestones",
                "Monitor FDA submission status",
                "Analyze project timelines",
                "Identify project risks"
            ]
        }
    }

    def __init__(self, model_name: str = None):
        """
        Initialize the Tab Q&A Agent with configurable LLM provider.

        Args:
            model_name: Optional model name. If not provided, reads from environment.

        Environment Variables:
            TAB_QA_MODEL: Model to use (default: gpt-4)
            TAB_QA_PROVIDER: Provider - openai, gemini, or deepseek (auto-detected from model name)
            OPENAI_API_KEY: Required for OpenAI/DeepSeek
            GOOGLE_API_KEY: Required for Gemini
            DEEPSEEK_API_KEY: Optional, falls back to OPENAI_API_KEY
            DEEPSEEK_API_BASE: Optional, default: https://api.deepseek.com/v1
        """
        if model_name is None:
            model_name = os.getenv("TAB_QA_MODEL", "gpt-4")

        self.model_name = model_name
        self.llm = self._create_llm_client(model_name)

        # Define the prompt template
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an intelligent executive assistant for HealthCare Sciences CEO with FULL ACCESS to the {tab_name} dashboard data.

**IMPORTANT - YOU HAVE DIRECT DATA ACCESS:**
You can see and analyze ALL the data shown on the current dashboard tab. The "Current Data" section below contains the ACTUAL, REAL-TIME data from the dashboard that you can analyze and reference.

**Your Context:**
{tab_description}

**Available Data Types:**
{data_types}

**Your Capabilities:**
{capabilities}

**Current Data You Can See and Analyze:**
{current_data}

**Your Personality:**
- Professional yet conversational
- Data-driven and analytical - USE THE ACTUAL NUMBERS from the data above
- Proactive in identifying insights
- Clear and concise in communication
- Always provide reasoning behind your answers

**Response Guidelines:**
1. YOU HAVE ACCESS to the data shown above - analyze it directly
2. Reference SPECIFIC numbers, percentages, and metrics from the Current Data
3. For emails, calendar, orders, compliance, etc. - the data is RIGHT THERE in Current Data
4. Provide insights based on the ACTUAL data you can see
5. Never say "I don't have access" - you DO have access to everything shown above
6. If specific data is truly not provided in Current Data section, then acknowledge that limitation
7. Be confident - you're looking at the same dashboard data the CEO sees

Remember: You're helping a CEO make informed decisions based on REAL data you can see. Be insightful, accurate, and helpful."""),
            ("human", "{question}")
        ])

    def _create_llm_client(self, model_name: str):
        """
        Create appropriate LLM client based on model name.

        Supports:
        - OpenAI models (gpt-*, o1-*)
        - Euron models (euron-*, euri-*, gpt-4.1-*)
        - DeepSeek models (deepseek-*)
        - Google Gemini models (gemini-*)
        """
        model_lower = model_name.lower()

        try:
            # Google Gemini models
            if "gemini" in model_lower:
                api_key = os.getenv("GOOGLE_API_KEY")
                if not api_key:
                    raise ValueError("GOOGLE_API_KEY environment variable is required for Gemini models")

                return ChatGoogleGenerativeAI(
                    model=model_name,
                    temperature=0.7,
                    max_tokens=2000,
                    google_api_key=api_key
                )

            # Euron models
            elif "euron" in model_lower or "euri" in model_lower or "gpt-4.1" in model_lower:
                api_key = os.getenv("EURON_API_KEY", os.getenv("OPENAI_API_KEY"))
                api_base = os.getenv("EURON_API_BASE", "https://api.euron.one/api/v1/euri")

                if not api_key:
                    raise ValueError("EURON_API_KEY or OPENAI_API_KEY environment variable is required for Euron")

                return ChatOpenAI(
                    model=model_name,
                    temperature=0.7,
                    max_tokens=2000,
                    openai_api_base=api_base,
                    openai_api_key=api_key
                )

            # DeepSeek models
            elif "deepseek" in model_lower:
                api_key = os.getenv("DEEPSEEK_API_KEY", os.getenv("OPENAI_API_KEY"))
                api_base = os.getenv("DEEPSEEK_API_BASE", "https://api.deepseek.com/v1")

                if not api_key:
                    raise ValueError("DEEPSEEK_API_KEY or OPENAI_API_KEY environment variable is required for DeepSeek")

                return ChatOpenAI(
                    model=model_name,
                    temperature=0.7,
                    max_tokens=2000,
                    openai_api_base=api_base,
                    openai_api_key=api_key
                )

            # OpenAI models (default)
            else:
                api_key = os.getenv("OPENAI_API_KEY")
                if not api_key:
                    raise ValueError("OPENAI_API_KEY environment variable is required for OpenAI models")

                return ChatOpenAI(
                    model=model_name,
                    temperature=0.7,
                    max_tokens=2000
                )

        except Exception as e:
            print(f"[ERROR] Failed to create LLM client for {model_name}: {e}")
            raise

    async def ask(self, question: str, tab: str, tab_data: Dict[str, Any] = None, voice_mode: bool = False) -> Dict[str, Any]:
        """
        Answer a question about a specific dashboard tab with context and reasoning.

        Args:
            question: The user's question
            tab: The dashboard tab identifier (e.g., 'orders', 'compliance')
            tab_data: Current data from the tab
            voice_mode: If True, provide concise 1-2 line responses without special characters

        Returns:
            Dict with response, reasoning, and metadata
        """
        # Get tab context
        tab_context = self.TAB_CONTEXTS.get(tab, {
            "name": "Dashboard",
            "description": "Business metrics and insights",
            "data_types": ["general_metrics"],
            "capabilities": ["Provide general business insights"]
        })

        # Format current data
        current_data_str = self._format_data(tab_data) if tab_data else "No specific data provided"

        # Prepare prompt
        prompt_value = self.prompt.format_messages(
            tab_name=tab_context["name"],
            tab_description=tab_context["description"],
            data_types="\n".join(f"- {dt}" for dt in tab_context["data_types"]),
            capabilities="\n".join(f"- {cap}" for cap in tab_context["capabilities"]),
            current_data=current_data_str,
            question=question
        )

        try:
            # Get response from Claude
            response = await self.llm.ainvoke(prompt_value)
            answer = response.content

            # Format for voice mode if requested
            if voice_mode:
                # Remove special characters and markdown formatting
                answer = answer.replace('*', '').replace('#', '').replace('`', '')
                answer = answer.replace('-', '').replace('•', '').replace('→', '')
                # Keep only first 1-2 sentences
                sentences = answer.split('.')
                if len(sentences) > 2:
                    answer = '. '.join(sentences[:2]) + '.'
                # Clean up any extra whitespace
                answer = ' '.join(answer.split())

            return {
                "success": True,
                "answer": answer,
                "tab": tab,
                "tab_name": tab_context["name"],
                "question": question,
                "has_reasoning": True,
                "model": self.model_name,
                "voice_mode": voice_mode
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "answer": f"I apologize, but I encountered an error processing your question: {str(e)}",
                "tab": tab,
                "question": question
            }

    def _format_data(self, data: Dict[str, Any], indent: int = 0) -> str:
        """Format data dictionary into readable string"""
        if not data:
            return "No data available"

        lines = []
        prefix = "  " * indent

        for key, value in data.items():
            if isinstance(value, dict):
                lines.append(f"{prefix}{key}:")
                lines.append(self._format_data(value, indent + 1))
            elif isinstance(value, list):
                lines.append(f"{prefix}{key}: {len(value)} items")
                if len(value) > 0 and isinstance(value[0], dict):
                    # Show first item as example
                    lines.append(f"{prefix}  Example: {value[0]}")
            else:
                lines.append(f"{prefix}{key}: {value}")

        return "\n".join(lines)

    def get_tab_info(self, tab: str) -> Dict[str, Any]:
        """Get information about a specific tab"""
        return self.TAB_CONTEXTS.get(tab, {
            "name": "Unknown Tab",
            "description": "No information available",
            "data_types": [],
            "capabilities": []
        })

    def list_tabs(self) -> Dict[str, Dict[str, Any]]:
        """List all available tabs and their capabilities"""
        return self.TAB_CONTEXTS
