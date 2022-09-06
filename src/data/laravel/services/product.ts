import {api} from './api';
import {QUERY_KEYS} from '@constants/query';
import {FilterProductQueryParams, FilterProductsResponse} from '@src/types';

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
        url: 'filter-product',
      }),
      providesTags: result =>
        result
          ? [
              {type: QUERY_KEYS.PRODUCT, id: 'FILTER-LIST'},
              ...result.products.data.map(({id}) => ({
                type: QUERY_KEYS.PRODUCT as const,
                id,
              })),
            ]
          : [{type: QUERY_KEYS.PRODUCT, id: 'FILTER-LIST'}],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetFilterProductsQuery} = productApi;
