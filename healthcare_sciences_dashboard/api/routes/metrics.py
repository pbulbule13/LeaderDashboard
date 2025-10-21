# api/routes/metrics.py

from fastapi import APIRouter

# THIS LINE IS CRUCIAL: It defines the 'router' attribute that server.py is looking for.
router = APIRouter()

# You can add a simple placeholder endpoint to ensure it works
@router.get("/status")
def get_metrics_status():
    return {"status": "Metrics router is running"}