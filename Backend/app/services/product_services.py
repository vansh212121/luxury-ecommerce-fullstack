from app.schemas.product_schema import ProductCreate, ProductUpdate, ProductStatus
from sqlalchemy.orm import Session
from app.models.product_model import Product, Category, Size, Colour, ProductGender
from app.crud import product as product_crud
from app.models.user_model import User
from fastapi import HTTPException, status
from typing import List, Optional


def create_new_product(
    db: Session, product_in: ProductCreate, current_user: User
) -> Product:

    # Authorization check: Only admins can create products.
    if not current_user.is_admin:
        raise HTTPException(
            # Use 403 Forbidden for authorization errors.
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    try:
        return product_crud.create_product(db=db, product_in=product_in)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


def update_existing_product(
    db: Session, product_id: int, product_in: ProductUpdate, current_user: User
) -> Product:
    """
    The main business logic for updating a product.
    """
    # 1. Authorization check
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    # 2. Fetch the existing product
    product_to_update = product_crud.get_product(db, product_id=product_id)
    if not product_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )

    # 3. Get the update data from the Pydantic model
    update_data = product_in.model_dump(exclude_unset=True)

    # 4. Handle relationship updates (the complex part)
    if "category_id" in update_data:
        category = (
            db.query(Category).filter(Category.id == update_data["category_id"]).first()
        )
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        product_to_update.category = category

    if "size_ids" in update_data:
        sizes = db.query(Size).filter(Size.id.in_(update_data["size_ids"])).all()
        product_to_update.sizes = sizes

    if "colour_ids" in update_data:
        colours = (
            db.query(Colour).filter(Colour.id.in_(update_data["colour_ids"])).all()
        )
        product_to_update.colours = colours

    # 5. Call the simple CRUD function to update the basic fields
    # We pass the existing product object and the dictionary of simple fields
    simple_update_data = {
        k: v
        for k, v in update_data.items()
        if k not in ["category_id", "size_ids", "colour_ids"]
    }

    return product_crud.update_product(
        db=db, db_obj=product_to_update, obj_in=simple_update_data
    )


def get_product_by_id(db: Session, product_id: int) -> Product:
    product = product_crud.get_product(db=db, product_id=product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No Product found for id {product_id}",
        )

    return product


def soft_delete_product_by_id(
    db: Session, product_id: int, current_user: User
) -> Product:
    """
    Business logic to "soft delete" a product by setting its status to inactive.
    """
    # 1. Authorization Check: Only admins can delete products.
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action.",
        )

    # 2. Fetch the product using our existing CRUD function.
    product_to_delete = product_crud.get_product(db, product_id=product_id)
    if not product_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found.",
        )

    # 3. If the product is already inactive, we can let the admin know.
    if product_to_delete.status == ProductStatus.inactive:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with ID {product_id} is already inactive.",
        )

    # 4. Prepare the update data. We only want to change the status.
    update_data = {"status": ProductStatus.inactive}

    # 5. Call our existing, simple update_product CRUD function!
    # This is perfect code reuse.
    return product_crud.update_product(
        db=db, db_obj=product_to_delete, obj_in=update_data
    )

# def get_all_public_or_admin_products(
#     db: Session, 
#     current_user: Optional[User], 
#     page: int, 
#     limit: int,
#     **filters: dict
# ) -> dict:
#     """
#     Service logic for fetching products with full filtering.
#     """
#     status_filter = None
#     if not current_user or not current_user.is_admin:
#         status_filter = ProductStatus.active
    
#     # 2. THE FIX: Safely convert the gender string to an Enum member
#     gender_filter = filters.get("gender")
#     if gender_filter:
#         try:
#             # Normalize the input to lowercase to prevent case-sensitivity issues
#             normalized_gender = gender_filter.lower()
#             # This ensures we pass the correct Enum type to the CRUD layer
#             filters["gender"] = ProductGender(normalized_gender)
#         except ValueError:
#             # If an invalid gender string is passed, raise an error
#             raise HTTPException(status_code=400, detail=f"Invalid gender value: {gender_filter}")

#     skip = (page - 1) * limit
    
#     products, total = product_crud.get_all_products(
#         db=db, 
#         status=status_filter, 
#         skip=skip, 
#         limit=limit,
#         **filters
#     )

#     return {"items": products, "total": total}


# def get_all_public_or_admin_products(
#     db: Session, 
#     current_user: Optional[User],  # This can be None for logged out users
#     page: int, 
#     limit: int,
#     **filters: dict
# ) -> dict:
#     """
#     Service logic for fetching products with full filtering.
    
#     Business Logic:
#     - If user is None (logged out) OR user is not admin: only show ACTIVE products
#     - If user is admin: show ALL products (active + inactive)
#     """
    
#     # Determine status filter based on user role
#     status_filter = None
    
#     if current_user is None:
#         # Logged out user - only show active products
#         status_filter = ProductStatus.active
#     elif not current_user.is_admin:
#         # Logged in regular user - only show active products
#         status_filter = ProductStatus.active
#     else:
#         # Admin user - show all products (no status filter)
#         status_filter = None
    
#     # Handle gender filter conversion
#     gender_filter = filters.get("gender")
#     if gender_filter:
#         try:
#             normalized_gender = gender_filter.lower()
#             filters["gender"] = ProductGender(normalized_gender)
#         except ValueError:
#             raise HTTPException(status_code=400, detail=f"Invalid gender value: {gender_filter}")

#     skip = (page - 1) * limit
    
#     products, total = product_crud.get_all_products(
#         db=db, 
#         status=status_filter, 
#         skip=skip, 
#         limit=limit,
#         **filters
#     )

#     return {"items": products, "total": total}


def get_all_public_or_admin_products(
    db: Session, 
    # current_user: Optional[User],  # This can be None for logged out users
    page: int, 
    limit: int,
    **filters: dict
) -> dict:
    """
    Service logic for fetching products with full filtering.
    
    Business Logic:
    - If user is None (logged out) OR user is not admin: only show ACTIVE products
    - If user is admin: show ALL products (active + inactive)
    """
    
    # Determine status filter based on user role
    # status_filter = None
    
    # if current_user is None:
    #     # Logged out user - only show active products
    #     status_filter = ProductStatus.active
    # elif not current_user.is_admin:
    #     # Logged in regular user - only show active products
    #     status_filter = ProductStatus.active
    # else:
    #     # Admin user - show all products (no status filter)
    #     status_filter = None
    
    # Handle gender filter conversion
    gender_filter = filters.get("gender")
    if gender_filter:
        try:
            normalized_gender = gender_filter.lower()
            filters["gender"] = ProductGender(normalized_gender)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid gender value: {gender_filter}")

    skip = (page - 1) * limit
    
    products, total = product_crud.get_all_products(
        db=db, 
        # status=status_filter, 
        skip=skip, 
        limit=limit,
        **filters
    )

    return {"items": products, "total": total}