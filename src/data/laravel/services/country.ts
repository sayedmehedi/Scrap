import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  GetCitiesResponse,
  GetStatesResponse,
  GetCountriesResponse,
  PaginationQueryParams,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const countryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getCountries: builder.query<
      GetCountriesResponse,
      {search_text?: string} & PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: "countries-search",
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.COUNTRY, id: "LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),

    getStates: builder.query<
      GetStatesResponse,
      {search_text?: string} & PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: "states-search",
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.STATE, id: "LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),

    getCities: builder.query<
      GetCitiesResponse,
      {search_text?: string} & PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: "cities-search",
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.CITY, id: "LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetStatesQuery,
  useGetCitiesQuery,
  useGetCountriesQuery,
  useLazyGetCitiesQuery,
  useLazyGetStatesQuery,
  useLazyGetCountriesQuery,
} = countryApi;
