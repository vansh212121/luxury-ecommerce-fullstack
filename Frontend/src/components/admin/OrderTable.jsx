// src/components/admin/OrderTable.jsx - Updated for RTK Query
import React from "react";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";

const OrderTable = ({ orders, onUpdateStatus, isUpdating }) => {
  const statusOptions = ["processing", "shipped", "delivered", "cancelled"];
  const statusColors = {
    processing: "bg-yellow-900/50 text-yellow-400",
    shipped: "bg-blue-900/50 text-blue-400",
    delivered: "bg-green-900/50 text-green-400",
    cancelled: "bg-red-900/50 text-red-400",
  };

  const handleStatusChange = (orderId, newStatus) => {
    // Call the handler function passed from the parent component
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
                Customer
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
                <td className="px-6 py-4">
                  <div>
                    {/* Note: Customer info is not in the OrderResponse, this would be an enhancement */}
                    <p className="font-medium text-warm-white">
                      User Name: {order.customer.name}
                    </p>
                  </div>
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
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gold hover:bg-gold/10 rounded transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* Note: Deleting orders is generally not recommended. We can use the 'cancelled' status instead. */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;
