import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  PaginationQueryParams,
  GetConversationsResponse,
  GetConversationDetailsResponse,
} from "@src/types";

// Define a service using a base URL and expected endpoints
export const messageApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getConversations: builder.query<
      GetConversationsResponse,
      PaginationQueryParams
    >({
      query: params => ({
        params,
        url: "messages",
      }),
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.CONVERSATION, id: "LIST"}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getConversationDetails: builder.query<
      GetConversationDetailsResponse,
      {conversationId: number} & PaginationQueryParams
    >({
      query: ({conversationId, ...params}) => ({
        params,
        url: `user-messages/${conversationId}`,
      }),
      providesTags: (result, error, {conversationId: id}) =>
        result
          ? [{type: QUERY_KEYS.CONVERSATION, id}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
  useGetConversationDetailsQuery,
  useLazyGetConversationDetailsQuery,
} = messageApi;
