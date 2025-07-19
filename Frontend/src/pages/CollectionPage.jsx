// src/pages/CollectionPage.jsx - Fully Fixed, Polished, and Integrated
import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/common/Pagination";
import { Filter, Search } from "lucide-react";

import { useGetProductsQuery } from "@/features/api/productApi";
import { useGetCategoriesQuery } from "@/features/api/categoryApi";
import { useGetSizesQuery } from "@/features/api/sizeApi";
import { useGetColoursQuery } from "@/features/api/colourApi";
import { useDebounce } from "use-debounce";

const PAGE_SIZE = 16;

const CollectionPage = ({ gender: propGender, category: propCategory }) => {
  const { gender: urlGender, category: urlCategory } = useParams();
  const gender = propGender || urlGender;
  const category = propCategory || urlCategory;
  const [searchTerm, setSearchTerm] = useState("");
  // THE FIX: Debounce the search term to prevent API calls on every keystroke
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms delay

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);

  const [filters, setFilters] = useState({
    size_ids: [],
    category_ids: [],
    colour_ids: [],
    priceRange: [0, 1000],
    sortBy: "newest",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);



  // Updated queryParams in CollectionPage.jsx
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: PAGE_SIZE,
      status: "active",
      search: debouncedSearchTerm,
    };

    // Only add filters if they have values
    if (filters.size_ids.length > 0) {
      params.size_ids = filters.size_ids;
    }
    if (filters.category_ids.length > 0) {
      params.category_ids = filters.category_ids;
    }
    if (filters.colour_ids.length > 0) {
      params.colour_ids = filters.colour_ids;
    }

    // Add price filters only if different from defaults
    if (filters.priceRange[0] > 0) {
      params.min_price = filters.priceRange[0];
    }
    if (filters.priceRange[1] < 1000) {
      params.max_price = filters.priceRange[1];
    }

    // Add gender filter
    if (gender && gender !== "all") {
      params.gender = gender;
    }

    // Handle sorting
    if (category === "new-arrivals") {
      params.sort_by = "created_at";
    } else if (filters.sortBy && filters.sortBy !== "newest") {
      params.sort_by = filters.sortBy;
    } else {
      // Default to created_at for "newest"
      params.sort_by = "created_at";
    }

    return params;
  }, [gender, category, currentPage, filters, debouncedSearchTerm]);

  // Use `isFetching` to track loading on both initial load and subsequent re-fetches.
  const { data, isLoading, isFetching, isError } =
    useGetProductsQuery(queryParams);
  const products = data?.items || [];
  const totalProducts = data?.total || 0;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);

  const { data: categoryOptions = [] } = useGetCategoriesQuery();
  const { data: sizeOptions = [] } = useGetSizesQuery();
  const { data: colorOptions = [] } = useGetColoursQuery();

  const handlePageChange = (newPage) => {
    navigate(`${location.pathname}?page=${newPage}`);
  };

  const getTitle = () => {
    switch (category) {
      case "new-arrivals":
        return "New Arrivals";
      case "trending":
        return "Trending Collection";
      default:
        return `${
          gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "All"
        } ${category || "Collection"}`;
    }
  };

  const toggleFilter = (type, id) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((item_id) => item_id !== id)
        : [...prev[type], id],
    }));
  };

  let content;
  if (isLoading) {
    // Only show this big loader on the very first load
    content = (
      <div className="text-center py-20 w-full">
        <h3 className="text-2xl font-display font-bold text-gold">
          Loading Pieces...
        </h3>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="text-center py-20 w-full">
        <h3 className="text-2xl font-display font-bold text-red-500">
          Failed to Load Collection
        </h3>
      </div>
    );
  } else if (products.length === 0) {
    content = (
      <div className="text-center py-20 w-full">
        <div className="text-6xl mb-6">🔍</div>
        <h3 className="text-2xl font-display font-bold text-warm-white mb-4">
          No Pieces Found
        </h3>
        <p className="text-warm-white/60 mb-8">
          Try adjusting your search or filters
        </p>
        <button
          onClick={() =>
            setFilters({
              size_ids: [],
              category_ids: [],
              colour_ids: [],
              priceRange: [0, 1000],
              sortBy: "newest",
            })
          }
          className="bg-gold text-rich-black px-6 py-3 font-medium hover:bg-gold/90 transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  } else {
    content = <ProductGrid products={products} />;
  }

  return (
    <div className="min-h-screen bg-rich-black pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold text-warm-white mb-4">
            {getTitle()}
          </h1>
          <p className="text-xl text-warm-white/70">
            {isFetching
              ? "..."
              : `Showing ${products.length} of ${totalProducts} exquisite pieces`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-white/60" />
            <input
              type="text"
              value={searchTerm} // Use the immediate search term for the input value
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search luxury pieces..."
              className="w-full bg-transparent border border-warm-white/20 rounded-lg pl-12 pr-4 py-3 text-warm-white placeholder-warm-white/50 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 bg-charcoal/50 border border-warm-white/20 px-6 py-3 rounded-lg text-warm-white hover:border-gold transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>
              Filters (
              {filters.size_ids.length +
                filters.category_ids.length +
                filters.colour_ids.length}
              )
            </span>
          </button>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="bg-charcoal/50 border border-warm-white/20 rounded-lg px-4 py-3 text-warm-white focus:outline-none focus:border-gold"
          >
            <option value="newest" className="bg-rich-black">
              Newest First
            </option>
            <option value="price-low" className="bg-rich-black">
              Price: Low to High
            </option>
            <option value="price-high" className="bg-rich-black">
              Price: High to Low
            </option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {isFilterOpen && (
            <div className="lg:w-80">
              <div className="bg-charcoal/50 backdrop-blur-sm p-6 rounded-xl border border-warm-white/10 space-y-6">
                <h3 className="text-lg font-medium text-warm-white uppercase tracking-wider">
                  Filters
                </h3>
                <div>
                  <h4 className="text-sm font-medium text-warm-white/80 mb-3 uppercase tracking-wider">
                    Size
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => toggleFilter("size_ids", size.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filters.size_ids.includes(size.id)
                            ? "bg-gold text-rich-black"
                            : "bg-warm-white/10 text-warm-white hover:bg-warm-white/20"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-warm-white/80 mb-3 uppercase tracking-wider">
                    Category
                  </h4>
                  <div className="space-y-2">
                    {categoryOptions.map((cat) => (
                      <label key={cat.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category_ids.includes(cat.id)}
                          onChange={() => toggleFilter("category_ids", cat.id)}
                          className="rounded border-warm-white/20 bg-transparent text-gold focus:ring-gold mr-3"
                        />
                        <span className="text-sm text-warm-white capitalize">
                          {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-warm-white/80 mb-3 uppercase tracking-wider">
                    Color
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => toggleFilter("colour_ids", color.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors flex items-center gap-2 ${
                          filters.colour_ids.includes(color.id)
                            ? "bg-gold text-rich-black"
                            : "bg-warm-white/10 text-warm-white hover:bg-warm-white/20"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: color.hex_code }}
                        ></span>
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-warm-white/80 mb-3 uppercase tracking-wider">
                    Price Range
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: [0, parseInt(e.target.value)],
                        })
                      }
                      className="w-full accent-gold"
                    />
                    <div className="flex justify-between text-sm text-warm-white/60">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      size_ids: [],
                      category_ids: [],
                      colour_ids: [],
                      priceRange: [0, 1000],
                      sortBy: "newest",
                    })
                  }
                  className="w-full border border-warm-white/20 text-warm-white py-2 rounded-lg hover:bg-warm-white/10 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
          <div className="relative flex-1">
            {isFetching && (
              <div className="absolute inset-0 bg-rich-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <p className="text-gold font-display text-xl animate-pulse">
                  Loading...
                </p>
              </div>
            )}
            <div
              className={`transition-opacity duration-300 ${
                isFetching ? "opacity-50" : "opacity-100"
              }`}
            >
              {content}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
