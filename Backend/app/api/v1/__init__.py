# app/api/v1/__init__.py
from fastapi import APIRouter
from .endpoints import user # Import the users router
from.endpoints import auth
from .endpoints import product
from .endpoints import category 
from .endpoints import size
from .endpoints import colour
from .endpoints import cart
from .endpoints import wishlist
from .endpoints import order
from .endpoints import dashboard

api_router = APIRouter()
api_router.include_router(user.router, prefix="/user", tags=["User"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(product.router, prefix="/product", tags=["Product"])
api_router.include_router(category.router, prefix="/category", tags=["Category"])
api_router.include_router(size.router, prefix="/size", tags=["Size"])
api_router.include_router(colour.router, prefix="/colour", tags=["Colour"])
api_router.include_router(cart.router, prefix="/cart", tags=["Cart"])
api_router.include_router(wishlist.router, prefix="/wishlist", tags=["Wishlist"])
api_router.include_router(order.router, prefix="/order", tags=["Order"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
# We will add other routers like auth, products, etc. here later