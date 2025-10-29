# LLM Configuration Guide
## Support for OpenAI, Google Gemini, and DeepSeek

This guide explains how to configure the dashboard to use different LLM providers instead of Anthropic (Claude).

---

## 🎯 Supported LLM Providers

The dashboard now supports **THREE** major LLM providers with **DeepSeek as primary**:

1. **DeepSeek** (Primary) - DeepSeek Chat, DeepSeek Coder - Most affordable
2. **Google Gemini** (Secondary) - Gemini 1.5 Pro, Gemini 1.5 Flash - Good balance
3. **OpenAI** (Tertiary) - GPT-4, GPT-4-Turbo, GPT-3.5-Turbo, GPT-4o - Most capable

All AI features work with any of these providers!

---

## ⚙️ Configuration

### Current .env File

Your `.env` file is configured with **DeepSeek as primary** model! You're ready to go.

**Current configuration:**
```bash
# Priority: DeepSeek → Gemini → OpenAI
DEEPSEEK_API_KEY=sk-...
MODEL_NAME=deepseek-chat
TAB_QA_MODEL=deepseek-chat
RESPONSE_MODEL=deepseek-chat
FALLBACK_MODELS=gemini-1.5-flash,gpt-4o,gpt-3.5-turbo
```

### Model Selection

You can configure different models for different features:

| Environment Variable | Purpose | Default |
|---------------------|---------|---------|
| `MODEL_NAME` | Voice Agent reasoning & intent classification | `gpt-4` |
| `TAB_QA_MODEL` | Tab-specific Q&A agent | `gpt-4` |
| `RESPONSE_MODEL` | Voice agent friendly responses | `gpt-4` |
| `FALLBACK_MODELS` | Backup models if primary fails | `gpt-4o-mini,gpt-3.5-turbo` |

---

## 🚀 Option 1: OpenAI (Current Setup)

### ✅ You're Already Configured!

Your `.env` file shows you're using OpenAI with GPT-4o. This will work perfectly!

### Available OpenAI Models

```bash
# Most capable (recommended)
MODEL_NAME=gpt-4

# Faster and cheaper
MODEL_NAME=gpt-4-turbo
MODEL_NAME=gpt-4o

# Most affordable
MODEL_NAME=gpt-3.5-turbo
```

### Cost Comparison
- `gpt-4`: $30/M input tokens, $60/M output tokens
- `gpt-4-turbo`: $10/M input tokens, $30/M output tokens
- `gpt-4o`: $2.50/M input tokens, $10/M output tokens
- `gpt-3.5-turbo`: $0.50/M input tokens, $1.50/M output tokens

### Your Setup (Recommended)
```bash
# In your .env file (already configured!)
OPENAI_API_KEY=your_key_here
MODEL_NAME=gpt-4o
TAB_QA_MODEL=gpt-4o
RESPONSE_MODEL=gpt-4o
FALLBACK_MODELS=gpt-4o-mini,gpt-3.5-turbo
```

---

## 🌟 Option 2: Google Gemini

### Get API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key (or use existing)
3. Copy the key

### Available Gemini Models

```bash
# Most capable
gemini-1.5-pro

# Fastest and most affordable
gemini-1.5-flash

# Standard model
gemini-pro
```

### Configure for Gemini

Edit your `.env` file:

```bash
# Comment out or remove OpenAI key
# OPENAI_API_KEY=...

# Add Gemini key
GOOGLE_API_KEY=your_google_api_key_here

# Set models to Gemini
MODEL_NAME=gemini-1.5-pro
TAB_QA_MODEL=gemini-1.5-pro
RESPONSE_MODEL=gemini-1.5-pro

# Gemini fallback
FALLBACK_MODELS=gemini-1.5-flash,gemini-pro
```

### Cost Comparison
- `gemini-1.5-pro`: $3.50/M input tokens, $10.50/M output tokens
- `gemini-1.5-flash`: $0.075/M input tokens, $0.30/M output tokens
- **Free tier**: 15 requests per minute, 1 million tokens per minute

---

## 🚀 Option 3: DeepSeek

### Get API Key

1. Go to https://platform.deepseek.com/
2. Sign up and create an API key
3. Copy the key

### Available DeepSeek Models

```bash
# Most capable
deepseek-chat

# Optimized for code (works for general tasks too)
deepseek-coder
```

### Configure for DeepSeek

Edit your `.env` file:

```bash
# Add DeepSeek key (can use same variable as OpenAI)
DEEPSEEK_API_KEY=your_deepseek_api_key_here
# OR use OPENAI_API_KEY if you prefer

# DeepSeek API base URL
DEEPSEEK_API_BASE=https://api.deepseek.com/v1

# Set models to DeepSeek
MODEL_NAME=deepseek-chat
TAB_QA_MODEL=deepseek-chat
RESPONSE_MODEL=deepseek-chat

# DeepSeek fallback
FALLBACK_MODELS=deepseek-coder
```

### Cost Comparison
- `deepseek-chat`: $0.14/M input tokens, $0.28/M output tokens
- `deepseek-coder`: $0.14/M input tokens, $0.28/M output tokens
- **Very affordable!** Significantly cheaper than OpenAI GPT-4

---

## 🔄 Switching Between Providers

### To Switch from OpenAI to Gemini

```bash
# 1. Comment out OpenAI
# OPENAI_API_KEY=your_key

# 2. Add Gemini
GOOGLE_API_KEY=your_google_key

# 3. Update models
MODEL_NAME=gemini-1.5-pro
TAB_QA_MODEL=gemini-1.5-pro
RESPONSE_MODEL=gemini-1.5-pro
FALLBACK_MODELS=gemini-1.5-flash
```

### To Switch from OpenAI to DeepSeek

