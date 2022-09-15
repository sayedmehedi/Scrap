import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {PaginationQueryParams, GetQuestionsResponse} from "@src/types";
import CreateAskQuestionRequest from "@core/domain/dto/CreateAskQuestionRequest";

// Define a service using a base URL and expected endpoints
export const questionApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getQuestions: builder.query<GetQuestionsResponse, PaginationQueryParams>({
      query: params => ({
        params,
        url: `index-ques`,
      }),
      providesTags: (result, error) =>
        result
          ? [{type: QUERY_KEYS.QUESTION, id: `LIST`}]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    createAskQuestion: builder.mutation<
      {success: string},
      CreateAskQuestionRequest
    >({
      query(body) {
        return {
          body,
          method: "POST",
          url: "ask-question",
        };
      },
      invalidatesTags: () => [{type: QUERY_KEYS.QUESTION, id: `LIST`}],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetQuestionsQuery,
  useLazyGetQuestionsQuery,
  useCreateAskQuestionMutation,
} = questionApi;
