import { apiSlice } from "./../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: () => ({
        url: "order/get-orders",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery } = orderApi;
