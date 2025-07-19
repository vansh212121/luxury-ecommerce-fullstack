// src/features/api/dashboardApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    // The dashboard is a protected route, so we need to send the token.
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token || localStorage.getItem("authToken");
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Query to get all statistics for the admin dashboard
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats", // Matches your backend route
    }),
  }),
});

// Export the auto-generated hook
export const { useGetDashboardStatsQuery } = dashboardApi;
