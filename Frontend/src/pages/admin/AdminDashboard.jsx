
// src/pages/admin/AdminDashboard.jsx - Corrected with specific API calls
import React from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// 1. Import all the necessary RTK Query hooks
import { useGetDashboardStatsQuery } from '@/features/api/dashboardApi';
import { useGetAllOrdersAdminQuery } from '@/features/api/orderApi';
import { useGetProductsQuery } from '@/features/api/productApi';

// A reusable component for the main statistic cards
const StatCard = ({ icon: Icon, title, value, colorClass, isLoading }) => {
  return (
    <div className="bg-charcoal/50 backdrop-blur-sm p-6 rounded-lg border border-warm-white/10 flex items-center justify-between">
      <div>
        <p className="text-sm text-warm-white/60 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-warm-white mt-1">{isLoading ? "..." : value}</p>
      </div>
      <div className={`p-3 rounded-full ${colorClass}`}>
        <Icon className="w-6 h-6 text-warm-white" />
      </div>
    </div>
  );
};

// Mock data for charts
const salesData = [
  { name: "Jan", sales: 4000 }, { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 }, { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 }, { name: "Jun", sales: 5500 },
];

const AdminDashboard = () => {
  // 2. Call the hooks with specific parameters for this page's needs
  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStatsQuery();
  
  // Fetch all orders to be sliced for "Recent Orders"
  const { data: allOrders = [], isLoading: isLoadingOrders } = useGetAllOrdersAdminQuery();
  // THE FIX: The admin orders endpoint returns a simple array. We slice it directly.
  const recentOrders = allOrders.slice(0, 5);

  // Fetch the 3 newest products
  const { data: recentProductsData, isLoading: isLoadingProducts } = useGetProductsQuery({ sort_by: 'created_at', limit: 3 });
  const recentProducts = recentProductsData?.items || [];

  const isLoading = isLoadingStats || isLoadingOrders || isLoadingProducts;

  return (
    <div className="flex h-screen bg-rich-black">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-4xl font-display font-bold text-warm-white mb-8">
            Dashboard Overview
          </h1>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard icon={DollarSign} title="Total Income" value={`$${stats?.total_income?.toFixed(2) || "0.00"}`} colorClass="bg-green-500/20" isLoading={isLoading} />
            <StatCard icon={ShoppingCart} title="Total Sales" value={stats?.total_sales || 0} colorClass="bg-blue-500/20" isLoading={isLoading} />
            <StatCard icon={Package} title="Total Products" value={stats?.total_products || 0} colorClass="bg-yellow-500/20" isLoading={isLoading} />
            <StatCard icon={Users} title="Total Customers" value={stats?.total_customers || 0} colorClass="bg-purple-500/20" isLoading={isLoading} />
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Chart - Main Section */}
            <div className="lg:col-span-2 bg-charcoal/50 backdrop-blur-sm p-6 rounded-lg border border-warm-white/10">
              <h2 className="text-2xl font-display font-bold text-warm-white mb-6">Sales Performance</h2>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DBAB58" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#DBAB58" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.6)" />
                    <YAxis stroke="rgba(255, 255, 255, 0.6)" />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(21, 21, 21, 0.9)", borderColor: "rgba(219, 171, 88, 0.4)" }} cursor={{fill: 'rgba(219, 171, 88, 0.1)'}}/>
                    <Bar dataKey="sales" fill="url(#colorSales)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity Column */}
            <div className="space-y-8">
              {/* Recent Orders */}
              <div className="bg-charcoal/50 backdrop-blur-sm p-6 rounded-lg border border-warm-white/10">
                <h2 className="text-xl font-display font-bold text-warm-white mb-4">Recent Orders</h2>
                <div className="space-y-4">
                  {isLoadingOrders ? (
                    <p className="text-warm-white/60">Loading...</p>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-warm-white">#{order.id}</p>
                          <p className="text-warm-white/60">{order.customer.name}</p>
                        </div>
                        <p className="font-medium text-gold">${order.total_amount.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-warm-white/60">No recent orders.</p>
                  )}
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-charcoal/50 backdrop-blur-sm p-6 rounded-lg border border-warm-white/10">
                <h2 className="text-xl font-display font-bold text-warm-white mb-4">Recent Additions</h2>
                <div className="space-y-4">
                  {isLoadingProducts ? (
                    <p className="text-warm-white/60">Loading...</p>
                  ) : recentProducts.length > 0 ? (
                    recentProducts.map((product) => (
                      <div key={product.id} className="flex items-center space-x-4">
                        <img src={product.images[0]?.image_url || 'https://placehold.co/48x48/151515/FFF?text=?'} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-warm-white text-sm">{product.name}</p>
                          <p className="text-sm text-gold">${product.price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-warm-white/60">No recent products.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
