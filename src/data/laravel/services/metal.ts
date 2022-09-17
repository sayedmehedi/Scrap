import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  PaginationQueryParams,
  GetSellerReviewsResponse,
  CreateSellerReview,
  GetMetalsResponse,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const metalApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getMetals: builder.query<GetMetalsResponse, PaginationQueryParams>({
      query: params => ({
        params,
        url: `metals`,
      }),
      providesTags: (result, error) =>
        result
          ? [
              {type: QUERY_KEYS.METAL, id: "LIST"},
              ...result.items.data.map(({id}) => ({
                type: QUERY_KEYS.METAL,
                id,
              })),
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetMetalsQuery, useLazyGetMetalsQuery} = metalApi;
