
// src/features/api/productApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("authToken");
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({

    getProducts: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        // Add all potential filter and pagination parameters
        if (filters.gender) params.append("gender", filters.gender);
        if (filters.sort_by) params.append("sort_by", filters.sort_by);
        if (filters.page) params.append("page", filters.page);
        if (filters.limit) params.append("limit", filters.limit);
        if (filters.min_price) params.append("min_price", filters.min_price);
        if (filters.max_price) params.append("max_price", filters.max_price);

        // Handle array parameters for IDs
        if (filters.category_ids?.length) {
          filters.category_ids.forEach(id => params.append("category_ids", id));
        }
        if (filters.size_ids?.length) {
          filters.size_ids.forEach(id => params.append("size_ids", id));
        }
        if (filters.colour_ids?.length) {
          filters.colour_ids.forEach(id => params.append("colour_ids", id));
        }
        if (filters.search) params.append("search", filters.search); // Add this line

        return `product/?${params.toString()}`;
      },
      providesTags: (result, error, arg) => [
        "Product",
        ...(result?.items?.map(({ id }) => ({ type: "Product", id })) || []),
      ],
    }),

    getProductById: builder.query({
      query: (productId) => `product/${productId}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation({
      query: (newProductData) => ({
        url: "product/create",
        method: "POST",
        body: newProductData,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, updatedData }) => ({
        url: `product/${productId}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `product/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
