// src/features/api/orderApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        // All order operations are protected, so we always need the token.
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem("authToken");
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    // Define 'Order' and 'Cart' tags for caching.
    // We need 'Cart' here to invalidate it after a successful order.
    tagTypes: ["Order", "Cart"],
    endpoints: (builder) => ({
        // --- Customer-Facing Endpoints ---

        // Mutation to create a new order from the user's cart
        createOrder: builder.mutation({
            query: () => ({
                url: "order/",
                method: "POST",
            }),
            // CRITICAL: When an order is created, we must invalidate both the 'Order'
            // and 'Cart' tags. This will force the order history and the cart UI
            // to automatically re-fetch and update.
            invalidatesTags: ["Order", "Cart"],
        }),

        // Query to get the current user's order history
        getMyOrders: builder.query({
            query: () => "order/me",
            providesTags: ["Order"],
        }),

        // --- Admin-Facing Endpoints ---

        // Query for admins to get all orders from all users
        getAllOrdersAdmin: builder.query({
            query: () => "order/admin/", // Assumes this is the correct admin route
            providesTags: ["Order"],
        }),

        // Query for admins to get a single order by its ID
        getOrderByIdAdmin: builder.query({
            query: (orderId) => `order/admin/${orderId}`,
            providesTags: (result, error, id) => [{ type: "Order", id }],
        }),

        // Mutation for admins to update an order's status
        updateOrderStatusAdmin: builder.mutation({
            query: ({ orderId, statusUpdate }) => ({
                url: `order/admin/${orderId}`,
                method: "PATCH",
                body: statusUpdate, // e.g., { status: 'shipped' }
            }),
            // When an order is updated, invalidate its specific tag and the general list.
            invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }, "Order"],
        }),
    }),
});

// Export all the auto-generated hooks
export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetAllOrdersAdminQuery,
    useGetOrderByIdAdminQuery,
    useUpdateOrderStatusAdminMutation,
} = orderApi;
