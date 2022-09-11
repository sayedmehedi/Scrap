import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  CreateCartRequest,
  GetCartsResponse,
  CreateCartResponse,
  PaginationQueryParams,
  GetPurchaseHistoryResponse,
  ConfirmOrderRequest,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const orderApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    createCart: builder.mutation<CreateCartResponse, CreateCartRequest>({
      query(body) {
        return {
          body,
          method: "POST",
          url: "create-cart",
        };
      },
      invalidatesTags: () => [QUERY_KEYS.ORDER],
    }),

    getCarts: builder.query<GetCartsResponse, void>({
      query() {
        return {
          url: "carts",
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.ORDER, id: "LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getPurchaseHistory: builder.query<
      GetPurchaseHistoryResponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          url: "purchase-history",
          params,
        };
      },
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.ORDER, id: "PURCHASE-LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    confirmOrder: builder.mutation<{success: string}, ConfirmOrderRequest>({
      query(body) {
        return {
          body,
          method: "POST",
          url: "confirm-order",
        };
      },
      invalidatesTags: () => [QUERY_KEYS.ORDER],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCartsQuery,
  useCreateCartMutation,
  useConfirmOrderMutation,
  useGetPurchaseHistoryQuery,
} = orderApi;
