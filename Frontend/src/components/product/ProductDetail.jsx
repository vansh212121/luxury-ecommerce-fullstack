
// src/components/product/ProductDetail.jsx - Fully Integrated with RTK Query
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// 1. Import all necessary RTK Query hooks
import { useGetProductByIdQuery } from "@/features/api/productApi";
import { useAddToCartMutation } from "@/features/api/cartApi";
import {
  useGetWishlistItemsQuery,
  useAddToWishlistMutation,
  useDeleteFromWishlistMutation,
} from "@/features/api/wishlistApi";

const ProductDetail = () => {
  const { id } = useParams();

  // 2. Fetch the product data from the backend
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  // State for user selections
  const [selectedSize, setSelectedSize] = useState(null); // Store the whole size object
  const [selectedColor, setSelectedColor] = useState(null); // Store the whole colour object
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 3. Instantiate mutation hooks and get auth state
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();
  const [deleteFromWishlist, { isLoading: isDeletingFromWishlist }] =
    useDeleteFromWishlistMutation();

  // 4. Fetch wishlist data to determine if this product is wishlisted
  const { data: wishlistItems = [] } = useGetWishlistItemsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const wishlistItem = wishlistItems.find(
    (item) => item.product.id === product?.id
  );
  const isInWishlist = !!wishlistItem;

  // Reset selections when the product ID changes
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    setCurrentImageIndex(0);
  }, [id]);

  // 5. Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <h1 className="text-2xl font-display text-gold">Loading Product...</h1>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-rich-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-warm-white mb-4">
            Product Not Found
          </h1>
          <Link to="/" className="text-gold hover:text-gold/80">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    try {
      await addToCart({
        product_id: product.id,
        size_id: selectedSize.id,
        colour_id: selectedColor.id,
        quantity: quantity,
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to add to cart.");
    }
  };

  const handleWishlistToggle = async () => {
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

  const isActionLoading =
    isAddingToCart || isAddingToWishlist || isDeletingFromWishlist;

  return (
    <div className="min-h-screen bg-rich-black pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden mb-4">
              <img
                src={
                  product.images[currentImageIndex]?.image_url ||
                  "https://placehold.co/800x600/151515/FFF?text=Elysian"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="p-2 bg-rich-black/50 text-warm-white rounded-full hover:bg-rich-black/70"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="p-2 bg-rich-black/50 text-warm-white rounded-full hover:bg-rich-black/70"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-gold"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gold font-medium tracking-wider uppercase">
                {product.category.name}
              </p>
              <h1 className="text-4xl font-display font-bold text-warm-white mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gold mb-4">
                ${product.price}
              </p>
              <p className="text-warm-white/70 mb-6">{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-warm-white mb-3">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize?.id === size.id
                        ? "border-gold bg-gold/20 text-gold"
                        : "border-warm-white/20 text-warm-white hover:border-gold/50"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            {product.colours.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-warm-white mb-3">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colours.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.id === color.id
                          ? "border-gold scale-110"
                          : "border-warm-white/20"
                      }`}
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-warm-white mb-3">
                Quantity
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-warm-white/20 rounded-lg flex items-center justify-center hover:border-gold transition-colors"
                >
                  -
                </button>
                <span className="text-xl font-medium text-warm-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-warm-white/20 rounded-lg flex items-center justify-center hover:border-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={
                  isActionLoading ||
                  product.status !== "active" ||
                  !selectedSize ||
                  !selectedColor
                }
                className="flex-1 bg-gold text-rich-black py-3 rounded-lg font-medium tracking-wider hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart
                  ? "ADDING..."
                  : product.status === "active"
                  ? "ADD TO BAG"
                  : "OUT OF STOCK"}
              </button>
              <button
                onClick={handleWishlistToggle}
                disabled={isActionLoading}
                className={`p-3 border rounded-lg transition-colors disabled:opacity-50 ${
                  isInWishlist
                    ? "border-gold text-gold bg-gold/10"
                    : "border-warm-white/20 text-warm-white hover:border-gold/50"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Product Info Details */}
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-warm-white/60">Availability</span>
                <span
                  className={
                    product.status === "active"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {product.status === "active" ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-warm-white/60">Category</span>
                <span className="text-warm-white">{product.category.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note: "You May Also Like" section is removed for now, as it requires a separate API call. */}
      </div>
    </div>
  );
};

export default ProductDetail;
