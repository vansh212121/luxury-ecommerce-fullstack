
// src/features/api/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../authSlice";
import { userApi } from "./userApi"; // 1. Import the userApi

const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/token",
        method: "POST",
        body: new URLSearchParams(credentials),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const token = data.access_token;
          
          localStorage.setItem("authToken", token);

          // 2. Dispatch the login action to get the token into the store immediately
          dispatch(userLoggedIn({ token: token }));

          // 3. THE FIX: After logging in, immediately dispatch the 'getMe' query
          // to fetch the user's full profile. The onQueryStarted in userApi
          // will then populate the user object in the store.
          await dispatch(userApi.endpoints.getMe.initiate(null));

        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
