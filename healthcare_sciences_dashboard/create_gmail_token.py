"""
Create Gmail token pickle from refresh token in .env
"""
import pickle
import os
from pathlib import Path
from google.oauth2.credentials import Credentials
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get credentials from .env
client_id = os.getenv("GMAIL_CLIENT_ID")
client_secret = os.getenv("GMAIL_CLIENT_SECRET")
refresh_token = os.getenv("GMAIL_REFRESH_TOKEN")

if not all([client_id, client_secret, refresh_token]):
    print("ERROR: Missing Gmail credentials in .env file")
    print(f"GMAIL_CLIENT_ID: {'OK' if client_id else 'MISSING'}")
    print(f"GMAIL_CLIENT_SECRET: {'OK' if client_secret else 'MISSING'}")
    print(f"GMAIL_REFRESH_TOKEN: {'OK' if refresh_token else 'MISSING'}")
    exit(1)

# Gmail API scopes
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose'
]

# Create Credentials object with refresh token
credentials = Credentials(
    token=None,  # Access token will be generated from refresh token
    refresh_token=refresh_token,
    token_uri="https://oauth2.googleapis.com/token",
    client_id=client_id,
    client_secret=client_secret,
    scopes=SCOPES
)

# Save to pickle file
token_path = Path("./config/gmail_token.pickle")
token_path.parent.mkdir(parents=True, exist_ok=True)

with open(token_path, 'wb') as token_file:
    pickle.dump(credentials, token_file)

print(f"SUCCESS: Created Gmail token at: {token_path}")
print(f"Token contains:")
print(f"   - Client ID: {client_id[:20]}...")
print(f"   - Refresh Token: {refresh_token[:20]}...")
print(f"   - Scopes: {len(SCOPES)} scopes configured")
print("\nThe application will use this token to access Gmail API.")
