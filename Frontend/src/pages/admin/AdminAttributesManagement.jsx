// src/pages/admin/AdminAttributeManagement.jsx - New Page

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import toast from "react-hot-toast";

// 1. Import all the necessary RTK Query hooks
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/features/api/categoryApi";
import {
  useGetSizesQuery,
  useCreateSizeMutation,
  useDeleteSizeMutation,
} from "@/features/api/sizeApi";
import {
  useGetColoursQuery,
  useCreateColourMutation,
  useDeleteColourMutation,
} from "@/features/api/colourApi";

// A reusable modal form for adding/editing attributes
const AttributeForm = ({ activeTab, onSave, onCancel, isLoading }) => {
  const [name, setName] = useState("");
  const [hexCode, setHexCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const data =
      activeTab === "colours" ? { name, hex_code: hexCode } : { name };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-rich-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-charcoal/95 border border-warm-white/20 rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-bold text-warm-white capitalize">
            Add New {activeTab.slice(0, -1)}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-warm-white/60 hover:text-warm-white"
          >
            <X />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-white/80 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
            />
          </div>
          {activeTab === "colours" && (
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Hex Code
              </label>
              <input
                type="text"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                required
                placeholder="#FFFFFF"
                className="w-full bg-transparent border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white"
              />
            </div>
          )}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gold text-rich-black py-3 rounded-lg font-medium hover:bg-gold/90 disabled:bg-gold/50"
            >
              {isLoading ? "SAVING..." : "SAVE"}
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

const AdminAttributeManagement = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [showForm, setShowForm] = useState(false);

  // 2. Fetch data for all attribute types
  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: sizes = [], isLoading: isLoadingSizes } = useGetSizesQuery();
  const { data: colours = [], isLoading: isLoadingColours } =
    useGetColoursQuery();

  // 3. Instantiate all mutation hooks
  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [createSize, { isLoading: isCreatingSize }] = useCreateSizeMutation();
  const [deleteSize] = useDeleteSizeMutation();
  const [createColour, { isLoading: isCreatingColour }] =
    useCreateColourMutation();
  const [deleteColour] = useDeleteColourMutation();

  // 4. Create a configuration object to easily switch between attribute types
  const config = {
    categories: {
      data: categories,
      isLoading: isLoadingCategories,
      createMutation: createCategory,
      deleteMutation: deleteCategory,
      isCreating: isCreatingCategory,
    },
    sizes: {
      data: sizes,
      isLoading: isLoadingSizes,
      createMutation: createSize,
      deleteMutation: deleteSize,
      isCreating: isCreatingSize,
    },
    colours: {
      data: colours,
      isLoading: isLoadingColours,
      createMutation: createColour,
      deleteMutation: deleteColour,
      isCreating: isCreatingColour,
    },
  };

  const activeConfig = config[activeTab];

  const handleSave = async (data) => {
    try {
      await activeConfig.createMutation(data).unwrap();
      toast.success(`${activeTab.slice(0, -1)} created successfully!`);
      setShowForm(false);
    } catch (err) {
      toast.error(
        err?.data?.detail || `Failed to create ${activeTab.slice(0, -1)}.`
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${activeTab.slice(0, -1)}?`
      )
    ) {
      try {
        await activeConfig.deleteMutation(id).unwrap();
        toast.success(`${activeTab.slice(0, -1)} deleted successfully.`);
      } catch (err) {
        toast.error(
          err?.data?.detail || `Failed to delete ${activeTab.slice(0, -1)}.`
        );
      }
    }
  };

  return (
    <div className="flex h-screen bg-rich-black">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-display font-bold text-warm-white">
              Catalog Attributes
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gold text-rich-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-gold/90"
            >
              <Plus className="w-5 h-5" />
              <span className="capitalize">
                Add New {activeTab.slice(0, -1)}
              </span>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-warm-white/20 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("categories")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "categories"
                    ? "border-gold text-gold"
                    : "border-transparent text-warm-white/60 hover:text-warm-white"
                }`}
              >
                CATEGORIES
              </button>
              <button
                onClick={() => setActiveTab("sizes")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "sizes"
                    ? "border-gold text-gold"
                    : "border-transparent text-warm-white/60 hover:text-warm-white"
                }`}
              >
                SIZES
              </button>
              <button
                onClick={() => setActiveTab("colours")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "colours"
                    ? "border-gold text-gold"
                    : "border-transparent text-warm-white/60 hover:text-warm-white"
                }`}
              >
                COLOURS
              </button>
            </nav>
          </div>

          {/* Table */}
          <div className="bg-charcoal/50 rounded-xl border border-warm-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-warm-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                    Name
                  </th>
                  {activeTab === "colours" && (
                    <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                      Hex Code
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-white/10">
                {activeConfig.isLoading ? (
                  <tr>
                    <td colSpan="3" className="text-center p-8 text-gold">
                      Loading...
                    </td>
                  </tr>
                ) : (
                  activeConfig.data.map((item) => (
                    <tr key={item.id} className="hover:bg-warm-white/5">
                      <td className="px-6 py-4 font-medium text-warm-white">
                        {item.name}
                      </td>
                      {activeTab === "colours" && (
                        <td className="px-6 py-4 font-mono text-warm-white/80 flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: item.hex_code }}
                          ></span>
                          {item.hex_code}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showForm && (
        <AttributeForm
          activeTab={activeTab}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          isLoading={activeConfig.isCreating}
        />
      )}
    </div>
  );
};

export default AdminAttributeManagement;
