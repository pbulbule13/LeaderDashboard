"""
Quick test to verify Anthropic API key is working
"""
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

api_key = os.getenv("ANTHROPIC_API_KEY")

print("=" * 60)
print("ANTHROPIC API KEY TEST")
print("=" * 60)

# Check if key exists
if not api_key:
    print("❌ ERROR: ANTHROPIC_API_KEY not found in environment")
    print("\nPlease add it to your .env file:")
    print("ANTHROPIC_API_KEY=sk-ant-api03-your-key-here")
    exit(1)

# Check if it's still the placeholder
if api_key == "your_anthropic_api_key_here":
    print("❌ ERROR: ANTHROPIC_API_KEY is still set to placeholder value")
    print("\nPlease update your .env file with your actual API key:")
    print("1. Go to https://console.anthropic.com/")
    print("2. Create an API key")
    print("3. Replace 'your_anthropic_api_key_here' with your actual key")
    exit(1)

# Show partial key (for verification)
masked_key = api_key[:15] + "..." + api_key[-4:] if len(api_key) > 20 else "***"
print(f"✓ API Key found: {masked_key}")

# Test the API key
print("\nTesting API connection...")
try:
    from langchain_anthropic import ChatAnthropic

    llm = ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        temperature=0.7,
        max_tokens=100
    )

    response = llm.invoke("Say 'API key is working!' in one sentence.")

    print("✓ SUCCESS! Anthropic API is working")
    print(f"\nTest response: {response.content}")
    print("\n" + "=" * 60)
    print("Your Anthropic API key is correctly configured!")
    print("=" * 60)

except Exception as e:
    print(f"❌ ERROR: API test failed")
    print(f"\nError message: {str(e)}")
    print("\nPossible issues:")
    print("1. Invalid API key")
    print("2. Insufficient credits")
    print("3. Network connection issue")
    print("\nPlease verify your API key at https://console.anthropic.com/")
    exit(1)
