// src/components/product/ProductCard.jsx - Fully Integrated with RTK Query
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

// 1. Import all the necessary RTK Query hooks
import { useAddToCartMutation } from "@/features/api/cartApi";
import {
  useGetWishlistItemsQuery,
  useAddToWishlistMutation,
  useDeleteFromWishlistMutation,
} from "@/features/api/wishlistApi";
import { useSelector } from "react-redux";

const ProductCard = ({ product }) => {
  // 2. Instantiate the mutation hooks
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [deleteFromWishlist, { isLoading: isDeletingFromWishlist }] =
    useDeleteFromWishlistMutation();

  // 3. Get the authentication state and wishlist data to determine button states
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: wishlistItems = [] } = useGetWishlistItemsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // 4. Determine if this specific product is in the user's wishlist
  const wishlistItem = wishlistItems.find(
    (item) => item.product.id === product.id
  );
  const isInWishlist = !!wishlistItem;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }

    // For "Quick Add", we'll use the first available size and colour as defaults
    const defaultSizeId = product.sizes?.[0]?.id;
    const defaultColourId = product.colours?.[0]?.id;

    if (!defaultSizeId || !defaultColourId) {
      toast.error(
        "Product details are incomplete. Please view the product page."
      );
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        size_id: defaultSizeId,
        colour_id: defaultColourId,
        quantity: 1,
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to add to cart.");
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!isAuthenticated) {
      toast.error("Please sign in to manage your wishlist.");
      return;
    }

    try {
      if (isInWishlist) {
        await deleteFromWishlist(wishlistItem.id).unwrap();
        toast.success("Removed from wishlist.");
      } else {
        await addToWishlist({ product_id: product.id }).unwrap();
        toast.success("Added to wishlist!");
      }
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to update wishlist.");
    }
  };

  if (!product) {
    return null; // Or a loading skeleton
  }

  const categoryName = product.category?.name || "Uncategorized";
  const imageUrl =
    product.images?.[0]?.image_url ||
    "https://placehold.co/600x800/151515/FFF?text=Elysian";
  const isLoading =
    isAddingToCart || isAddingToWishlist || isDeletingFromWishlist;

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-rich-black/90 via-rich-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-display font-medium text-warm-white mb-1 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-warm-white/80 mb-2 capitalize">
              {categoryName}
            </p>
            <p className="text-xl font-bold text-gold">${product.price}</p>
          </div>

          <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors disabled:opacity-50 ${
              isInWishlist
                ? "bg-gold text-rich-black"
                : "bg-warm-white/20 backdrop-blur-sm text-warm-white"
            } hover:bg-gold hover:text-rich-black`}
          >
            <Heart
              className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <button
          onClick={handleAddToCart}
          disabled={isLoading || product.status !== "active"}
          className="w-full bg-gold text-rich-black py-2 text-sm font-medium hover:bg-gold/90 transition-colors disabled:bg-gold/50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "..."
            : product.status === "active"
            ? "QUICK ADD"
            : "OUT OF STOCK"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
