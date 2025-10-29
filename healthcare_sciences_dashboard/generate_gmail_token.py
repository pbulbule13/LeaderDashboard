"""
Generate Gmail Refresh Token with Correct Scope

This script helps you generate a new refresh token for Gmail API access.
Run this script and follow the instructions to authorize your Google account.
"""

import os
from google_auth_oauthlib.flow import InstalledAppFlow
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Full Gmail access scope
SCOPES = ['https://mail.google.com/']

def generate_refresh_token():
    """Generate a new refresh token through OAuth flow"""

    print("=" * 60)
    print("Gmail OAuth Token Generator")
    print("=" * 60)
    print()

    # Get credentials from environment
    client_id = os.getenv("GMAIL_CLIENT_ID")
    client_secret = os.getenv("GMAIL_CLIENT_SECRET")

    if not client_id or not client_secret:
        print("ERROR: Missing GMAIL_CLIENT_ID or GMAIL_CLIENT_SECRET in .env file")
        print("Please ensure your .env file has these values.")
        return

    print(f"Using Client ID: {client_id[:20]}...")
    print(f"Scope: {SCOPES[0]}")
    print()

    # Create client config
    client_config = {
        "installed": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob"]
        }
    }

    try:
        print("Starting Manual OAuth Flow (No redirect URI needed)...")
        print()

        # Create OAuth flow
        flow = InstalledAppFlow.from_client_config(
            client_config,
            scopes=SCOPES
        )

        # Generate authorization URL
        auth_url, _ = flow.authorization_url(prompt='consent')

        print("=" * 60)
        print("STEP 1: Visit this URL in your browser")
        print("=" * 60)
        print()
        print(auth_url)
        print()
        print("=" * 60)
        print("STEP 2: After authorizing, Google will show you a code")
        print("=" * 60)
        print()

        # Ask user to paste the authorization code
        auth_code = input("Paste the authorization code here: ").strip()

        print()
        print("Exchanging code for tokens...")

        # Exchange authorization code for credentials
        flow.fetch_token(code=auth_code)
        creds = flow.credentials

        print()
        print("Authorization successful!")
        print()

        print()
        print("=" * 60)
        print("SUCCESS! Here is your new refresh token:")
        print("=" * 60)
        print()
        print(creds.refresh_token)
        print()
        print("=" * 60)
        print("Update your .env file with this value:")
        print("=" * 60)
        print(f"GMAIL_REFRESH_TOKEN={creds.refresh_token}")
        print()
        print("Copy the line above and replace the current GMAIL_REFRESH_TOKEN in your .env file")
        print()

    except Exception as e:
        print(f"ERROR: {e}")
        print()
        print("Troubleshooting:")
        print("1. Make sure you have the correct Client ID and Client Secret")
        print("2. Check that http://localhost:8080 is in your Google Cloud Console redirect URIs")
        print("3. Make sure the OAuth consent screen is configured in Google Cloud Console")

if __name__ == "__main__":
    generate_refresh_token()
