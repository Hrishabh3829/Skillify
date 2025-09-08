import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE } from "@/config/api";

const COURSE_PURCHASE_API = `${API_BASE}/api/v1/purchase`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  tagTypes: ["Purchases"],
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
  url: "checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Purchases"],
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
  url: `course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
  url: ``,
        method: "GET",
      }),
      providesTags: ["Purchases"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;
