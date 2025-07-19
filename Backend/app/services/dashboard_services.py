# app/services/dashboard_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.crud import dashboard as dashboard_crud
from app.models.user_model import User


def get_dashboard_stats(db: Session, current_user: User) -> dict:
    """
    Service to get dashboard statistics. (Admin only)
    """
    # Authorization check
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource.",
        )

    # Call all the CRUD functions to get the data
    total_income = dashboard_crud.get_total_income(db)
    total_sales = dashboard_crud.get_total_sales_count(db)
    total_products = dashboard_crud.get_total_products_count(db)
    total_customers = dashboard_crud.get_total_customers_count(db)

    # Assemble the final dictionary
    stats = {
        "total_income": total_income,
        "total_sales": total_sales,
        "total_products": total_products,
        "total_customers": total_customers,
    }

    return stats
