from sqlalchemy.orm import Session
from app.schemas.product_schema import ProductCreate, ProductStatus, ProductGender
from app.models.product_model import Product, Category, Size, Colour, ProductImage
from typing import Dict, Any, Optional, List, Tuple


def create_product(db: Session, product_in: ProductCreate) -> Product:
    """
    Creates a new product in the database, handling all its relationships.
    """
    category_obj = (
        db.query(Category).filter(Category.id == product_in.category_id).first()
    )
    size_objs = db.query(Size).filter(Size.id.in_(product_in.size_ids)).all()
    colour_objs = db.query(Colour).filter(Colour.id.in_(product_in.colour_ids)).all()

    # Basic validation (a real app might have more)
    if not category_obj:
        raise ValueError(f"Category with id {product_in.category_id} not found.")
    if len(size_objs) != len(product_in.size_ids):
        raise ValueError("One or more size IDs are invalid.")
    if len(colour_objs) != len(product_in.colour_ids):
        raise ValueError("One or more colour IDs are invalid.")

    # 2. Create the main Product object, but don't assign relationships yet.
    # We use .model_dump() to get a dictionary of the basic fields.
    product_data = product_in.model_dump(
        exclude={"category_id", "size_ids", "colour_ids", "images"}
    )
    db_product = Product(**product_data)

    # 3. Now, assign the fetched SQLAlchemy objects to the relationships.
    db_product.category = category_obj
    db_product.sizes = size_objs
    db_product.colours = colour_objs

    # 4. Handle the images. Loop through the image data, create ProductImage
    # objects, and associate them with the product.
    for image_data in product_in.images:
        db_image = ProductImage(image_url=image_data.image_url, product=db_product)
        db.add(db_image)

    # 5. Add the final product to the session and commit.
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


def get_product(db: Session, product_id: int) -> Product | None:

    return db.query(Product).filter(product_id == Product.id).first()


def update_product(db: Session, db_obj: Product, obj_in: Dict[str, Any]) -> Product:
    """
    A generic update function.
    - db_obj: The existing SQLAlchemy object from the database.
    - obj_in: A dictionary with the new data to apply.
    """
    for field, value in obj_in.items():
        # Use setattr to update the fields on the database object
        setattr(db_obj, field, value)

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


# def get_all_products(
#     db: Session,
#     *,
#     status: Optional[ProductStatus] = None,
#     gender: Optional[ProductGender] = None,
#     sort_by: Optional[str] = None,
#     skip: int = 0,
#     limit: int = 100
# ) -> Tuple[List[Product], int]:
#     """
#     Fetches a list of products with optional filters and sorting.
#     """
#     query = db.query(Product)

#     # Apply filters dynamically
#     if status:
#         query = query.filter(Product.status == status)
#     if gender:
#         query = query.filter(Product.gender == gender)

#     # Apply sorting dynamically
#     if sort_by == "created_at":
#         query = query.order_by(Product.created_at.desc())

#     total_count = query.count()

#     # Then, apply ordering, pagination and get the items for the current page
#     items = query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()

#     # Return both the items and the total count
#     return items, total_count


def get_all_products(
    db: Session,
    *,
    status: Optional[ProductStatus] = None,
    gender: Optional[ProductGender] = None,
    sort_by: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category_ids: Optional[List[int]] = None,
    size_ids: Optional[List[int]] = None,
    colour_ids: Optional[List[int]] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
) -> Tuple[List[Product], int]:
    """
    Fetches a list of products with advanced filtering, sorting, and pagination.
    """
    query = db.query(Product)

    if search:
        # Use .ilike() for case-insensitive search on both name and description
        search_term = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | (Product.description.ilike(search_term))
        )

    # Track if we need joins for many-to-many relationships
    needs_size_join = size_ids and len(size_ids) > 0
    needs_colour_join = colour_ids and len(colour_ids) > 0

    # --- Apply basic filters ---
    if status:
        query = query.filter(Product.status == status)
    if gender:
        query = query.filter(Product.gender == gender)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    # --- Handle category filter (many-to-one) ---
    if category_ids and len(category_ids) > 0:
        query = query.filter(Product.category_id.in_(category_ids))

    # --- Handle many-to-many relationships carefully ---
    if needs_size_join:
        query = query.join(Product.sizes).filter(Size.id.in_(size_ids))
    if needs_colour_join:
        query = query.join(Product.colours).filter(Colour.id.in_(colour_ids))

    # --- Get total count BEFORE pagination ---
    # Use distinct() only if we have joins that might create duplicates
    if needs_size_join or needs_colour_join:
        total_count = query.distinct().count()
    else:
        total_count = query.count()

    # --- Apply sorting ---
    if sort_by == "created_at":
        query = query.order_by(Product.created_at.desc())
    elif sort_by == "price-low":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price-high":
        query = query.order_by(Product.price.desc())
    else:
        # Default sorting by created_at desc
        query = query.order_by(Product.created_at.desc())

    # --- Apply pagination ---
    if needs_size_join or needs_colour_join:
        items = query.distinct().offset(skip).limit(limit).all()
    else:
        items = query.offset(skip).limit(limit).all()

    return items, total_count
