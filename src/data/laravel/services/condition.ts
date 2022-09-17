import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {ConditionResponse, PaginationQueryParams} from "@src/types";

// Define a service using a base URL and expected endpoints
export const conditionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getConditions: builder.query<ConditionResponse, PaginationQueryParams>({
      query() {
        return {
          url: "conditions",
        };
      },
      providesTags: (result, error) =>
        result
          ? result.items.data
              .map(({id}) => ({
                type: QUERY_KEYS.CONDITION,
                id,
              }))
              .concat([{type: QUERY_KEYS.CONDITION, id: "LIST"}])
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetConditionsQuery, useLazyGetConditionsQuery} = conditionApi;
