
// src/App.jsx - Updated for Redux & RTK Query
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { appStore } from "./redux/store";
import { Toaster } from "react-hot-toast";

import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetail from "./components/product/ProductDetail";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/OrdersPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import { useGetMeQuery } from "./features/api/userApi";
import NewArrivalsPage from "./pages/NewArrivalPage";
import AdminAttributeManagement from "./pages/admin/AdminAttributesManagement";

const AppInitializer = ({ children }) => {

  const { isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rich-black">
        <h1 className="text-3xl font-display text-gold">Loading Elysian...</h1>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    // Wrap the entire application in the Redux Provider
    <Provider store={appStore}>
      {/* Keep the existing providers for now */}
      <AppInitializer>
        <Router>
          <div className="bg-rich-black text-warm-white">
            {/* Add the Toaster component for global notifications */}
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/men" element={<CollectionPage gender="men" />} />
                <Route
                  path="/women"
                  element={<CollectionPage gender="women" />}
                />
                <Route
                  path="/unisex"
                  element={<CollectionPage gender="unisex" />}
                />
                <Route
                  path="/new-arrivals"
                  element={<CollectionPage category="new-arrivals" />}
                />
                <Route
                  path="/trending"
                  element={<CollectionPage category="trending" />}
                />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute adminOnly>
                    <ProductManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/attributes"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminAttributeManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly>
                    <OrderManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AppInitializer>
    </Provider>
  );
}

export default App;
