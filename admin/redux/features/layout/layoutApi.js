import { apiSlice } from "./../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHeroData: builder.query({
      query: (type) => ({
        url: `/layout/get-layout/${type}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateLayout: builder.mutation({
      query: ({ type, image, title, subTitle, faq, categories }) => ({
        url: "/layout/update-layout/",
        method: "PUT",
        body: { type, image, title, subTitle, faq, categories },
        credentials: "include",
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/layout/delete-category/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/layout/delete-faq/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetHeroDataQuery,
  useUpdateLayoutMutation,
  useDeleteCategoryMutation,
  useDeleteFaqMutation
} = layoutApi;
