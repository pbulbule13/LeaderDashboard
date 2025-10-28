"""Test Gmail connection"""
import asyncio
from voice_agent.adapters.email.gmail_adapter import GmailAdapter

async def test_gmail():
    print("Testing Gmail connection...")
    adapter = GmailAdapter()

    try:
        # Try to fetch email threads
        threads = await adapter.fetch_threads(max_results=5)

        if threads:
            print(f"\n[SUCCESS] Connected to your Gmail!")
            print(f"Found {len(threads)} email threads:\n")

            for i, thread in enumerate(threads[:5], 1):
                print(f"{i}. From: {thread['from']}")
                print(f"   Subject: {thread['subject']}")
                print(f"   Preview: {thread['preview'][:80]}...")
                print()
        else:
            print("\n[INFO] No email threads found (inbox might be empty)")

    except Exception as e:
        print(f"\n[ERROR] Failed to connect: {e}")
        print("Currently running in mock mode")

if __name__ == "__main__":
    asyncio.run(test_gmail())
