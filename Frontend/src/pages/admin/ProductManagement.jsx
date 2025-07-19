
// src/pages/admin/ProductManagement.jsx - Fully Integrated with Pagination
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import ProductForm from "../../components/admin/ProductForm";
import ProductTable from "../../components/admin/ProductTable"; // 1. Import the new table component
import Pagination from "../../components/common/Pagination"; // 2. Import the pagination component
import toast from "react-hot-toast";

import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/features/api/productApi";

const PAGE_SIZE = 10; // Set how many products to show per page in the admin panel

const ProductManagement = () => {
  // 3. Hooks to manage page state from the URL
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);

  // 4. Fetch the paginated list of products for the current page
  const { data, isLoading, isError } = useGetProductsQuery({
    page: currentPage,
    limit: PAGE_SIZE,
  });
  const products = data?.items || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to soft-delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product marked as inactive.");
      } catch (err) {
        toast.error("Failed to delete product.");
      }
    }
  };

  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct({
          productId: editingProduct.id,
          updatedData: productData,
        }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(productData).unwrap();
        toast.success("Product created successfully!");
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to save product.");
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handlePageChange = (newPage) => {
    navigate(`/admin/products?page=${newPage}`);
  };

  return (
    <div className="flex h-screen bg-rich-black">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-display font-bold text-warm-white">
              Product Management
            </h1>
            <button
              onClick={handleAddNew}
              className="bg-gold text-rich-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-gold/90"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-charcoal/50 p-6 rounded-lg">
              <p className="text-warm-white/60 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-warm-white">
                {isLoading ? "..." : totalProducts}
              </p>
            </div>
            <div className="bg-charcoal/50 p-6 rounded-lg">
              <p className="text-warm-white/60 text-sm">Active</p>
              <p className="text-3xl font-bold text-gold">
                {isLoading
                  ? "..."
                  : products.filter((p) => p.status === "active").length}
              </p>
            </div>
            <div className="bg-charcoal/50 p-6 rounded-lg">
              <p className="text-warm-white/60 text-sm">Inactive</p>
              <p className="text-3xl font-bold text-warm-white">
                {isLoading
                  ? "..."
                  : products.filter((p) => p.status === "inactive").length}
              </p>
            </div>
          </div>

          {/* Products Table */}
          {isLoading ? (
            <div className="text-center p-8 text-gold">Loading products...</div>
          ) : isError ? (
            <div className="text-center p-8 text-red-500">
              Failed to load products.
            </div>
          ) : (
            <>
              <ProductTable
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}

          {showForm && (
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              isLoading={isCreating || isUpdating}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
