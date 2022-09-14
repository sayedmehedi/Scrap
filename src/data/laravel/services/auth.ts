import {api} from "./api";
import {QUERY_KEYS} from "@constants/query";
import {
  GetNotificationsResponse,
  GetUserProfileReponse,
  LoginResponse,
  PaginationQueryParams,
  RegisterResponse,
} from "@src/types";
import LoginUserDto from "@core/domain/dto/LoginUserDto";
import RegisterUserDto from "@core/domain/dto/RegisterUserDto";

// Define a service using a base URL and expected endpoints
export const authApi = api.injectEndpoints({
  overrideExisting: true,
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
    getProfile: builder.query<GetUserProfileReponse, void>({
      query() {
        return {
          url: "profile",
        };
      },
      providesTags: (result, error) =>
        result
          ? [QUERY_KEYS.AUTH]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getNotifications: builder.query<
      GetNotificationsResponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          url: "notifications",
          params,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRegisterMutation,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
} = authApi;
