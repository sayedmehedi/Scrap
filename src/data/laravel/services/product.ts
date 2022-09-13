import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  ProductDetails,
  PaginationQueryParams,
  FilterProductsResponse,
  FilterProductQueryParams,
  GetSavedProductsReponse,
  GetSaleOrArchivedProductsReponse,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const productApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getFilterProducts: builder.query<
      FilterProductsResponse,
      FilterProductQueryParams | undefined
    >({
      query: params => ({
        params,
        url: "filter-product",
      }),
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "FILTER-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getProductDetails: builder.query<
      ProductDetails,
      {
        id: string | number;
      }
    >({
      query({id}) {
        return {
          url: `product/${id}/anything`,
        };
      },
      providesTags: (result, error, {id}) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    toggleProductFavorite: builder.mutation<
      {success: string},
      {
        id: string | number;
      }
    >({
      query({id}) {
        return {
          url: `favourite_products/${id}`,
        };
      },
      invalidatesTags: (result, error, {id}) =>
        result
          ? [
              {type: QUERY_KEYS.PRODUCT, id},
              {type: QUERY_KEYS.PRODUCT, id: "FAVOURITE-LIST"},
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getSavedProducts: builder.query<
      GetSavedProductsReponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `favourite_products`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "FAVOURITE-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getSaleProducts: builder.query<
      GetSaleOrArchivedProductsReponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `sale-product`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "SALE-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getArchiveProducts: builder.query<
      GetSaleOrArchivedProductsReponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `archive-product`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "ARCHIVE-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSaleProductsQuery,
  useGetSavedProductsQuery,
  useGetFilterProductsQuery,
  useGetProductDetailsQuery,
  useLazyGetSaleProductsQuery,
  useGetArchiveProductsQuery,
  useLazyGetSavedProductsQuery,
  useLazyGetFilterProductsQuery,
  useLazyGetArchiveProductsQuery,
  useToggleProductFavoriteMutation,
} = productApi;
