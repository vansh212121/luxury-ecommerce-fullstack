
// src/pages/WishlistPage.jsx - Fully Integrated with RTK Query
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

// 1. Import all the necessary RTK Query hooks
import {
  useGetWishlistItemsQuery,
  useDeleteFromWishlistMutation,
} from "@/features/api/wishlistApi";
import { useAddToCartMutation } from "@/features/api/cartApi";

const WishlistPage = () => {
  // 2. Fetch the user's wishlist from the backend
  const {
    data: wishlistItems = [],
    isLoading,
    isError,
  } = useGetWishlistItemsQuery();

  // 3. Instantiate the mutation hooks
  const [deleteFromWishlist, { isLoading: isDeleting }] =
    useDeleteFromWishlistMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handleAddToCart = async (wishlistItem) => {
    const product = wishlistItem.product;
    // Use the first available size and colour as defaults
    const defaultSizeId = product.sizes?.[0]?.id;
    const defaultColourId = product.colours?.[0]?.id;

    if (!defaultSizeId || !defaultColourId) {
      toast.error("Product details are incomplete.");
      return;
    }

    try {
      // First, add the item to the cart
      await addToCart({
        product_id: product.id,
        size_id: defaultSizeId,
        colour_id: defaultColourId,
        quantity: 1,
      }).unwrap();

      // Then, remove it from the wishlist
      await deleteFromWishlist(wishlistItem.id).unwrap();

      toast.success(`${product.name} moved to cart!`);
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to move item.");
    }
  };

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
      await deleteFromWishlist(wishlistItemId).unwrap();
      toast.success("Removed from wishlist.");
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to remove item.");
    }
  };

  // 4. Handle loading, error, and empty states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gold font-display text-2xl">
        Loading Your Wishlist...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-display text-2xl">
        Failed to load your wishlist.
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-rich-black pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8">
            <Heart className="w-20 h-20 mx-auto text-gold/30 mb-6" />
            <Sparkles className="w-12 h-12 mx-auto text-gold mb-6" />
            <h1 className="text-4xl font-display font-bold text-warm-white mb-4">
              Your Wishlist Awaits
            </h1>
            <p className="text-lg text-warm-white/60 mb-8 max-w-md mx-auto">
              Curate your perfect luxury collection with our most coveted pieces
            </p>
            <Link
              to="/women"
              className="bg-gold text-rich-black px-8 py-4 font-medium tracking-wider hover:bg-gold/90 transition-all duration-300 inline-block"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold text-warm-white mb-4">
            My Wishlist
          </h1>
          <p className="text-xl text-warm-white/70">
            {wishlistItems.length} curated luxury piece
            {wishlistItems.length !== 1 ? "s" : ""} awaiting your collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((item) => {
            const product = item.product; // The actual product is nested inside the wishlist item
            const isActionLoading = isDeleting || isAddingToCart;
            return (
              <div key={item.id} className="group">
                <div className="relative aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden mb-4">
                  <img
                    src={
                      product.images[0]?.image_url ||
                      "https://placehold.co/600x800/151515/FFF?text=Elysian"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-rich-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="space-y-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={isActionLoading}
                          className="w-full bg-gold text-rich-black py-3 font-medium tracking-wider hover:bg-gold/90 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>MOVE TO BAG</span>
                        </button>

                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          disabled={isActionLoading}
                          className="w-full border border-warm-white/20 text-warm-white py-3 hover:bg-warm-white/10 transition-colors disabled:opacity-50"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={isActionLoading}
                    className="absolute top-4 right-4 p-2 bg-rich-black/50 backdrop-blur-sm rounded-full text-warm-white hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-display font-medium text-warm-white group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-warm-white/60">
                    {product.category.name}
                  </p>
                  <p className="text-2xl font-semibold text-gold">
                    ${product.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
