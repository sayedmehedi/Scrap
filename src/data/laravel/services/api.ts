import {Axios} from "axios";
import {Mutex} from "async-mutex";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import {ConfigService} from "@config/ConfigService";
import LoginUserDto from "@core/domain/dto/LoginUserDto";
import {loggedOut, tokenReceived} from "@store/actions/auth";
import {ApplicationError} from "@core/domain/ApplicationError";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";
import {
  isErrorWithError,
  isErrorWithErrors,
  isErrorWithException,
  isErrorWithMessage,
  isFetchBaseQueryError,
  isValidationError,
} from "@utils/error-handling";
import {
  RootState,
  LoginResponse,
  JoteyQueryError,
  PaginatedResponse,
  RegisterResponse,
  FullTextSearchResponse,
} from "@src/types";
import {
  createApi,
  FetchArgs,
  BaseQueryFn,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import RegisterUserDto from "@core/domain/dto/RegisterUserDto";

const configService = container.get<ConfigService>(ConfigService);
const apiClient = container.get<Axios>(ServiceProviderTypes.HttpClient);

export function providesList<
  O extends {id: string | number},
  R extends PaginatedResponse<O> | Array<O> | undefined,
  T extends string,
>(
  resultsWithIds: R | undefined,
  error: JoteyQueryError | undefined,
  tagType: T,
) {
  if (error) {
    return [QUERY_KEYS.UNKNOWN_ERROR];
  }

  if (resultsWithIds) {
    const result = Array.isArray(resultsWithIds)
      ? resultsWithIds
      : resultsWithIds.data;
    return [
      {type: tagType, id: "LIST"} as const,
      ...result.map(({id}) => ({type: tagType, id} as const)),
    ];
  }

  return [{type: tagType, id: "LIST"}] as const;
}

// create a new mutex
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: configService.apiBaseURL,
  prepareHeaders: (headers, {getState}) => {
    headers.append("Accept", "application/json");
    headers.append("X-Requested-With", "XMLHttpRequest");
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const laravelBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  JoteyQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const err = result.error;

    let non_field_error = "";

    // you can access all properties of `FetchBaseQueryError` here
    if (
      err.status === "FETCH_ERROR" ||
      err.status === "PARSING_ERROR" ||
      err.status === "CUSTOM_ERROR"
    ) {
      non_field_error = err.error;
    } else if (typeof err.data === "string") {
      non_field_error = err.data;
    } else if (isErrorWithMessage(err.data)) {
      non_field_error = err.data.message;
    } else if (isErrorWithErrors(err.data)) {
      non_field_error = err.data.errors;
    } else if (isErrorWithError(err.data)) {
      non_field_error = err.data.error;
    } else if (isErrorWithException(err.data)) {
      non_field_error = err.data.exception;
    } else if (isErrorWithMessage(err)) {
      non_field_error = err.message;
    } else {
      non_field_error = "Something went wrong";
    }

    // // you can access all properties of `FetchBaseQueryError` here
    // non_field_error =
    //   'error' in err
    //     ? err.error
    //     : isErrorWithMessage(err.data)
    //     ? !!err.data.message
    //       ? err.data.message
    //       : 'Something went wrong'
    //     : typeof err.data === 'string'
    //     ? (err.data as string)
    //     : 'Server gave invalid error format';

    let field_errors: Record<string, string> = {};

    if (err.data && isValidationError(err.data)) {
      non_field_error = "Invalid data";

      field_errors = Object.entries(err.data.errors ?? err.data.error!).reduce(
        (acc, [fieldName, [errorMessage]]) => {
          acc[fieldName] = errorMessage;
          return acc;
        },
        {} as Record<string, string>,
      );
    }

    return {
      error: {
        status: err.status,
        data: {
          field_errors,
          non_field_error,
        },
      },
      meta: result.meta,
    };
  }

  return {
    data: result.data,
    meta: result.meta,
  };
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  JoteyQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await laravelBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await laravelBaseQuery(
          {
            url: "/token",
            method: "POST",
            body: {
              email: "",
              password: "",
            },
          },
          api,
          extraOptions,
        );
        if (refreshResult.data) {
          api.dispatch(tokenReceived(refreshResult.data as string));
          // retry the initial query
          result = await laravelBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await laravelBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    QUERY_KEYS.PRODUCT,
    QUERY_KEYS.CATEGORY,
    QUERY_KEYS.UNAUTHORIZED,
    QUERY_KEYS.UNKNOWN_ERROR,
    QUERY_KEYS.FULL_TEXT_SEARCH,
  ],
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginUserDto>({
      query: credentials => ({
        method: "POST",
        url: "login",
        body: credentials,
      }),
    }),
    register: builder.mutation<RegisterResponse, RegisterUserDto>({
      query: credentials => ({
        method: "POST",
        url: "register",
        body: credentials,
      }),
    }),
    logout: builder.mutation<
      {
        status: string;
        message: string;
      },
      void
    >({
      query() {
        return {
          url: "/logout",
        };
      },
    }),
    refetchErroredQueries: builder.mutation<null, void>({
      queryFn: () => ({data: null}),
      invalidatesTags: [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getFullTextSearch: builder.query<FullTextSearchResponse, {q: string}>({
      query(params) {
        return {
          params,
          url: "search",
        };
      },
      providesTags: result =>
        result ? [QUERY_KEYS.FULL_TEXT_SEARCH] : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetFullTextSearchQuery,
} = api;
