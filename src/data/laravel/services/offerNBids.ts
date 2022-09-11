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
      query({product_id, price, type}) {
        return {
          method: "POST",
          url: `make-offer-bid`,
          body: {
            type,
            price,
            product_id,
          },
        };
      },
      invalidatesTags: (_result, _error) => [QUERY_KEYS.OFFER_N_BIDS],
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
      providesTags: (_result, _error) => [
        {type: QUERY_KEYS.OFFER_N_BIDS, id: "USER-OFFER-LIST"},
      ],
    }),

    getSellerOfferNBids: builder.query<
      GetOfferNBidsResponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `user-offer-bids`,
        };
      },
      providesTags: (_result, _error) => [
        {type: QUERY_KEYS.OFFER_N_BIDS, id: "USER-OFFER-LIST"},
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUpsertBidOrOfferMutation,
  useLazyGetUserOfferNBidsQuery,
  useLazyGetSellerOfferNBidsQuery,
} = offerNBidsApi;
