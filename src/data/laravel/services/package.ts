import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {GetPackagesResponse, PaginationQueryParams} from "@src/types";

// Define a service using a base URL and expected endpoints
export const packageApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getPackages: builder.query<GetPackagesResponse, PaginationQueryParams>({
      query: params => ({
        params,
        url: `index-package`,
      }),
      providesTags: (result, error) =>
        result
          ? [
              {type: QUERY_KEYS.PACKAGE, id: "LIST"},
              ...result.items.data.map(({id}) => ({
                type: QUERY_KEYS.PACKAGE,
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
export const {useGetPackagesQuery, useLazyGetPackagesQuery} = packageApi;
