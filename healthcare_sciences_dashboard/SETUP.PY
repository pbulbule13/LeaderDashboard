from setuptools import setup, find_packages

setup(
    name='healthcare_sciences_dashboard',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'langgraph>=0.2.16',
        'langchain>=0.2.14',
        'langchain-openai>=0.1.23',
        'langchain-anthropic>=0.1.23',
        'fastapi>=0.115.0',
        'uvicorn>=0.30.6',
        'pydantic>=2.9.0',
        'python-dotenv>=1.0.1',
        'pytest>=8.4.2',
        'pytest-asyncio>=1.2.0',
        'httpx>=0.27.0',
    ],
)
