import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # LLM Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4-turbo-preview")
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    # APIs
    HEALTHCARE_SCIENCES_API_URL = os.getenv("HEALTHCARE_SCIENCES_API_URL")
    HEALTHCARE_SCIENCES_API_KEY = os.getenv("HEALTHCARE_SCIENCES_API_KEY")
    ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
    
    # Application
    DEBUG = os.getenv("DEBUG", "False") == "True"
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    PORT = int(os.getenv("PORT", 8000))

config = Config()