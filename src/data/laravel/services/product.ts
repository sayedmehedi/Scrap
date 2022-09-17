import {api} from "./api";
import axios from "axios";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import {AxiosError, AxiosInstance} from "axios";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";
import {
  ProductDetails,
  PaginationQueryParams,
  FilterProductsResponse,
  FilterProductQueryParams,
  GetSavedProductsReponse,
  GetSaleOrArchivedProductsReponse,
  GetProductMetalsLivePriceResponse,
  GetProductMetalsLivePriceRequest,
} from "@src/types";

const metalsApiClient = container.get<AxiosInstance>(
  ServiceProviderTypes.MetalsApiClient,
);

// Define a service using a base URL and expected endpoints
export const productApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getFilterProducts: builder.query<
      FilterProductsResponse,
      FilterProductQueryParams | undefined
    >({
      query: params => ({
        params,
        url: "filter-product",
      }),
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "FILTER-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getProductDetails: builder.query<
      ProductDetails,
      {
        id: string | number;
      }
    >({
      query({id}) {
        return {
          url: `product/${id}/anything`,
        };
      },
      providesTags: (result, error, {id}) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    toggleProductFavorite: builder.mutation<
      {success: string},
      {
        id: string | number;
      }
    >({
      query({id}) {
        return {
          url: `favourite_products/${id}`,
        };
      },
      invalidatesTags: (result, error, {id}) =>
        result
          ? [
              {type: QUERY_KEYS.PRODUCT, id},
              {type: QUERY_KEYS.PRODUCT, id: "FAVOURITE-LIST"},
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getSavedProducts: builder.query<
      GetSavedProductsReponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `favourite_products`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "FAVOURITE-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getSaleProducts: builder.query<
      GetSaleOrArchivedProductsReponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `sale-product`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "SALE-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getArchiveProducts: builder.query<
      GetSaleOrArchivedProductsReponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          params,
          url: `archive-product`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.PRODUCT, id: "ARCHIVE-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getProductMetalsLivePrice: builder.query<
      GetProductMetalsLivePriceResponse,
      GetProductMetalsLivePriceRequest
    >({
      queryFn(data) {
        return metalsApiClient
          .get<GetProductMetalsLivePriceResponse>(
            "https://metals-api.com/api/fluctuation",
            {
              params: {
                access_key:
                  "lism66o45m1yy7598jgr16763m9sr5si26cn3ywyx7iqvnlhaquggcpnxp26",
                ...data,
                symbols: data.symbols.join(","),
              },
            },
          )
          .then(response => {
            if (response.data.success) {
              return {
                data: {
                  base: response.data.base,
                  unit: response.data.unit,
                  rates: response.data.rates,
                  success: response.data.success,
                  end_date: response.data.end_date,
                  start_date: response.data.start_date,
                  fluctuation: response.data.fluctuation,
                },
              };
            } else {
              return {
                error: {
                  status: response.data.error.code,
                  data: {
                    non_field_error: response.data.error.info,
                    field_errors: {},
                  },
                },
                meta: response.config,
              };
            }
          })
          .catch(error => {
            console.log("error is", error);
            return {
              error: {
                status: error.status,
                data: {
                  non_field_error:
                    error.response?.data.error.info ?? error.message,
                  field_errors: {},
                },
              },
              meta: error.toJSON(),
            };
          });
      },
      providesTags: (result, error, {symbols}) => {
        const symbolsStirng = symbols.join(",");

        return result
          ? [
              {
                type: QUERY_KEYS.PRODUCT,
                id: `METALS-LIVE-PRICE-${symbolsStirng}`,
              },
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR];
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSaleProductsQuery,
  useGetSavedProductsQuery,
  useGetFilterProductsQuery,
  useGetProductDetailsQuery,
  useLazyGetSaleProductsQuery,
  useGetArchiveProductsQuery,
  useLazyGetSavedProductsQuery,
  useLazyGetFilterProductsQuery,
  useLazyGetArchiveProductsQuery,
  useToggleProductFavoriteMutation,
  useLazyGetProductMetalsLivePriceQuery,
} = productApi;
