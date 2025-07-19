// src/features/api/userApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const userApi = createApi({
  reducerPath: "userApi",
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
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "user/",
        method: "POST",
        body,
      }),
    }),
    
    getMe: builder.query({
      query: () => ({
        url: "user/me",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
            const { data } = await queryFulfilled;
            dispatch(userLoggedIn({ user: data, token: localStorage.getItem("authToken") }));
        } catch (error) {
            console.log("Loading user failed, logging out.", error);
            dispatch(userLoggedOut());
            localStorage.removeItem("authToken");
        }
      }
    }),
  }),
});

export const { useSignupMutation, useGetMeQuery } = userApi;
