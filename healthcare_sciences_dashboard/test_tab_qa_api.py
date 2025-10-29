"""
Quick test of the Tab Q&A API endpoint
"""
import requests
import json

print("=" * 70)
print("TESTING TAB Q&A API ENDPOINT")
print("=" * 70)

# Test data
url = "http://localhost:8000/api/query/ask-tab"
payload = {
    "question": "Compare performance across all departments",
    "tab": "overview",
    "tab_data": {
        "order_volume": {"monthly_orders": 24500, "growth_rate": 15.2},
        "compliance": {"return_rate": 2.3, "quality_score": 94.5},
        "costs": {"total_monthly_costs": 2800000}
    }
}

print("\n📤 Sending request to:", url)
print("\n📝 Request payload:")
print(json.dumps(payload, indent=2))

try:
    response = requests.post(url, json=payload, timeout=30)

    print("\n📥 Response status:", response.status_code)
    print("\n📦 Response body:")

    if response.status_code == 200:
        result = response.json()
        print(json.dumps(result, indent=2))

        print("\n" + "=" * 70)
        if result.get("success"):
            print("✅ SUCCESS! Tab Q&A API is working!")
            print(f"\nModel used: {result.get('model', 'unknown')}")
            print(f"Tab: {result.get('tab_name', 'unknown')}")
            print(f"\nAnswer preview:")
            print("-" * 70)
            answer = result.get('answer', 'No answer')
            print(answer[:300] + "..." if len(answer) > 300 else answer)
        else:
            print("❌ API returned success=false")
            print(f"Error: {result.get('error', 'Unknown error')}")
    else:
        print(response.text)
        print("\n❌ API returned error status code")

except requests.exceptions.ConnectionError:
    print("\n❌ ERROR: Cannot connect to API server")
    print("\n👉 Make sure server is running:")
    print("   cd healthcare_sciences_dashboard")
    print("   python run_server.py")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("=" * 70)
