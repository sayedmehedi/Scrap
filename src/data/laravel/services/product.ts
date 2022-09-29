import {api} from "./api";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import {AxiosError, AxiosInstance} from "axios";
import {ApplicationError} from "@core/domain/ApplicationError";
import {REACT_APP_METALS_API_TOKEN} from "react-native-dotenv";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";
import {
  ProductDetails,
  MetalsApiErrorCode,
  MetalsApiErrorMessage,
  UpsertProductRequest,
  PaginationQueryParams,
  FilterProductsResponse,
  FilterProductQueryParams,
  GetSavedProductsReponse,
  GetSellerProductsReponse,
  GetProductEditInfoResponse,
  GetSaleOrArchivedProductsReponse,
  GetProductMetalsLivePriceResponse,
  GetProductMetalsLivePriceRequest,
} from "@src/types";

const metalsApiClient = container.get<AxiosInstance>(
  ServiceProviderTypes.MetalsApiClient,
);

const apiClient = container.get<AxiosInstance>(ServiceProviderTypes.HttpClient);

// Define a service using a base URL and expected endpoints
export const productApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getFilterProducts: builder.query<
      FilterProductsResponse,
      FilterProductQueryParams | undefined
    >({
      query: queryParams => {
        let params: Record<string, any> = {};

        if (queryParams) {
          const {attributes, ...rest} = queryParams;
          params = {
            ...(rest ?? {}),
          };

          if (attributes) {
            Object.entries(attributes).forEach(([attrId, termId]) => {
              params[`attributes[${attrId}]`] = termId;
            });
          }
        }

        return {
          params,
          url: "filter-product",
        };
      },
      providesTags: (result, error) =>
        result
          ? [
              {type: QUERY_KEYS.PRODUCT, id: "FILTER-LIST"},
              ...result.products.data.map(prod => ({
                type: QUERY_KEYS.PRODUCT,
                id: prod.id,
              })),
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getProductDetails: builder.query<
      ProductDetails,
      {
        id: number;
        latitude?: number;
        longitude?: number;
      }
    >({
      query({id, ...providedParams}) {
        const params: {
          latitude?: number;
          longitude?: number;
        } = {};

        if (providedParams.latitude) {
          params.latitude = providedParams.latitude;
        }

        if (providedParams.longitude) {
          params.longitude = providedParams.longitude;
        }

        return {
          params,
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
    getProductEditInfo: builder.query<GetProductEditInfoResponse, number>({
      query(productId) {
        return {
          url: `products/${productId}/edit`,
        };
      },
    }),
    upsertProduct: builder.mutation<
      {success: string} | {error: string},
      UpsertProductRequest & {onUploadProgress?: (event: ProgressEvent) => void}
    >({
      queryFn({onUploadProgress, ...body}) {
        console.log("body data is", body.attributes);

        const formData = new FormData();

        formData.append("title", body.title);
        formData.append("category_id", body.category_id);
        formData.append("sub_category_id", body.sub_category_id);
        formData.append("condition_id", body.condition_id);
        formData.append("details", body.details);
        formData.append("is_list_now", body.is_list_now);
        formData.append("expected_date_for_list", body.expected_date_for_list);
        formData.append("package_id", body.package_id);
        formData.append("is_locale", body.is_locale);
        formData.append("is_shipping", body.is_shipping);

        formData.append("location", body.location);
        //? location dile egulao lagbe
        formData.append("latitude", body.latitude);
        formData.append("longitude", body.longitude);

        console.log("selected metals", body.selected_metals);

        if (body.show_metal_price === "1") {
          formData.append("show_metal_price", body.show_metal_price);
          // ? show_metal_price dile egula lagbe
          body.selected_metals.forEach(metal => {
            console.log("appending metal", metal.toString());

            formData.append("selected_metals[]", metal.toString());
          });
        }

        Object.entries(body.attributes).forEach(([attrId, termId]) => {
          formData.append(`attributes[${attrId}]`, termId);
        });

        if (!!body.starting_price) {
          formData.append("starting_price", body.starting_price);
          formData.append("duration", body.duration);
        }

        formData.append("buy_price", body.buy_price);
        formData.append("quantity", body.quantity);

        body.images.forEach(img => {
          console.log("appending image", img);
          formData.append("images[]", {
            uri: img.uri,
            type: img.type,
            name: img.fileName,
          });
        });

        const endpoint = !!body.product_id
          ? `products/${body.product_id}`
          : "products";

        return apiClient
          .postForm<{success: string}>(endpoint, formData, {
            onUploadProgress,
          })
          .then(res => {
            return {
              data: {
                success: res.data.success,
              },
            };
          })
          .catch((error: ApplicationError) => {
            console.log("error khaisee", error);
            return {
              error: {
                status: error.status,
                data: error.getFormattedMessage(),
              },
              meta: error.response,
            };
          });
      },
      invalidatesTags: () => [QUERY_KEYS.PRODUCT],
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
          ? [
              {type: QUERY_KEYS.PRODUCT, id: "FAVOURITE-LIST"},
              ...result.items.data.map(prod => ({
                type: QUERY_KEYS.PRODUCT,
                id: prod.id,
              })),
            ]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getSellerProducts: builder.query<
      GetSellerProductsReponse,
      PaginationQueryParams & {
        user_id: number;
      }
    >({
      query(params) {
        return {
          params,
          url: `seller-product`,
        };
      },
      providesTags: (result, error) =>
        result
          ? [
              {type: QUERY_KEYS.PRODUCT, id: "SELLER-LIST"},
              ...result.products.data.map(prod => ({
                type: QUERY_KEYS.PRODUCT,
                id: prod.id,
              })),
            ]
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
          ? [
              {type: QUERY_KEYS.PRODUCT, id: "SALE-LIST"},
              ...result.products.data.map(prod => ({
                type: QUERY_KEYS.PRODUCT,
                id: prod.id,
              })),
            ]
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
      queryFn(data, {signal}) {
        return metalsApiClient
          .get<GetProductMetalsLivePriceResponse>(
            "https://metals-api.com/api/fluctuation",
            {
              params: {
                access_key: REACT_APP_METALS_API_TOKEN,
                ...data,
                symbols: data.symbols.join(","),
              },
              signal,
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
          .catch(err => {
            const error: AxiosError<{
              success: false;
              error: {
                code: MetalsApiErrorCode;
                info: MetalsApiErrorMessage;
              };
            }> = err;
            console.log("error is", error);
            return {
              error: {
                status: error.response?.data.error.code ?? error.status,
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
    deleteProduct: builder.mutation<
      {success: string} | {error: string},
      number
    >({
      query(productId) {
        return {
          method: "DELETE",
          url: `products/${productId}`,
        };
      },
      invalidatesTags: (result, _error, id) =>
        result
          ? [
              {type: QUERY_KEYS.PRODUCT, id},
              {type: QUERY_KEYS.PRODUCT, id: "SELLER-LIST"},
            ]
          : [],
    }),
    deleteProductFile: builder.mutation<
      {success: string} | {error: string},
      {
        product_id: number;
        file: string;
      }
    >({
      query(body) {
        return {
          body,
          method: "POST",
          url: `delete-file`,
        };
      },
      invalidatesTags: (_result, _error, body) => [
        {type: QUERY_KEYS.PRODUCT, id: body.product_id},
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSaleProductsQuery,
  useGetSavedProductsQuery,
  useGetFilterProductsQuery,
  useUpsertProductMutation,
  useGetSellerProductsQuery,
  useDeleteProductMutation,
  useGetProductDetailsQuery,
  useLazyGetSaleProductsQuery,
  useGetArchiveProductsQuery,
  useDeleteProductFileMutation,
  useLazyGetSellerProductsQuery,
  useLazyGetSavedProductsQuery,
  useLazyGetProductEditInfoQuery,
  useLazyGetFilterProductsQuery,
  useLazyGetArchiveProductsQuery,
  useToggleProductFavoriteMutation,
  useLazyGetProductMetalsLivePriceQuery,
} = productApi;
