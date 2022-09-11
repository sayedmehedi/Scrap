import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  AllCategoryResponse,
  CategoryListResponse,
  HomeCategoryResponse,
  PaginationQueryParams,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getHomeScreenCategories: builder.query<HomeCategoryResponse, void>({
      query: () => ({
        url: "home-screen",
      }),
      providesTags: result =>
        result
          ? [
              {type: QUERY_KEYS.CATEGORY, id: "HOME-SCREEN-LIST"},
              ...result.categories.map(({id}) => ({
                type: QUERY_KEYS.CATEGORY as const,
                id,
              })),
            ]
          : [{type: QUERY_KEYS.CATEGORY, id: "HOME-SCREEN-LIST"}],
    }),
    getAllCategories: builder.query<AllCategoryResponse, void>({
      query: () => ({
        url: "all-categories",
      }),
      providesTags: result =>
        result
          ? [
              {type: QUERY_KEYS.CATEGORY, id: "ALL-LIST"},
              ...result.categories.map(({id}) => ({
                type: QUERY_KEYS.CATEGORY as const,
                id,
              })),
            ]
          : [{type: QUERY_KEYS.CATEGORY, id: "ALL-LIST"}],
    }),
    getCategoryList: builder.query<CategoryListResponse, PaginationQueryParams>(
      {
        query(params) {
          return {
            params,
            url: "categories",
          };
        },
        providesTags: result =>
          result
            ? [
                {type: QUERY_KEYS.CATEGORY, id: "LIST"},
                ...result.items.data.map(({id}) => ({
                  type: QUERY_KEYS.CATEGORY as const,
                  id,
                })),
              ]
            : [{type: QUERY_KEYS.CATEGORY, id: "LIST"}],
      },
    ),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCategoryListQuery,
  useGetAllCategoriesQuery,
  useLazyGetCategoryListQuery,
  useLazyGetAllCategoriesQuery,
  useGetHomeScreenCategoriesQuery,
} = categoryApi;
