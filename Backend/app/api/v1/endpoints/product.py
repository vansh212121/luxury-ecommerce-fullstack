# app/api/v1/endpoints/products.py
from fastapi import APIRouter, status, Depends, Query
from sqlalchemy.orm import Session
from app.schemas.product_schema import ProductResponse, ProductCreate, ProductUpdate, ProductPageResponse
from app.services import product_services  # Corrected import name
from app.models.user_model import User
from app.utils import deps
from typing import List, Optional


router = APIRouter()


# Use POST on the collection name ('/products') for creating a resource.
@router.post(
    "/create", status_code=status.HTTP_201_CREATED, response_model=ProductResponse
)
def create_product_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    product_in: ProductCreate,
    current_user: User = Depends(deps.get_current_active_user)
):

    product = product_services.create_new_product(
        db=db, product_in=product_in, current_user=current_user
    )
    return product


@router.patch(
    "/{product_id}", status_code=status.HTTP_200_OK, response_model=ProductResponse
)
def update_product_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    # Use the new ProductUpdate schema for partial updates
    product_in: ProductUpdate,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    API endpoint to update a product. Only accessible by admin users.
    """
    product = product_services.update_existing_product(
        db=db, product_id=product_id, product_in=product_in, current_user=current_user
    )
    return product


@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id_endpoint(
    *, db: Session = Depends(deps.get_db), product_id: int  # <-- CORRECTED LINE
):
    product = product_services.get_product_by_id(db=db, product_id=product_id)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def delete_product_endpoint(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    API endpoint to "soft delete" a product by setting its status to inactive.
    Only accessible by admin users.
    """
    product_services.soft_delete_product_by_id(
        db=db, product_id=product_id, current_user=current_user
    )

    return {"detail": "Product marked as inactive successfully"}



# @router.get("/", response_model=ProductPageResponse)
# def get_all_products_endpoint(
#     db: Session = Depends(deps.get_db),
#     # IMPORTANT: Use get_optional_current_user instead of get_current_user
#     # This allows the endpoint to work without authentication
#     current_user: Optional[User] = Depends(deps.get_optional_current_user),
#     page: int = 1,
#     limit: int = 20,
#     gender: Optional[str] = None,
#     sort_by: Optional[str] = None,
#     min_price: Optional[float] = None,
#     max_price: Optional[float] = None,
#     category_ids: Optional[List[int]] = Query(None),
#     size_ids: Optional[List[int]] = Query(None),
#     colour_ids: Optional[List[int]] = Query(None),
# ):
#     """
#     Fetches all products with pagination and advanced filtering.
#     Public endpoint - works for both logged out users and admins.
#     - Logged out users: only see active products
#     - Admins: see all products (active + inactive)
#     """
#     # Clean up empty arrays - convert empty lists to None
#     filters = {
#         "gender": gender if gender else None,
#         "sort_by": sort_by if sort_by else None,
#         "min_price": min_price,
#         "max_price": max_price,
#         "category_ids": category_ids if category_ids and len(category_ids) > 0 else None,
#         "size_ids": size_ids if size_ids and len(size_ids) > 0 else None,
#         "colour_ids": colour_ids if colour_ids and len(colour_ids) > 0 else None,
#     }
    
#     # Remove None values to avoid passing unnecessary parameters
#     filters = {k: v for k, v in filters.items() if v is not None}

#     products_page = product_services.get_all_public_or_admin_products(
#         db=db, current_user=current_user, page=page, limit=limit, **filters
#     )
#     return products_page


@router.get("/", response_model=ProductPageResponse)
def get_all_products_endpoint(
    db: Session = Depends(deps.get_db),
    # IMPORTANT: Use get_optional_current_user instead of get_current_user
    # This allows the endpoint to work without authentication
    # current_user: Optional[User] = Depends(deps.get_optional_current_user),
    page: int = 1,
    limit: int = 20,
    gender: Optional[str] = None,
    sort_by: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category_ids: Optional[List[int]] = Query(None),
    size_ids: Optional[List[int]] = Query(None),
    colour_ids: Optional[List[int]] = Query(None),
    search: Optional[str] = None, # Add the search parameter
):
    """
    Fetches all products with pagination and advanced filtering.
    Public endpoint - works for both logged out users and admins.
    - Logged out users: only see active products
    - Admins: see all products (active + inactive)
    """
    # Clean up empty arrays - convert empty lists to None
    filters = {
        "gender": gender if gender else None,
        "sort_by": sort_by if sort_by else None,
        "min_price": min_price,
        "max_price": max_price,
        "category_ids": category_ids if category_ids and len(category_ids) > 0 else None,
        "size_ids": size_ids if size_ids and len(size_ids) > 0 else None,
        "colour_ids": colour_ids if colour_ids and len(colour_ids) > 0 else None,
        "search": search,
    }
    
    # Remove None values to avoid passing unnecessary parameters
    filters = {k: v for k, v in filters.items() if v is not None}

    products_page = product_services.get_all_public_or_admin_products(
        db=db,  page=page, limit=limit, **filters
    )
    return products_page