from typing import Dict, Any
from agents.base_agent import BaseAgent
from config.prompts_config import get_prompt

class AssistantAgent(BaseAgent):
    '''AI Executive Assistant Agent for general queries and task management'''

    def __init__(self):
        super().__init__('AssistantAgent')

    async def get_tile_data(self) -> Dict[str, Any]:
        '''Get assistant tile data (summary of available capabilities)'''
        return {
            'capabilities': [
                'Email management and drafting',
                'Calendar optimization',
                'Priority identification',
                'Quick insights across all metrics',
                'Task management support'
            ],
            'status': 'ready',
            'timestamp': '2025-10-25T12:00:00Z'
        }

    async def process_query(self, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        '''Process general queries using the assistant prompt'''

        prompt = get_prompt(
            agent_type='assistant',
            prompt_type='general',
            query=query,
            context=str(context)
        )

        messages = [
            {'role': 'system', 'content': prompt},
            {'role': 'user', 'content': query}
        ]

        response = await self.llm.ainvoke(messages)

        return {
            'agent': self.agent_name,
            'response': response.content,
            'context': context
        }

    async def draft_email(self, context: Dict[str, Any], recipients: str, purpose: str) -> str:
        '''Draft an email based on context'''
        prompt = get_prompt(
            agent_type='assistant',
            prompt_type='draft_email',
            context=str(context),
            recipients=recipients,
            purpose=purpose,
            draft_style='business_formal',
            signature_included='true'
        )

        messages = [
            {'role': 'system', 'content': prompt}
        ]

        response = await self.llm.ainvoke(messages)
        return response.content

    async def summarize_emails(self, emails: list) -> Dict[str, Any]:
        '''Summarize emails for executive review'''
        prompt = get_prompt(
            agent_type='assistant',
            prompt_type='email_summary',
            emails=str(emails)
        )

        messages = [
            {'role': 'system', 'content': prompt}
        ]

        response = await self.llm.ainvoke(messages)

        return {
            'agent': self.agent_name,
            'summary': response.content
        }

    async def analyze_priorities(self, items: list) -> Dict[str, Any]:
        '''Analyze and rank action items by priority'''
        prompt = get_prompt(
            agent_type='assistant',
            prompt_type='priority_analysis',
            items=str(items)
        )

        messages = [
            {'role': 'system', 'content': prompt}
        ]

        response = await self.llm.ainvoke(messages)

        return {
            'agent': self.agent_name,
            'priorities': response.content
        }
