import {api} from './api';
import {QUERY_KEYS} from '@constants/query';
import {HomeCategoryResponse} from '@src/types';

// Define a service using a base URL and expected endpoints
export const categoryApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getHomeScreenCategories: builder.query<HomeCategoryResponse, void>({
      query: () => ({
        url: 'home-screen',
      }),
      providesTags: result =>
        result
          ? [
              {type: QUERY_KEYS.CATEGORY, id: 'HOME-SCREEN-LIST'},
              ...result.categories.map(({id}) => ({
                type: QUERY_KEYS.CATEGORY as const,
                id,
              })),
            ]
          : [{type: QUERY_KEYS.CATEGORY, id: 'HOME-SCREEN-LIST'}],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetHomeScreenCategoriesQuery} = categoryApi;
