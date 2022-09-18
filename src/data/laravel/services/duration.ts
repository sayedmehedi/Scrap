import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {PaginationQueryParams, GetDurationsResponse} from "@src/types";

// Define a service using a base URL and expected endpoints
export const durationApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getDurations: builder.query<GetDurationsResponse, PaginationQueryParams>({
      query: params => ({
        params,
        url: `durations`,
      }),
      providesTags: (result, error) =>
        result
          ? [
              {type: QUERY_KEYS.DURATION, id: `LIST`},
              ...result.items.data.map(({id}) => ({
                type: QUERY_KEYS.DURATION,
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
export const {useGetDurationsQuery, useLazyGetDurationsQuery} = durationApi;