```bash
# 1. Keep or add DeepSeek key
DEEPSEEK_API_KEY=your_deepseek_key
DEEPSEEK_API_BASE=https://api.deepseek.com/v1

# 2. Update models
MODEL_NAME=deepseek-chat
TAB_QA_MODEL=deepseek-chat
RESPONSE_MODEL=deepseek-chat
FALLBACK_MODELS=deepseek-coder
```

### Restart Required

After changing `.env`, restart the server:
```powershell
# Stop server (Ctrl+C)
# Then restart:
python run_server.py
```

---

## 🧪 Testing Your Configuration

### Test Script

I've created a test script for you! Run it to verify your API keys:

```powershell
cd healthcare_sciences_dashboard
python test_llm_config.py
```

This will:
- Check which API keys are configured
- Test connection to the LLM
- Verify the model works
- Show which provider is active

### Manual Test

Or test manually:

```python
# test_quick.py
import os
from dotenv import load_dotenv

load_dotenv()

# Check what's configured
print("OpenAI Key:", "✓" if os.getenv("OPENAI_API_KEY") else "✗")
print("Gemini Key:", "✓" if os.getenv("GOOGLE_API_KEY") else "✗")
print("DeepSeek Key:", "✓" if os.getenv("DEEPSEEK_API_KEY") else "✗")

print("\nConfigured Models:")
print(f"MODEL_NAME: {os.getenv('MODEL_NAME', 'gpt-4')}")
print(f"TAB_QA_MODEL: {os.getenv('TAB_QA_MODEL', 'gpt-4')}")
print(f"RESPONSE_MODEL: {os.getenv('RESPONSE_MODEL', 'gpt-4')}")
```

---

## 💡 Recommendations

### For Best Quality
```bash
# Use GPT-4 (OpenAI) or Gemini 1.5 Pro
MODEL_NAME=gpt-4
TAB_QA_MODEL=gpt-4
RESPONSE_MODEL=gpt-4
```

### For Best Cost/Performance Balance
```bash
# Use GPT-4o (OpenAI) or Gemini 1.5 Flash
MODEL_NAME=gpt-4o
TAB_QA_MODEL=gpt-4o
RESPONSE_MODEL=gpt-4o
```

### For Lowest Cost
```bash
# Use DeepSeek or GPT-3.5-Turbo
MODEL_NAME=deepseek-chat
TAB_QA_MODEL=deepseek-chat
RESPONSE_MODEL=gpt-3.5-turbo  # Can mix providers!
```

### Mixed Configuration (Advanced)
```bash
# Use different models for different features
MODEL_NAME=gpt-4  # Best reasoning for voice agent
TAB_QA_MODEL=gemini-1.5-flash  # Fast for Q&A
RESPONSE_MODEL=deepseek-chat  # Affordable for responses
```

---

## 🎯 Your Current Setup

Based on your `.env` file, you have:

✅ **DeepSeek configured as primary (deepseek-chat)**
✅ **Gemini as secondary fallback (gemini-1.5-flash)**
✅ **OpenAI as tertiary fallback (gpt-4o)**
✅ **Ready to use immediately**
✅ **Most cost-effective configuration**

### To Use Your Current Setup

Simply start the server:
```powershell
cd healthcare_sciences_dashboard
python run_server.py
```

Then open:
- Dashboard: http://localhost:3000/dashboard.html
- API Docs: http://localhost:8000/docs

---

## ❓ Troubleshooting

### "Invalid API Key" Error

**For OpenAI:**
- Verify key starts with `sk-proj-` or `sk-`
- Check it's not expired at https://platform.openai.com/api-keys

**For Gemini:**
- Get new key from https://makersuite.google.com/app/apikey
- Ensure `GOOGLE_API_KEY` is set in `.env`

**For DeepSeek:**
- Verify key from https://platform.deepseek.com/
- Check `DEEPSEEK_API_BASE` is set correctly

### Model Not Found

```bash
# Make sure model name matches provider
# OpenAI: gpt-4, gpt-4-turbo, gpt-4o, gpt-3.5-turbo
# Gemini: gemini-1.5-pro, gemini-1.5-flash, gemini-pro
# DeepSeek: deepseek-chat, deepseek-coder
```

### Mixed Providers Not Working

If mixing providers (e.g., OpenAI for reasoning, Gemini for Q&A), ensure BOTH API keys are in `.env`:

```bash
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_gemini_key
MODEL_NAME=gpt-4
TAB_QA_MODEL=gemini-1.5-pro
```

---

## 📊 Cost Estimator

### Typical Usage (per 1000 questions)

**Tab Q&A (1000 questions × 500 tokens avg):**
- GPT-4: ~$1.50
- GPT-4o: ~$0.31
- Gemini Pro: ~$0.88
- Gemini Flash: ~$0.02
- DeepSeek: ~$0.04

**Voice Agent (1000 queries × 1500 tokens avg):**
- GPT-4: ~$4.50
- GPT-4o: ~$0.94
- Gemini Pro: ~$2.63
- Gemini Flash: ~$0.06
- DeepSeek: ~$0.13

**Total Monthly (10k queries):**
- GPT-4: ~$60
- GPT-4o: ~$12.50
- Gemini Pro: ~$35
- Gemini Flash: ~$0.80
- DeepSeek: ~$1.70

---

## ✅ Summary

1. **You're already configured with DeepSeek as primary** ✓
2. **Fallback chain**: DeepSeek → Gemini → OpenAI
3. **To switch to different primary**: Update MODEL_NAME in .env
4. **Restart server** after .env changes
5. **Test with the dashboard** - it should work immediately!

The AI features will work the same regardless of which provider you choose. Pick based on your budget and performance needs.

---

**Ready to use? Just start the server!**

```powershell
cd healthcare_sciences_dashboard
python run_server.py
```
