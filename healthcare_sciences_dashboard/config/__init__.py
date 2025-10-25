"""Configuration package for centralized settings."""

from .prompts_config import (
    COMPANY_CONTEXT,
    AGENT_BEHAVIORS,
    get_prompt,
    get_agent_behavior,
    get_tone_instruction
)

# Import app config from parent level
import sys
import os
parent_dir = os.path.dirname(os.path.dirname(__file__))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
from app_config import config

__all__ = [
    'COMPANY_CONTEXT',
    'AGENT_BEHAVIORS',
    'get_prompt',
    'get_agent_behavior',
    'get_tone_instruction',
    'config'
]
