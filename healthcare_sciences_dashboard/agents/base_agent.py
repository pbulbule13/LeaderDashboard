from typing import Dict, Any, List
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
        return ChatOpenAI(
            model=config.MODEL_NAME,
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