"""Configuration package for centralized settings."""

from .prompts_config import (
    COMPANY_CONTEXT,
    AGENT_BEHAVIORS,
    get_prompt,
    get_agent_behavior,
    get_tone_instruction
)

__all__ = [
    'COMPANY_CONTEXT',
    'AGENT_BEHAVIORS',
    'get_prompt',
    'get_agent_behavior',
    'get_tone_instruction'
]
