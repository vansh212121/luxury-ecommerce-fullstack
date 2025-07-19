// src/components/admin/AdminSidebar.jsx - Updated for Redux
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  LogOut,
  Crown,
  Settings2,
} from "lucide-react";
import { useDispatch } from "react-redux"; // 1. Import Redux hooks
import { userLoggedOut } from "../../features/authSlice"; // 2. Import the logout action

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    {
      name: "Attribute Management",
      href: "/admin/attributes",
      icon: Settings2,
    },
  ];

  const handleLogout = () => {
    // 3. Dispatch the logout action to clear the Redux state
    dispatch(userLoggedOut());
    // Manually clear the token from localStorage
    localStorage.removeItem("authToken");
    // Navigate the user back to the admin login page
    navigate("/admin/login");
  };

  return (
    <div className="w-72 bg-charcoal/50 backdrop-blur-sm border-r border-warm-white/10">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Crown className="w-8 h-8 text-gold" />
          <div>
            <h1 className="text-2xl font-display font-bold text-warm-white">
              ELYSIAN
            </h1>
            <p className="text-sm text-warm-white/60">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gold/20 text-gold border-l-4 border-gold"
                    : "text-warm-white/70 hover:bg-warm-white/10 hover:text-warm-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout} // 4. Use the new logout handler
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
