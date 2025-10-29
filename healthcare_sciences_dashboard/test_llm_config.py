"""
Test LLM Configuration
Verifies that your chosen LLM provider is working correctly
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 70)
print("LLM CONFIGURATION TEST")
print("=" * 70)

# Check which API keys are configured
print("\n📋 API Keys Status:")
print("-" * 70)

openai_key = os.getenv("OPENAI_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")
deepseek_key = os.getenv("DEEPSEEK_API_KEY")

providers_found = []

if openai_key:
    masked = openai_key[:10] + "..." + openai_key[-4:] if len(openai_key) > 15 else "***"
    print(f"✓ OpenAI API Key: {masked}")
    providers_found.append("OpenAI")
else:
    print("✗ OpenAI API Key: Not configured")

if google_key:
    masked = google_key[:10] + "..." + google_key[-4:] if len(google_key) > 15 else "***"
    print(f"✓ Google API Key: {masked}")
    providers_found.append("Google Gemini")
else:
    print("✗ Google API Key: Not configured")

if deepseek_key:
    masked = deepseek_key[:10] + "..." + deepseek_key[-4:] if len(deepseek_key) > 15 else "***"
    print(f"✓ DeepSeek API Key: {masked}")
    providers_found.append("DeepSeek")
else:
    print("✗ DeepSeek API Key: Not configured")

if not providers_found:
    print("\n❌ ERROR: No API keys configured!")
    print("\nPlease add at least one API key to your .env file:")
    print("  - OPENAI_API_KEY for OpenAI (GPT-4, GPT-3.5, etc.)")
    print("  - GOOGLE_API_KEY for Google Gemini")
    print("  - DEEPSEEK_API_KEY for DeepSeek")
    print("\nSee LLM_CONFIGURATION_GUIDE.md for instructions")
    sys.exit(1)

print(f"\n✓ Found {len(providers_found)} provider(s): {', '.join(providers_found)}")

# Check configured models
print("\n📊 Configured Models:")
print("-" * 70)

model_name = os.getenv("MODEL_NAME", "gpt-4")
tab_qa_model = os.getenv("TAB_QA_MODEL", model_name)
response_model = os.getenv("RESPONSE_MODEL", model_name)
fallback_models = os.getenv("FALLBACK_MODELS", "gpt-4o-mini,gpt-3.5-turbo")

print(f"Voice Agent Reasoning: {model_name}")
print(f"Tab Q&A Agent: {tab_qa_model}")
print(f"Response Generation: {response_model}")
print(f"Fallback Models: {fallback_models}")

# Determine which provider will be used
def detect_provider(model_name):
    model_lower = model_name.lower()
    if "gemini" in model_lower:
        return "Google Gemini", google_key
    elif "deepseek" in model_lower:
        return "DeepSeek", deepseek_key or openai_key
    else:
        return "OpenAI", openai_key

provider_name, provider_key = detect_provider(model_name)
tab_qa_provider, tab_qa_key = detect_provider(tab_qa_model)
response_provider, response_key = detect_provider(response_model)

print(f"\n🎯 Active Providers:")
print("-" * 70)
print(f"Voice Agent: {provider_name}")
print(f"Tab Q&A: {tab_qa_provider}")
print(f"Response Gen: {response_provider}")

# Test the models
print("\n🧪 Testing LLM Connections:")
print("-" * 70)

def test_model(model_name, model_display_name):
    """Test if a model works"""
    provider, api_key = detect_provider(model_name)

    if not api_key:
        print(f"✗ {model_display_name}: No API key for {provider}")
        return False

    try:
        model_lower = model_name.lower()

        # Import based on provider
        if "gemini" in model_lower:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                model=model_name,
                temperature=0.7,
                max_tokens=50,
                google_api_key=api_key
            )
        elif "deepseek" in model_lower:
            from langchain_openai import ChatOpenAI
            api_base = os.getenv("DEEPSEEK_API_BASE", "https://api.deepseek.com/v1")
            llm = ChatOpenAI(
                model=model_name,
                temperature=0.7,
                max_tokens=50,
                openai_api_base=api_base,
                openai_api_key=api_key
            )
        else:  # OpenAI
            from langchain_openai import ChatOpenAI
            llm = ChatOpenAI(
                model=model_name,
                temperature=0.7,
                max_tokens=50
            )

        # Test with simple prompt
        response = llm.invoke("Say 'OK' if you can read this.")

        print(f"✓ {model_display_name} ({provider}): Working!")
        print(f"  Response: {response.content[:50]}...")
        return True

    except Exception as e:
        error_msg = str(e)
        print(f"✗ {model_display_name} ({provider}): Failed")
        print(f"  Error: {error_msg[:100]}...")

        # Provide helpful suggestions
        if "authentication" in error_msg.lower() or "401" in error_msg:
            print(f"  → Check your {provider} API key")
        elif "not found" in error_msg.lower() or "404" in error_msg:
            print(f"  → Model '{model_name}' not found. Check model name.")
        elif "quota" in error_msg.lower() or "rate limit" in error_msg.lower():
            print(f"  → Rate limit or quota exceeded. Check your account.")
        elif "connection" in error_msg.lower():
            print(f"  → Network connection issue. Check internet.")

        return False

# Test each model
success_count = 0

if test_model(model_name, "Voice Agent Model"):
    success_count += 1

if tab_qa_model != model_name:
    if test_model(tab_qa_model, "Tab Q&A Model"):
        success_count += 1
else:
    print(f"✓ Tab Q&A Model: Same as Voice Agent (already tested)")
    success_count += 1

if response_model != model_name and response_model != tab_qa_model:
    if test_model(response_model, "Response Model"):
        success_count += 1
elif response_model == model_name:
    print(f"✓ Response Model: Same as Voice Agent (already tested)")
    success_count += 1
else:
    print(f"✓ Response Model: Same as Tab Q&A (already tested)")
    success_count += 1

# Summary
print("\n" + "=" * 70)
if success_count == 3:
    print("✅ SUCCESS! All models are working correctly!")
    print("\nYou can now start the server:")
    print("  python run_server.py")
    print("\nThen open the dashboard:")
    print("  http://localhost:3000/dashboard.html")
else:
    print("⚠️  PARTIAL SUCCESS: Some models failed")
    print("\nReview the errors above and:")
    print("  1. Check your API keys in .env file")
    print("  2. Verify model names are correct")
    print("  3. Check your account has credits/quota")
    print("\nSee LLM_CONFIGURATION_GUIDE.md for help")

print("=" * 70)
