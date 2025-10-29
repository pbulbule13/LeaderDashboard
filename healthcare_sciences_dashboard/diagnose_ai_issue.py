"""
Quick diagnostic script to identify AI Assistant issues
"""
import os
import sys
import asyncio
from dotenv import load_dotenv

print("=" * 70)
print("AI ASSISTANT DIAGNOSTIC")
print("=" * 70)

# Load environment
load_dotenv()

# Check 1: Environment Variables
print("\n1️⃣ Checking Environment Variables...")
print("-" * 70)

google_key = os.getenv("GOOGLE_API_KEY")
deepseek_key = os.getenv("DEEPSEEK_API_KEY")
model_name = os.getenv("MODEL_NAME", "gpt-4")
tab_qa_model = os.getenv("TAB_QA_MODEL", model_name)

if google_key:
    print(f"✓ GOOGLE_API_KEY: {google_key[:20]}...")
else:
    print("✗ GOOGLE_API_KEY: Not found")

if deepseek_key:
    print(f"✓ DEEPSEEK_API_KEY: {deepseek_key[:20]}...")
else:
    print("✗ DEEPSEEK_API_KEY: Not found")

print(f"✓ MODEL_NAME: {model_name}")
print(f"✓ TAB_QA_MODEL: {tab_qa_model}")

# Check 2: Import Tab Q&A Agent
print("\n2️⃣ Testing Tab Q&A Agent Import...")
print("-" * 70)

try:
    from agents.tab_qa_agent import TabQAAgent
    print("✓ TabQAAgent imported successfully")
except Exception as e:
    print(f"✗ Failed to import TabQAAgent: {e}")
    sys.exit(1)

# Check 3: Initialize Agent
print("\n3️⃣ Initializing Tab Q&A Agent...")
print("-" * 70)

try:
    agent = TabQAAgent(model_name=tab_qa_model)
    print(f"✓ Agent initialized with model: {agent.model_name}")
except Exception as e:
    print(f"✗ Failed to initialize agent: {e}")
    print("\nPossible causes:")
    print("  - Invalid or missing API key")
    print("  - Model name not recognized")
    print("  - Network connection issue")
    sys.exit(1)

# Check 4: Test Simple Query
print("\n4️⃣ Testing Simple Query...")
print("-" * 70)

async def test_query():
    try:
        test_data = {
            "monthly_orders": 24500,
            "growth_rate": 15.2
        }

        response = await agent.ask(
            question="What is the growth rate?",
            tab="orders",
            tab_data=test_data
        )

        if response.get("success"):
            print("✓ Query successful!")
            print(f"  Model used: {response.get('model')}")
            print(f"  Answer preview: {response.get('answer', '')[:100]}...")
            return True
        else:
            print(f"✗ Query failed: {response.get('error')}")
            return False

    except Exception as e:
        print(f"✗ Query failed with exception: {e}")
        import traceback
        traceback.print_exc()
        return False

# Run async test
try:
    success = asyncio.run(test_query())
except Exception as e:
    print(f"✗ Async test failed: {e}")
    success = False

# Check 5: Test API Endpoint
print("\n5️⃣ Testing API Endpoint...")
print("-" * 70)

try:
    import requests

    url = "http://localhost:8000/api/query/ask-tab"
    payload = {
        "question": "test question",
        "tab": "overview",
        "tab_data": {"test": "data"}
    }

    print("Sending request to:", url)
    response = requests.post(url, json=payload, timeout=10)

    if response.status_code == 200:
        result = response.json()
        if result.get("success"):
            print("✓ API endpoint working!")
            print(f"  Response preview: {str(result.get('answer', ''))[:100]}...")
        else:
            print(f"✗ API returned error: {result.get('error')}")
    else:
        print(f"✗ API returned status code: {response.status_code}")
        print(f"  Response: {response.text[:200]}")

except requests.exceptions.ConnectionError:
    print("✗ Cannot connect to API server")
    print("  → Make sure server is running: python run_server.py")
except Exception as e:
    print(f"✗ API test failed: {e}")

# Summary
print("\n" + "=" * 70)
if success:
    print("✅ DIAGNOSIS: Tab Q&A Agent is working correctly!")
    print("\nIf you're still seeing 'undefined' in the dashboard:")
    print("  1. Clear browser cache (Ctrl+Shift+Delete)")
    print("  2. Hard refresh (Ctrl+F5)")
    print("  3. Check browser console for JavaScript errors (F12)")
    print("  4. Make sure you're on the latest dashboard.js")
else:
    print("❌ DIAGNOSIS: There's an issue with the Tab Q&A Agent")
    print("\nReview the errors above and:")
    print("  1. Check your API key is valid")
    print("  2. Verify model name is correct")
    print("  3. Test API connection manually")
    print("  4. Check server logs for errors")

print("=" * 70)
