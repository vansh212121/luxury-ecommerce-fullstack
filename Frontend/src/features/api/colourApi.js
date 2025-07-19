
// src/features/api/colourApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const colourApi = createApi({
  reducerPath: "colourApi",
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
  tagTypes: ["Colour"],
  endpoints: (builder) => ({
    getColours: builder.query({
      query: () => "colour/",
      providesTags: ["Colour"],
    }),
    createColour: builder.mutation({
      query: (newColour) => ({
        url: "colour/",
        method: "POST",
        body: newColour,
      }),
      invalidatesTags: ["Colour"],
    }),
    deleteColour: builder.mutation({
      query: (colourId) => ({
        url: `colour/${colourId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colour"],
    }),
  }),
});

export const { useGetColoursQuery, useCreateColourMutation, useDeleteColourMutation } = colourApi;
