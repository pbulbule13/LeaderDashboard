from typing import Dict, Any, List
import os
from langchain_openai import ChatOpenAI
from app_config import config
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.outputs import ChatGeneration

class BaseAgent:
    """Base class for all dashboard tile agents"""

    def __init__(self, agent_name: str):
        self.agent_name = agent_name
        self.llm = self._initialize_llm()

    def _initialize_llm(self):
        """Initialize the LLM based on configuration"""
        # Enable lightweight mock for tests/offline environments
        if os.getenv("TEST_MODE") == "1" or os.getenv("MOCK_LLM") == "1":
            class _MockLLM:
                async def ainvoke(self, messages):
                    class _Resp:
                        content = (
                            f"Mock response to: {messages[-1]['content']}"
                            if messages else "Mock response"
                        )
                    return _Resp()
            return _MockLLM()

        model_name = config.MODEL_NAME
        model_lower = (model_name or "").lower()

        # Support DeepSeek via OpenAI-compatible API
        if "deepseek" in model_lower:
            api_key = os.getenv("DEEPSEEK_API_KEY", os.getenv("OPENAI_API_KEY"))
            api_base = os.getenv("DEEPSEEK_API_BASE", "https://api.deepseek.com/v1")
            return ChatOpenAI(
                model=model_name,
                temperature=0.1,
                openai_api_base=api_base,
                openai_api_key=api_key
            )

        # Default OpenAI
        return ChatOpenAI(
            model=model_name,
            temperature=0.1,
            api_key=config.OPENAI_API_KEY
        )
    
    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process a user query with context"""
        raise NotImplementedError("Subclasses must implement process_query")
    
    async def get_tile_data(self) -> Dict[str, Any]:
        """Get data for the dashboard tile"""
        raise NotImplementedError("Subclasses must implement get_tile_data")
    
    async def analyze_metric(self, metric_name: str) -> Dict[str, Any]:
        """Analyze a specific metric"""
        raise NotImplementedError("Subclasses must implement analyze_metric")
# EOL
