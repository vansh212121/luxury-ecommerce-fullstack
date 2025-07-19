// // src/features/api/cartApi.js

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const BASE_URL = "http://127.0.0.1:8000/api/v1/";

// export const cartApi = createApi({
//   reducerPath: "cartApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: BASE_URL,
//     // All cart operations require the user to be logged in,
//     // so we must include the auth token in every request.
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token || localStorage.getItem("authToken");
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   // Define a 'Cart' tag for caching. Any mutation will invalidate this
//   // tag, forcing the cart data to be automatically re-fetched.
//   tagTypes: ["Cart"],
//   endpoints: (builder) => ({
//     // Query to get all items in the user's cart
//     getCartItems: builder.query({
//       query: () => "cart/",
//       // This query provides the 'Cart' tag.
//       providesTags: ["Cart"],
//     }),

//     // Mutation to add an item to the cart
//     addToCart: builder.mutation({
//       query: (newItem) => ({
//         url: "cart/items",
//         method: "POST",
//         body: newItem, // { product_id, size_id, colour_id, quantity }
//       }),
//       // When this succeeds, invalidate the 'Cart' tag to trigger a re-fetch.
//       invalidatesTags: ["Cart"],
//     }),

//     // Mutation to update the quantity of an item in the cart
//     updateCartItem: builder.mutation({
//       query: ({ cartItemId, updatedQuantity }) => ({
//         url: `cart/items/${cartItemId}`,
//         method: "PATCH",
//         body: updatedQuantity, // { quantity }
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     // Mutation to delete an item from the cart
//     // NOTE: Your backend has a slight typo in the route: "/delete/{cart_item_id}"
//     // It should ideally be DELETE "/items/{cart_item_id}". I'll match your current backend.
//     deleteCartItem: builder.mutation({
//       query: (cartItemId) => ({
//         url: `cart/delete/${cartItemId}`, // Matching your backend route
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Cart"],
//     }),
//   }),
// });

// // Export the auto-generated hooks for use in your components
// export const {
//   useGetCartItemsQuery,
//   useAddToCartMutation,
//   useUpdateCartItemMutation,
//   useDeleteCartItemMutation,
// } = cartApi;







// src/features/api/cartApi.js - Optimized with Optimistic Update

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const cartApi = createApi({
  reducerPath: "cartApi",
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
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: () => "cart/",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (newItem) => ({
        url: "cart/items",
        method: "POST",
        body: newItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    // --- THE OPTIMIZATION ---
    updateCartItem: builder.mutation({
      query: ({ cartItemId, updatedQuantity }) => ({
        url: `cart/items/${cartItemId}`,
        method: "PATCH",
        body: updatedQuantity,
      }),
      // This is the optimistic update logic
      async onQueryStarted({ cartItemId, updatedQuantity }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCartItems', undefined, (draft) => {
            // The `draft` is a mutable copy of the cache data
            const item = draft.find(item => item.id === cartItemId);
            if (item) {
              item.quantity = updatedQuantity.quantity;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // If the API call fails, undo the change
        }
      },
      // We no longer need to invalidate the whole list, making it faster.
      // invalidatesTags: ["Cart"], 
    }),

    deleteCartItem: builder.mutation({
      query: (cartItemId) => ({
        url: `cart/delete/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartItemsQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
} = cartApi;
