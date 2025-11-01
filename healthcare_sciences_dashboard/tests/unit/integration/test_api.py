import pytest
from fastapi.testclient import TestClient
from api.server import app

client = TestClient(app)

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_products_tile():
    response = client.get("/api/dashboard/tiles/products")
    
    if response.status_code != 200:
        print("\n--- 500 ERROR DETAILS ---")
        print(response.json())
        print("-------------------------\n")
    
    assert response.status_code == 200, f"Error: {response.json()}"

@pytest.mark.asyncio
async def test_process_query():
    """Test query processing"""
    response = client.post(
        "/api/query/ask",
        json={"query": "How is DiagnosticTest A performing?"}
    )
    
    # Add debugging output
    if response.status_code != 200:
        print("\n--- QUERY ERROR DETAILS ---")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        print("---------------------------\n")
    
    assert response.status_code == 200, f"Error: {response.json()}"
    assert "response" in response.json()