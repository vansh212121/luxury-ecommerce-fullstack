from pydantic import BaseModel


class DashboardStatsResponse(BaseModel):
    """
    Schema for the dashboard statistics response.
    """

    total_income: float
    total_sales: int
    total_products: int
    total_customers: int
