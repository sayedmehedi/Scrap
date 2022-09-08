import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  ProductDetails,
  FilterProductsResponse,
  FilterProductQueryParams,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const productApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getFilterProducts: builder.query<
      FilterProductsResponse,
      FilterProductQueryParams | undefined
    >({
      query: (params = {}) => ({
        params,
        url: "filter-product",
      }),
      providesTags: result =>
        result
          ? [
              {type: QUERY_KEYS.PRODUCT, id: "FILTER-LIST"},
              ...result.products.data.map(({id}) => ({
                type: QUERY_KEYS.PRODUCT as const,
                id,
              })),
            ]
          : [{type: QUERY_KEYS.PRODUCT, id: "FILTER-LIST"}],
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
      invalidatesTags: (_result, _error, {id}) => [
        {type: QUERY_KEYS.PRODUCT, id},
      ],
    }),

    makeBidOrOffer: builder.mutation<
      {success: string},
      {
        price: number;
        type: "0" | "1";
        id: string | number;
      }
    >({
      query({id, price, type}) {
        return {
          method: "POST",
          url: `make-offer-bid`,
          body: {
            type,
            price,
            product_id: id,
          },
        };
      },
      invalidatesTags: (_result, _error, {id}) => [
        {type: QUERY_KEYS.PRODUCT, id},
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetFilterProductsQuery,
  useGetProductDetailsQuery,
  useMakeBidOrOfferMutation,
  useLazyGetFilterProductsQuery,
  useToggleProductFavoriteMutation,
} = productApi;
