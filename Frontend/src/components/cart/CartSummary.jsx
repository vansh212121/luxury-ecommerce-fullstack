// src/components/cart/CartSummary.jsx - Updated for Checkout
import React from "react";
import { Link } from "react-router-dom";

const CartSummary = ({
  subtotal,
  tax,
  shipping,
  total,
  giftNote,
  setGiftNote,
  onCheckout, // 1. Accept the checkout handler function
  isCheckingOut, // 2. Accept the loading state
}) => {
  return (
    <div className="bg-charcoal/50 backdrop-blur-sm p-8 rounded-lg border border-warm-white/10 sticky top-24">
      <h2 className="text-2xl font-display font-bold text-warm-white mb-6">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-warm-white/80">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-warm-white/80">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-warm-white/80">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="border-t border-warm-white/20 pt-4 flex justify-between text-xl font-semibold text-warm-white">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {shipping === 0 && subtotal > 0 && (
        <p className="text-sm text-gold mb-4">
          ✨ Complimentary shipping on orders over $100
        </p>
      )}

      <div className="mb-6">
        <label className="block text-sm text-warm-white/80 mb-2">
          Gift Message (Optional)
        </label>
        <textarea
          value={giftNote}
          onChange={(e) => setGiftNote(e.target.value)}
          className="w-full bg-transparent border border-warm-white/20 rounded-md px-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold"
          rows="3"
          placeholder="Add a personal message..."
        />
      </div>

      <div className="space-y-4">
        {/* 3. Wire up the button to the new props */}
        <button
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="w-full bg-gold text-rich-black py-4 font-medium tracking-wider hover:bg-gold/90 transition-all duration-300 disabled:bg-gold/50 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
        </button>
        <Link
          to="/women"
          className="w-full block text-center border border-warm-white/20 text-warm-white py-4 hover:bg-warm-white/10 transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
