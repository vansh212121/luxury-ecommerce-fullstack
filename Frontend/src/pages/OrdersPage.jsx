
// src/pages/OrdersPage.jsx - Redesigned and API-Integrated
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  Eye,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

// 1. Import the RTK Query hook
import { useGetMyOrdersQuery } from "@/features/api/orderApi";

const getStatusIcon = (status) => {
  switch (status) {
    case "processing":
      return <Clock className="w-5 h-5" />;
    case "shipped":
      return <Truck className="w-5 h-5" />;
    case "delivered":
      return <CheckCircle className="w-5 h-5" />;
    default:
      return <Package className="w-5 h-5" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "processing":
      return "text-yellow-400";
    case "shipped":
      return "text-blue-400";
    case "delivered":
      return "text-green-400";
    default:
      return "text-warm-white/60";
  }
};

const OrdersPage = () => {
  // 2. Fetch the user's order history from the backend
  const { data: orders = [], isLoading, isError } = useGetMyOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Set the first order as selected by default when data loads
  React.useEffect(() => {
    if (orders.length > 0 && !selectedOrder) {
      setSelectedOrder(orders[0]);
    }
  }, [orders, selectedOrder]);

  // 3. Handle loading, error, and empty states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gold font-display text-2xl">
        Loading Your Order History...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-display text-2xl">
        Failed to load your orders.
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-rich-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-20 h-20 mx-auto text-gold/30 mb-6" />
          <h1 className="text-4xl font-display font-bold text-warm-white mb-4">
            No Orders Yet
          </h1>
          <p className="text-lg text-warm-white/60 mb-8">
            Your luxury orders will appear here
          </p>
          <Link
            to="/women"
            className="bg-gold text-rich-black px-8 py-4 font-medium tracking-wider hover:bg-gold/90"
          >
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rich-black pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold text-warm-white mb-4">
            Order History
          </h1>
          <p className="text-xl text-warm-white/70">
            Track your luxury purchases and reorder your favorites
          </p>
        </div>

        {/* 4. New Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order List */}
          <div className="lg:col-span-1">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                    selectedOrder?.id === order.id
                      ? "bg-gold/10 border-gold/50"
                      : "bg-charcoal/50 border-warm-white/10 hover:border-gold/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-warm-white">
                      Order #{order.id}
                    </p>
                    <p className="font-semibold text-gold">
                      ${order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm text-warm-white/60 mb-2">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                  <div
                    className={`flex items-center space-x-2 text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Order Details */}
          <div className="lg:col-span-2">
            {selectedOrder ? (
              <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-warm-white/10 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-display font-bold text-warm-white mb-1">
                      Order #{selectedOrder.id}
                    </h3>
                    <p className="text-warm-white/60">
                      Placed on{" "}
                      {new Date(selectedOrder.order_date).toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedOrder.status
                    )} bg-rich-black/50`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    <span className="capitalize">{selectedOrder.status}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h4 className="font-bold text-warm-white/80 uppercase tracking-wider">
                    Items
                  </h4>
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-3 bg-rich-black/30 rounded-lg"
                    >
                      <img
                        src={
                          item.product.images[0]?.image_url ||
                          "https://placehold.co/64x64/151515/FFF?text=?"
                        }
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-warm-white">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-warm-white/60">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-gold font-semibold">
                        ${(item.price_at_purchase * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-warm-white/10 pt-4 flex justify-between items-center">
                  <button className="flex items-center space-x-2 text-warm-white/80 hover:text-gold transition-colors text-sm">
                    <RefreshCw className="w-4 h-4" />
                    <span>Reorder</span>
                  </button>
                  <p className="text-xl font-semibold text-warm-white">
                    Total:{" "}
                    <span className="text-gold">
                      ${selectedOrder.total_amount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-charcoal/50 rounded-xl border border-warm-white/10">
                <p className="text-warm-white/60">
                  Select an order to see details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
