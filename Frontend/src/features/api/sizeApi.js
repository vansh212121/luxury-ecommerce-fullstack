
// src/features/api/sizeApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const sizeApi = createApi({
  reducerPath: "sizeApi",
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
  tagTypes: ["Size"],
  endpoints: (builder) => ({
    getSizes: builder.query({
      query: () => "size/",
      providesTags: ["Size"],
    }),
    createSize: builder.mutation({
      query: (newSize) => ({
        url: "size/",
        method: "POST",
        body: newSize,
      }),
      invalidatesTags: ["Size"],
    }),
    deleteSize: builder.mutation({
      query: (sizeId) => ({
        url: `size/${sizeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Size"],
    }),
  }),
});

export const { useGetSizesQuery, useCreateSizeMutation, useDeleteSizeMutation } = sizeApi;
