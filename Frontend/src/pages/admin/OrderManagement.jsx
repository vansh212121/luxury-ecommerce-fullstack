
// src/pages/admin/OrderManagement.jsx - Fully Integrated with RTK Query and Detail Modal
import React, { useState } from "react";
import { Eye, X, Package, Clock } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import toast from "react-hot-toast";

// 1. Import all the necessary RTK Query hooks
import {
  useGetAllOrdersAdminQuery,
  useGetOrderByIdAdminQuery,
  useUpdateOrderStatusAdminMutation,
} from "@/features/api/orderApi";

// --- Order Detail Modal Component ---
const OrderDetailModal = ({ order, onClose, isLoading }) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-rich-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-gold font-display text-xl">
          Loading Order Details...
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-rich-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-charcoal/95 border border-warm-white/20 rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold text-warm-white">
              Order Details
            </h2>
            <p className="font-mono text-gold text-sm">#{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-warm-white/60 hover:text-warm-white"
          >
            <X />
          </button>
        </div>

        {/* Customer & Order Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-sm">
          <div className="bg-rich-black/50 p-4 rounded-lg">
            <p className="text-warm-white/60 mb-1">Customer</p>
            <p className="font-medium text-warm-white">
              User Name: {order.customer.name}
            </p>
          </div>
          <div className="bg-rich-black/50 p-4 rounded-lg">
            <p className="text-warm-white/60 mb-1">Order Date</p>
            <p className="font-medium text-warm-white">
              {new Date(order.order_date).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4 mb-6">
          <h3 className="font-bold text-warm-white/80 uppercase tracking-wider">
            Items
          </h3>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 p-3 bg-rich-black/50 rounded-lg"
            >
              <img
                src={
                  item.product.images[0]?.image_url ||
                  "https://placehold.co/64x64/151515/FFF?text=?"
                }
                alt={item.product.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-warm-white">
                  {item.product.name}
                </p>
                <p className="text-xs text-warm-white/60">
                  Category: {item.product.category.name}
                </p>
                <p className="text-xs text-warm-white/60">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gold">
                ${item.price_at_purchase.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-warm-white/10 pt-4 text-right">
          <p className="text-lg font-semibold text-warm-white">
            Total:{" "}
            <span className="text-gold">${order.total_amount.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Order Table Component ---
const OrderTable = ({ orders, onUpdateStatus, onViewDetails, isUpdating }) => {
  const statusOptions = ["processing", "shipped", "delivered", "cancelled"];

  const handleStatusChange = (orderId, newStatus) => {
    onUpdateStatus({ orderId, statusUpdate: { status: newStatus } });
  };

  return (
    <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-warm-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-warm-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-white/10">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-warm-white/5 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-gold">{order.id}</td>
                <td className="px-6 py-4 font-medium text-warm-white">
                  {order.customer.name}
                </td>
                <td className="px-6 py-4 text-gold font-semibold">
                  ${order.total_amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={isUpdating}
                    className="bg-transparent border border-warm-white/20 rounded px-3 py-1 text-warm-white focus:outline-none focus:border-gold disabled:opacity-50"
                  >
                    {statusOptions.map((status) => (
                      <option
                        key={status}
                        value={status}
                        className="bg-rich-black capitalize"
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-warm-white/60">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails(order.id)}
                    className="p-2 text-gold hover:bg-gold/10 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main Order Management Page ---
const OrderManagement = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { data: orders = [], isLoading, isError } = useGetAllOrdersAdminQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusAdminMutation();

  // Fetch details for a single order, but only when an ID is selected
  const { data: selectedOrderDetails, isLoading: isLoadingDetails } =
    useGetOrderByIdAdminQuery(selectedOrderId, { skip: !selectedOrderId });

  const handleUpdateStatus = async (updateData) => {
    try {
      await updateOrderStatus(updateData).unwrap();
      toast.success(
        `Order #${updateData.orderId} status updated successfully!`
      );
    } catch (err) {
      toast.error("Failed to update order status.");
    }
  };

  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  const stats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="flex h-screen bg-rich-black">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-display font-bold text-warm-white mb-8">
            Order Management
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-charcoal/50 p-6 rounded-lg">
              <p className="text-warm-white/60 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-warm-white">
                {isLoading ? "..." : stats.total}
              </p>
            </div>
            <div className="bg-charcoal/50 p-6 rounded-lg">
              <p className="text-warm-white/60 text-sm">Processing</p>
              <p className="text-3xl font-bold text-yellow-400">
                {isLoading ? "..." : stats.processing}
              </p>
            </div>
            <div className="bg-charcoal/50 p-6 rounded-lg">
              <p className="text-warm-white/60 text-sm">Shipped</p>
              <p className="text-3xl font-bold text-blue-400">
                {isLoading ? "..." : stats.shipped}
              </p>
            </div>
            <div className="bg-charcoal/50 p-6 rounded-lg">
              <p className="text-warm-white/60 text-sm">Delivered</p>
              <p className="text-3xl font-bold text-green-400">
                {isLoading ? "..." : stats.delivered}
              </p>
            </div>
          </div>

          {/* Orders Table */}
          {isLoading ? (
            <div className="text-center p-8 text-gold">Loading orders...</div>
          ) : isError ? (
            <div className="text-center p-8 text-red-500">
              Failed to load orders.
            </div>
          ) : (
            <OrderTable
              orders={orders}
              onUpdateStatus={handleUpdateStatus}
              onViewDetails={handleViewDetails}
              isUpdating={isUpdating}
            />
          )}
        </div>
      </div>

      {/* Conditionally render the modal */}
      {selectedOrderId && (
        <OrderDetailModal
          order={selectedOrderDetails}
          onClose={handleCloseModal}
          isLoading={isLoadingDetails}
        />
      )}
    </div>
  );
};

export default OrderManagement;
