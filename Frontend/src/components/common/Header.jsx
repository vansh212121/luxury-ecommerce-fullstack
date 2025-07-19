// src/components/common/Header.jsx - Fully Integrated with Redux
import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "../../features/authSlice";

// 1. Import the RTK Query hooks
import { useGetCartItemsQuery } from "@/features/api/cartApi";
import { useGetWishlistItemsQuery } from "@/features/api/wishlistApi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 2. Fetch cart and wishlist data.
  // run if the user is actually logged in.
  const { data: cartItems = [] } = useGetCartItemsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: wishlistItems = [] } = useGetWishlistItemsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // 3. Calculate the total item counts from the fetched data
  const totalCartItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    dispatch(userLoggedOut());
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="bg-rich-black/95 backdrop-blur-md fixed w-full top-0 z-50 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="text-3xl font-display font-bold gold-gradient-text tracking-wider"
          >
            ELYSIAN
          </Link>

          <nav className="hidden lg:flex items-center space-x-12">
            <Link
              to="/men"
              className="text-warm-white hover:text-gold transition-colors duration-300 font-light tracking-wide"
            >
              MEN
            </Link>
            <Link
              to="/women"
              className="text-warm-white hover:text-gold transition-colors duration-300 font-light tracking-wide"
            >
              WOMEN
            </Link>
            <Link
              to="/unisex"
              className="text-warm-white hover:text-gold transition-colors duration-300 font-light tracking-wide"
            >
              UNISEX
            </Link>
            <Link
              to="/trending"
              className="text-warm-white hover:text-gold transition-colors duration-300 font-light tracking-wide"
            >
              TRENDING
            </Link>
            <Link
              to="/new-arrivals"
              className="text-warm-white hover:text-gold transition-colors duration-300 font-light tracking-wide"
            >
              NEW ARRIVALS
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            {/* <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-warm-white hover:text-gold transition-colors">
              <Search className="w-5 h-5" />
            </button> */}

            <Link to="/wishlist" className="relative group">
              <Heart className="w-5 h-5 text-warm-white group-hover:text-gold transition-colors" />
              {isAuthenticated && wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-rich-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative group">
              <ShoppingBag className="w-5 h-5 text-warm-white group-hover:text-gold transition-colors" />
              {isAuthenticated && totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-rich-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="text-warm-white hover:text-gold transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <div className="absolute right-0 top-full pt-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-rich-black/95 backdrop-blur-md border border-gold/20 rounded-lg">
                    {user.is_admin ? (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-warm-white hover:bg-gold/10"
                      >
                        Admin Panel
                      </Link>
                    ) : (
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-warm-white hover:bg-gold/10"
                      >
                        My Orders
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-warm-white hover:bg-gold/10"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-warm-white hover:text-gold transition-colors text-sm"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/register"
                  className="border border-gold text-gold px-4 py-2 text-sm hover:bg-gold hover:text-rich-black transition-all duration-300"
                >
                  JOIN ELYSIAN
                </Link>
              </div>
            )}

            <button
              className="lg:hidden text-warm-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-rich-black/95 backdrop-blur-md border-t border-gold/20 p-4">
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search luxury pieces..."
                className="w-full bg-transparent border-b border-gold/30 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold py-2"
              />
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-rich-black/95 backdrop-blur-md border-t border-gold/20">
            <div className="px-4 py-6 space-y-4">
              <Link to="/men" className="block text-warm-white hover:text-gold">
                MEN
              </Link>
              <Link
                to="/women"
                className="block text-warm-white hover:text-gold"
              >
                WOMEN
              </Link>
              <Link
                to="/unisex"
                className="block text-warm-white hover:text-gold"
              >
                UNISEX
              </Link>
              <Link
                to="/trending"
                className="block text-warm-white hover:text-gold"
              >
                TRENDING
              </Link>
              <Link
                to="/new-arrivals"
                className="block text-warm-white hover:text-gold"
              >
                NEW ARRIVALS
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
