import {api} from "./api";
import RNFetchBlob from "rn-fetch-blob";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import {AxiosError, AxiosInstance} from "axios";
import {ApplicationError} from "@core/domain/ApplicationError";
import {REACT_APP_METALS_API_TOKEN} from "react-native-dotenv";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";
import {
  RootState,
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
  ProductImageUploadResponse,
  ProductImageUploadRequest,
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
    uploadProductImage: builder.mutation<
      ProductImageUploadResponse,
      ProductImageUploadRequest
    >({
      queryFn({onUploadProgress, image}, {getState}) {
        const authToken = (getState() as RootState).auth.token;

        return RNFetchBlob.fetch(
          "POST",
          "https://backend.thescrapapp.com/api/image-upload",
          {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
          [
            // element with property `filename` will be transformed into `file` in form data
            {
              name: "image",
              type: image.type,
              filename: image.name,
              data: RNFetchBlob.wrap(image.uri),
            },
          ],
        )
          .uploadProgress((sent, total) => {
            onUploadProgress?.(sent, total);
          })
          .then(res => res.json() as Promise<ProductImageUploadResponse>)
          .then(data => {
            return {
              data,
            };
          })
          .catch(err => {
            const error = err as ApplicationError;
            console.log("image upload e error khaisee", error);
            return {
              error: {
                status: error.status,
                data: {
                  field_errors: {},
                  non_field_error: error.message,
                },
              },
            };
          });
      },
    }),
    upsertProduct: builder.mutation<
      {success: string} | {error: string},
      UpsertProductRequest
    >({
      query(body) {
        const formData: Record<string, any> = {};
        formData["title"] = body.title;
        formData["category_id"] = body.category_id;
        formData["sub_category_id"] = body.sub_category_id;
        formData["condition_id"] = body.condition_id;
        formData["details"] = body.details;
        formData["is_list_now"] = body.is_list_now;
        formData["expected_date_for_list"] = body.expected_date_for_list;
        formData["package_id"] = body.package_id;
        formData["is_locale"] = body.is_locale;
        formData["is_shipping"] = body.is_shipping;

        formData["location"] = body.location;
        //? location dile egulao lagbe
        formData["latitude"] = body.latitude;
        formData["longitude"] = body.longitude;

        console.log("selected metals", body.selected_metals);

        if (body.show_metal_price === "1") {
          formData["show_metal_price"] = body.show_metal_price;
          // ? show_metal_price dile egula lagbe
          formData.selected_metals = body.selected_metals;
        }

        Object.entries(body.attributes).forEach(([attrId, termId]) => {
          formData[`attributes[${attrId}]`] = termId;
        });

        if (!!body.starting_price) {
          formData["starting_price"] = body.starting_price;
          formData["duration"] = body.duration;
        }

        formData["buy_price"] = body.buy_price;
        formData["quantity"] = body.quantity;

        formData["images"] = body.images.map(img => ({
          small_image: img.small_image,
          large_image: img.large_image,
          medium_image: img.medium_image,
          original_image: img.original_image,
        }));

        const endpoint = !!body.product_id
          ? `products/${body.product_id}`
          : "products";

        return {
          url: endpoint,
          body: formData,
          method: "POST",
        };
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
            }

            return {
              error: {
                status: response.data.error.code,
                data: {
                  non_field_error: response.data.error.info,
                  field_errors: {},
                },
              },
            };
          })
          .catch(err => {
            const error: AxiosError<{
              success: false;
              error: {
                code: MetalsApiErrorCode;
                info: MetalsApiErrorMessage;
              };
            }> = err;

            return {
              error: {
                status: error.response?.data.error.code ?? 400,
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
  useUploadProductImageMutation,
  useLazyGetProductEditInfoQuery,
  useLazyGetFilterProductsQuery,
  useLazyGetArchiveProductsQuery,
  useToggleProductFavoriteMutation,
  useLazyGetProductMetalsLivePriceQuery,
} = productApi;
