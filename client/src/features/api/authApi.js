import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useLoggedOut, userLoggedIn } from "../authSlice";

// Centralized user API base (dev tunnel) - adjust as needed
const USER_API = "http://localhost:5000/api/v1/user/";
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  tagTypes: ["Profile"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
      invalidatesTags: ["Profile"],
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
      invalidatesTags: ["Profile"],
    }),
    // Single loadUser endpoint (removed duplicate)
    loadUser: builder.query({
      query: () => ({ url: "profile", method: "GET" }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.user) {
            dispatch(userLoggedIn({ user: result.data.user }));
          }
        } catch (_) {}
      },
      providesTags: ["Profile"],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(useLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
      invalidatesTags: ["Profile"],
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "PUT",
        body: formData,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result?.data?.user) {
            dispatch(userLoggedIn({ user: result.data.user }));
          }
        } catch (e) {
          // noop
        }
      },
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
} = authApi;
