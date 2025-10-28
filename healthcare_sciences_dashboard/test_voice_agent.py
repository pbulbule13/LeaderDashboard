#!/usr/bin/env python
"""
Test Voice Agent System
Quick test script to verify the voice agent is working
"""

import asyncio
import httpx
import json


async def test_voice_agent_api():
    """Test the voice agent API endpoints"""

    base_url = "http://localhost:8000"

    print("="*70)
    print("TESTING VOICE AGENT SYSTEM")
    print("="*70)
    print()

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Test 1: Health Check
        print("1️⃣  Testing API Health...")
        try:
            response = await client.get(f"{base_url}/health")
            print(f"   ✅ API Status: {response.json()['status']}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
            return
        print()

        # Test 2: Root Endpoint
        print("2️⃣  Checking Available Endpoints...")
        try:
            response = await client.get(f"{base_url}/")
            data = response.json()
            print(f"   ✅ API Version: {data['version']}")
            print(f"   ✅ Voice Agent Endpoint: {data['endpoints'].get('voice_agent', 'Not available')}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
        print()

        # Test 3: Voice Agent Query - Inbox Summary
        print("3️⃣  Testing Voice Agent: 'What's in my inbox?'")
        try:
            response = await client.post(
                f"{base_url}/voice-agent/query",
                json={
                    "query": "What's in my inbox?",
                    "mode": "text",
                    "user_id": "test_ceo"
                }
            )
            data = response.json()
            print(f"   ✅ Intent: {data.get('intent', 'unknown')}")
            print(f"   ✅ Response: {data.get('text', 'No response')[:150]}...")
            print(f"   ✅ Drafts created: {len(data.get('drafts', []))}")
            print(f"   ✅ Action logs: {len(data.get('logs', []))}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
        print()

        # Test 4: Voice Agent Query - Draft Reply
        print("4️⃣  Testing Voice Agent: 'Draft a reply to John's email'")
        try:
            response = await client.post(
                f"{base_url}/voice-agent/query",
                json={
                    "query": "Draft a warm reply to John saying I'm available Thursday at 2pm",
                    "mode": "text",
                    "user_id": "test_ceo"
                }
            )
            data = response.json()
            print(f"   ✅ Intent: {data.get('intent', 'unknown')}")
            print(f"   ✅ Response: {data.get('text', 'No response')[:150]}...")
            if data.get('drafts'):
                draft = data['drafts'][0]
                print(f"   ✅ Draft Subject: {draft.get('subject', 'N/A')}")
                print(f"   ✅ Draft To: {draft.get('to', [])}")
                print(f"   ✅ Requires Auth: {draft.get('requires_authorization', False)}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
        print()

        # Test 5: Inbox Summary Endpoint
        print("5️⃣  Testing Inbox Summary Endpoint...")
        try:
            response = await client.get(f"{base_url}/voice-agent/inbox/summary")
            data = response.json()
            print(f"   ✅ Summary received: {len(data.get('text', ''))} characters")
        except Exception as e:
            print(f"   ❌ Error: {e}")
        print()

        # Test 6: Calendar Check
        print("6️⃣  Testing Calendar Check...")
        try:
            response = await client.get(
                f"{base_url}/voice-agent/calendar/check",
                params={"timeframe": "today"}
            )
            data = response.json()
            print(f"   ✅ Calendar response received")
            print(f"   ✅ Response: {data.get('text', 'No response')[:100]}...")
        except Exception as e:
            print(f"   ❌ Error: {e}")
        print()

        # Test 7: Configuration Check
        print("7️⃣  Checking Voice Agent Configuration...")
        try:
            response = await client.get(f"{base_url}/voice-agent/config")
            data = response.json()
            print(f"   ✅ Agent Name: {data.get('agent_name', 'Unknown')}")
            print(f"   ✅ Email Provider: {data.get('email_provider', 'Unknown')}")
            print(f"   ✅ Calendar Provider: {data.get('calendar_provider', 'Unknown')}")
            print(f"   ✅ TTS Provider: {data.get('tts_provider', 'Unknown')}")
        except Exception as e:
            print(f"   ❌ Error: {e}")
        print()

    print("="*70)
    print("✅ VOICE AGENT TESTING COMPLETE!")
    print("="*70)
    print()
    print("Next steps:")
    print("  • Open http://localhost:8000/docs to see interactive API docs")
    print("  • Integrate endpoints into the Communications tab UI")
    print("  • Set up Gmail/Calendar OAuth credentials for real email/calendar access")
    print()


if __name__ == "__main__":
    print()
    print("Make sure the API server is running on http://localhost:8000")
    print("If not, run: python run_server.py")
    print()
    input("Press Enter to start testing...")
    print()

    asyncio.run(test_voice_agent_api())
