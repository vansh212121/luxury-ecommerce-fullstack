
// src/components/admin/ProductForm.jsx - Fully Integrated with RTK Query

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

// 1. Import the hooks to get filter data
import { useGetCategoriesQuery } from "@/features/api/categoryApi";
import { useGetSizesQuery } from "@/features/api/sizeApi";
import { useGetColoursQuery } from "@/features/api/colourApi";

const ProductForm = ({ product, onSave, onCancel, isLoading }) => {
  // 2. Fetch all available options for our form selectors
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: allSizes = [] } = useGetSizesQuery();
  const { data: allColours = [] } = useGetColoursQuery();

  // 3. Set up the form's state with all required fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discount_price: null,
    stock: 0,
    brand: "",
    gender: "unisex",
    status: "active",
    category_id: "",
    size_ids: [],
    colour_ids: [],
    images: [{ image_url: "" }],
  });

  // 4. Pre-fill the form if we are editing an existing product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        discount_price: product.discount_price,
        stock: product.stock || 0,
        brand: product.brand || "",
        gender: product.gender || "unisex",
        status: product.status || "active",
        category_id: product.category?.id || "",
        size_ids: product.sizes?.map((s) => s.id) || [],
        colour_ids: product.colours?.map((c) => c.id) || [],
        images:
          product.images?.length > 0
            ? product.images.map((img) => ({ image_url: img.image_url }))
            : [{ image_url: "" }],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (type, id) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((item_id) => item_id !== id)
        : [...prev[type], id],
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = { image_url: value };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { image_url: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      discount_price: formData.discount_price
        ? parseFloat(formData.discount_price)
        : null,
      stock: parseInt(formData.stock, 10),
      category_id: parseInt(formData.category_id, 10),
      images: formData.images.filter((img) => img.image_url.trim() !== ""), // Filter out empty image URLs
    };
    onSave(submissionData);
  };

  return (
    <div className="fixed inset-0 bg-rich-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-charcoal/95 backdrop-blur-sm border border-warm-white/20 rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-warm-white">
            {product ? "Edit Luxury Item" : "Add New Item"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-warm-white/60 hover:text-warm-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Brand */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
            />
          </div>

          {/* Price, Discount Price, Stock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Discount Price ($)
              </label>
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price || ""}
                onChange={handleChange}
                step="0.01"
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              />
            </div>
          </div>

          {/* Category, Gender, Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              >
                <option value="" disabled className="bg-rich-black">
                  Select...
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-rich-black">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              >
                <option value="unisex" className="bg-rich-black">
                  Unisex
                </option>
                <option value="men" className="bg-rich-black">
                  Men
                </option>
                <option value="women" className="bg-rich-black">
                  Women
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              >
                <option value="active" className="bg-rich-black">
                  Active
                </option>
                <option value="inactive" className="bg-rich-black">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((size) => (
                <button
                  type="button"
                  key={size.id}
                  onClick={() => handleMultiSelectChange("size_ids", size.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.size_ids.includes(size.id)
                      ? "bg-gold text-rich-black"
                      : "bg-warm-white/10 text-warm-white hover:bg-warm-white/20"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colours */}
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Available Colours
            </label>
            <div className="flex flex-wrap gap-2">
              {allColours.map((colour) => (
                <button
                  type="button"
                  key={colour.id}
                  onClick={() =>
                    handleMultiSelectChange("colour_ids", colour.id)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    formData.colour_ids.includes(colour.id)
                      ? "bg-gold text-rich-black"
                      : "bg-warm-white/10 text-warm-white hover:bg-warm-white/20"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/20"
                    style={{ backgroundColor: colour.hex_code }}
                  ></span>
                  {colour.name}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2 uppercase tracking-wider">
              Image URLs
            </label>
            <div className="space-y-2">
              {formData.images.map((img, index) => (
                <input
                  key={index}
                  type="text"
                  value={img.image_url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder={`Image URL ${index + 1}`}
                  className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addImageField}
              className="mt-2 text-sm text-gold hover:text-gold/80"
            >
              + Add another image
            </button>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gold text-rich-black py-3 rounded-lg font-medium tracking-wider hover:bg-gold/90 transition-colors disabled:bg-gold/50"
            >
              {isLoading
                ? product
                  ? "UPDATING..."
                  : "ADDING..."
                : product
                ? "UPDATE ITEM"
                : "ADD ITEM"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-warm-white/20 text-warm-white py-3 rounded-lg hover:bg-warm-white/10"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
