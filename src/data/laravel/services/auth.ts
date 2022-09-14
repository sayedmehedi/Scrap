import {api} from "./api";
import {Axios} from "axios";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import LoginUserDto from "@core/domain/dto/LoginUserDto";
import RegisterUserDto from "@core/domain/dto/RegisterUserDto";
import {ApplicationError} from "@core/domain/ApplicationError";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";
import {
  LoginResponse,
  RegisterResponse,
  UpdateProfileRequest,
  PaginationQueryParams,
  GetUserProfileReponse,
  GetTransactionsResponse,
  GetNotificationsResponse,
} from "@src/types";

const apiClient = container.get<Axios>(ServiceProviderTypes.HttpClient);

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
      providesTags: (result, error) =>
        result
          ? [QUERY_KEYS.NOTIFICATION]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    getTransactions: builder.query<
      GetTransactionsResponse,
      PaginationQueryParams
    >({
      query(params) {
        return {
          url: "transactions",
          params,
        };
      },
      providesTags: (result, error) =>
        result
          ? [QUERY_KEYS.TRANSACTION]
          : error?.status === 401
          ? [QUERY_KEYS.UNAUTHORIZED]
          : [QUERY_KEYS.UNKNOWN_ERROR],
    }),
    updateProfile: builder.mutation<
      {success: string},
      UpdateProfileRequest & {onUploadProgress?: (event: ProgressEvent) => void}
    >({
      invalidatesTags: () => [QUERY_KEYS.AUTH],
      queryFn({onUploadProgress, ...data}) {
        const body = new FormData();

        if (!!data.name) {
          body.append("name", data.name);
        }

        if (!!data.email) {
          body.append("email", data.email);
        }

        if (!!data.phone) {
          body.append("phone", data.phone);
        }

        if (!!data.location) {
          body.append("location", data.location);
        }

        if (!!data.latitude) {
          body.append("latitude", data.latitude);
        }

        if (!!data.longitude) {
          body.append("longitude", data.longitude);
        }

        if (!!data.image) {
          body.append("image", {
            uri: data.image.uri,
            type: data.image.type,
            name: data.image.fileName,
          });
        }

        if (!!data.country_id) {
          body.append("country_id", data.country_id);
        }

        if (!!data.state_id) {
          body.append("state_id", data.state_id);
        }

        if (!!data.city_id) {
          body.append("city_id", data.city_id);
        }

        return apiClient
          .post<{success: string}>("update-profile", body, {
            onUploadProgress,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(res => {
            return {
              data: res.data,
            };
          })
          .catch((error: ApplicationError) => {
            return {
              error: {
                status: error.status,
                data: {
                  field_errors: error.field_errors,
                  non_field_error: error.non_field_error,
                },
              },
              meta: error.response,
            };
          });
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
  useGetTransactionsQuery,
  useGetNotificationsQuery,
  useUpdateProfileMutation,
  useLazyGetTransactionsQuery,
  useLazyGetNotificationsQuery,
} = authApi;
