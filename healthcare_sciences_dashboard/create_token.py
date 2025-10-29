"""
Create Gmail token from existing credentials
"""
import pickle
from google.oauth2.credentials import Credentials
from pathlib import Path

# Your credentials
CLIENT_ID = "1041232517013-dieofgsdddvuepht3220h8oqujplrebh.apps.googleusercontent.com"
CLIENT_SECRET = "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"
REFRESH_TOKEN = "1//047y0uZ0NJA7MCgYIARAAGAQSNwF-L9IrNLWSL-fUG7omlREXbLP48Ocb4YU4jDt2F6qeTTYUJXGAMKqg0PTxtmFleCqcH1wwFqs"

# Create credentials object
creds = Credentials(
    token=None,
    refresh_token=REFRESH_TOKEN,
    token_uri="https://oauth2.googleapis.com/token",
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    scopes=[
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose'
    ]
)

# Save to pickle file
token_path = Path("config/gmail_token.pickle")
with open(token_path, 'wb') as token_file:
    pickle.dump(creds, token_file)

print(f"Token file created at: {token_path}")
print("You can now use Gmail with the voice agent!")
