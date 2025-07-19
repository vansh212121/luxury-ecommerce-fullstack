// src/features/api/wishlistApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // Wishlist operations require the user to be logged in
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("authToken");
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    // Query to get all items in the user's wishlist
    getWishlistItems: builder.query({
      query: () => "wishlist/",
      providesTags: ["Wishlist"],
    }),

    // Mutation to add an item to the wishlist
    addToWishlist: builder.mutation({
      query: (newItem) => ({ // Expects { product_id: number }
        url: "wishlist/",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Mutation to delete an item from the wishlist
    deleteFromWishlist: builder.mutation({
      query: (wishlistItemId) => ({
        url: `wishlist/${wishlistItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

// Export the auto-generated hooks
export const {
  useGetWishlistItemsQuery,
  useAddToWishlistMutation,
  useDeleteFromWishlistMutation,
} = wishlistApi;
