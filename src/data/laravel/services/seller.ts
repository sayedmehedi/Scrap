import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  PaginationQueryParams,
  GetSellerReviewsResponse,
  CreateSellerReview,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const sellerApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getSellerReviews: builder.query<
      GetSellerReviewsResponse,
      PaginationQueryParams & {
        sellerId: number;
      }
    >({
      query: ({sellerId, ...params}) => ({
        params,
        url: `seller-reviews/${sellerId}`,
      }),
      providesTags: (result, error, {sellerId}) =>
        result
          ? [{type: QUERY_KEYS.SELLER, id: `REVIEW-LIST-${sellerId}`}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    createSellerReview: builder.mutation<{success: string}, CreateSellerReview>(
      {
        query(body) {
          return {
            body,
            method: "POST",
            url: "store-review",
          };
        },
        invalidatesTags: (_result, _error, {seller_id}) => [
          {type: QUERY_KEYS.SELLER, id: `REVIEW-LIST-${seller_id}`},
        ],
      },
    ),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSellerReviewsQuery,
  useLazyGetSellerReviewsQuery,
  useCreateSellerReviewMutation,
} = sellerApi;
