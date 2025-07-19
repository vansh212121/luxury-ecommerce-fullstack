
// src/pages/CartPage.jsx - Fully Integrated with Checkout
import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

import {
  useGetCartItemsQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} from "@/features/api/cartApi";
// 1. Import the createOrder mutation hook
import { useCreateOrderMutation } from "@/features/api/orderApi";

const CartPage = () => {
  const [giftNote, setGiftNote] = useState("");
  const navigate = useNavigate();

  const { data: cartItems = [], isLoading, isError } = useGetCartItemsQuery();
  const [updateCartItem, { isLoading: isUpdating }] =
    useUpdateCartItemMutation();
  const [deleteCartItem, { isLoading: isDeleting }] =
    useDeleteCartItemMutation();

  // 2. Instantiate the createOrder mutation hook
  const [createOrder, { isLoading: isCheckingOut, isSuccess: isOrderSuccess }] =
    useCreateOrderMutation();

  const handleUpdateQuantity = async (updateData) => {
    try {
      await updateCartItem(updateData).unwrap();
    } catch {
      toast.error("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await deleteCartItem(cartItemId).unwrap();
      toast.success("Item removed from cart.");
    } catch {
      toast.error("Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      const deletionPromises = cartItems.map((item) =>
        deleteCartItem(item.id).unwrap()
      );
      try {
        await Promise.all(deletionPromises);
        toast.success("Cart cleared successfully.");
      } catch {
        toast.error("Failed to clear cart.");
      }
    }
  };

  // 3. Create the checkout handler function
  const handleCheckout = async () => {
    try {
      await createOrder().unwrap();
      // The onQueryStarted logic in orderApi will automatically invalidate the cart
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to create order.");
    }
  };

  // 4. Use useEffect to handle navigation after a successful order
  useEffect(() => {
    if (isOrderSuccess) {
      toast.success("Order placed successfully!");
      navigate("/orders"); // Redirect to order history page
    }
  }, [isOrderSuccess, navigate]);

  const { subtotal, tax, shipping, total } = useMemo(() => {
    const sub = cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    const taxRate = 0.08;
    const shippingCost = sub > 100 || sub === 0 ? 0 : 25;
    return {
      subtotal: sub,
      tax: sub * taxRate,
      shipping: shippingCost,
      total: sub + sub * taxRate + shippingCost,
    };
  }, [cartItems]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gold font-display text-2xl">
        Loading Your Collection...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-display text-2xl">
        Failed to load your cart.
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-rich-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h1 className="text-4xl font-display font-bold text-warm-white mb-4">
            Your Collection is Empty
          </h1>
          <p className="text-lg text-warm-white/60 mb-8">
            Discover exquisite pieces to add to your luxury collection
          </p>
          <Link
            to="/women"
            className="bg-gold text-rich-black px-8 py-4 font-medium tracking-wider hover:bg-gold/90"
          >
            EXPLORE COLLECTIONS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-display font-bold text-warm-white mb-8">
          Your Collection
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  isUpdating={isUpdating || isDeleting}
                />
              ))}
            </div>
            <button
              onClick={handleClearCart}
              className="mt-8 text-warm-white/60 hover:text-warm-white flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Collection</span>
            </button>
          </div>
          {/* Order Summary */}
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            total={total}
            giftNote={giftNote}
            setGiftNote={setGiftNote}
            onCheckout={handleCheckout} // 5. Pass the handler and loading state down
            isCheckingOut={isCheckingOut}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
