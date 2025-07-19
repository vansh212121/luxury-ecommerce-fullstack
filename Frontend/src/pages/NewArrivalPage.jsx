
// src/pages/NewArrivalsPage.jsx - Updated with RTK Query
import React from "react";
import ProductCard from "../components/product/ProductCard";
import { Clock, Sparkles } from "lucide-react";
import { useGetProductsQuery } from "@/features/api/productApi"; // 1. Import the hook

const NewArrivalsPage = () => {
  // 2. Call the hook to fetch the latest products
  // We pass the sort_by parameter to our backend API
  const {
    data: newProducts = [],
    isLoading,
    isError,
  } = useGetProductsQuery({ sort_by: "created_at" });

  // 3. Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rich-black">
        <h2 className="text-2xl text-gold font-display">
          Loading New Arrivals...
        </h2>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rich-black">
        <h2 className="text-2xl text-red-500 font-display">
          Failed to load products.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Sparkles className="w-12 h-12 text-gold" />
          </div>
          <h1 className="text-5xl font-display font-bold text-warm-white mb-4">
            New Arrivals
          </h1>
          <p className="text-xl text-warm-white/70 max-w-2xl mx-auto">
            Discover our latest luxury pieces, fresh from the runway and ready
            to elevate your style
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {newProducts.map((product) => (
            <div key={product.id} className="group">
              <ProductCard product={product} />
              <div className="mt-4 flex items-center text-sm text-gold">
                <Clock className="w-4 h-4 mr-2" />
                <span>New This Week</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {newProducts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-2xl text-warm-white/60">
              New arrivals coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivalsPage;
