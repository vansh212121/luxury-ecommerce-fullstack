// src/components/cart/CartItem.jsx - Updated for RTK Query
import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";

// This component is now "presentational". It receives functions as props.
const CartItem = ({ item, onUpdateQuantity, onRemoveItem, isUpdating }) => {
  const handleUpdate = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    // Call the function passed from the parent page
    onUpdateQuantity({
      cartItemId: item.id,
      updatedQuantity: { quantity: newQuantity },
    });
  };

  const handleRemove = () => {
    // Call the function passed from the parent page
    onRemoveItem(item.id);
  };

  // Safely access nested data from the API response
  const imageUrl =
    item.product?.images?.[0]?.image_url ||
    "https://placehold.co/96x128/151515/FFF?text=?";
  const productName = item.product?.name || "Product Name";
  const productPrice = item.product?.price || 0;
  const sizeName = item.size?.name || "N/A";

  return (
    <div className="flex items-center space-x-6 p-6 bg-charcoal/30 border border-warm-white/10 rounded-lg">
      <img
        src={imageUrl}
        alt={productName}
        className="w-24 h-32 object-cover rounded-lg"
      />

      <div className="flex-1">
        <h3 className="text-xl font-display font-medium text-warm-white mb-2">
          {productName}
        </h3>
        <p className="text-warm-white/60 mb-1">Size: {sizeName}</p>
        <p className="text-2xl font-semibold text-gold">
          ${productPrice.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleUpdate(item.quantity - 1)}
            disabled={isUpdating}
            className="w-8 h-8 border border-warm-white/20 rounded flex items-center justify-center text-warm-white hover:border-gold transition-colors disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xl font-medium text-warm-white w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdate(item.quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 border border-warm-white/20 rounded flex items-center justify-center text-warm-white hover:border-gold transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="text-warm-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
