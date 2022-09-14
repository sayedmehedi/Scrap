import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  ProductDetails,
  FilterProductsResponse,
  FilterProductQueryParams,
  PaginationQueryParams,
  GetOfferNBidsResponse,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const offerNBidsApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    upsertBidOrOffer: builder.mutation<
      {success: string},
      {
        price: number;
        type: "0" | "1";
        product_id: string | number;
      }
    >({
      query(body) {
        return {
          body,
          method: "POST",
          url: `make-offer-bid`,
        };
      },
      invalidatesTags: (_result, _error) => [QUERY_KEYS.USER_OFFER_N_BIDS],
    }),

    getUserOfferNBids: builder.query<
      GetOfferNBidsResponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `user-offer-bids`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.USER_OFFER_N_BIDS, id: "LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),

    getSellerOfferNBids: builder.query<
      GetOfferNBidsResponse,
      PaginationQueryParams & {
        productId: string | number;
      }
    >({
      query({productId, ...params}) {
        return {
          params,
          url: `seller-offer-bids/${productId}`,
        };
      },
      providesTags: (result, error, {productId}) =>
        result
          ? [
              {
                type: QUERY_KEYS.SELLER_OFFER_N_BIDS,
                id: productId,
              },
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    makeBidWinnerOrAcceptOffer: builder.mutation<
      {success: string},
      {offerOrBidId: number}
    >({
      query({offerOrBidId}) {
        return {
          url: `winner-accept/${offerOrBidId}`,
        };
      },
      invalidatesTags: () => [QUERY_KEYS.SELLER_OFFER_N_BIDS],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserOfferNBidsQuery,
  useUpsertBidOrOfferMutation,
  useGetSellerOfferNBidsQuery,
  useLazyGetUserOfferNBidsQuery,
  useLazyGetSellerOfferNBidsQuery,
  useMakeBidWinnerOrAcceptOfferMutation,
} = offerNBidsApi;
