"""
Test Gmail API connection using environment variables
"""
from voice_agent.adapters.email.gmail_oauth_env import GmailOAuthEnvHandler
import traceback

print("Testing Gmail OAuth Handler (from environment variables)...")
print("-" * 60)

try:
    handler = GmailOAuthEnvHandler()
    print("1. OAuth handler created")

    service = handler.get_gmail_service()
    print("2. Gmail service created successfully!")

    # Try to fetch user profile
    profile = service.users().getProfile(userId='me').execute()
    print(f"3. Connected to: {profile.get('emailAddress')}")
    print(f"   Total messages: {profile.get('messagesTotal')}")
    print(f"   Total threads: {profile.get('threadsTotal')}")

    print("\nSUCCESS: Gmail API is working!")

except Exception as e:
    print(f"\nERROR: {type(e).__name__}: {e}")
    print("\nFull traceback:")
    traceback.print_exc()
