# app/api/v1/endpoints/admin_dashboard.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.services import dashboard_services
from app.schemas.dashboard_schema import DashboardStatsResponse
from app.utils import deps
from app.models.user_model import User

router = APIRouter()


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats_endpoint(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Gets all statistics for the admin dashboard.
    """
    return dashboard_services.get_dashboard_stats(db=db, current_user=current_user)
