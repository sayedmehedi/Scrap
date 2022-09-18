import {api} from "./api";
import {Axios} from "axios";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import auth from "@react-native-firebase/auth";
import LoginUserDto from "@core/domain/dto/LoginUserDto";
import {isNativeModuleError} from "@utils/error-handling";
import RegisterUserDto from "@core/domain/dto/RegisterUserDto";
import {ApplicationError} from "@core/domain/ApplicationError";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  LoginResponse,
  RegisterResponse,
  UpdateProfileRequest,
  PaginationQueryParams,
  ChangePasswordRequest,
  GetUserProfileReponse,
  GetTransactionsResponse,
  GetNotificationsResponse,
  ResetPasswordRequest,
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
    forgotPassword: builder.mutation<
      {success: string} | {error: string},
      {email: string}
    >({
      query: body => ({
        body,
        method: "POST",
        url: "reset-password",
      }),
    }),
    resetPassword: builder.mutation<
      {success: string} | {error: string},
      ResetPasswordRequest
    >({
      query: body => ({
        body,
        method: "POST",
        url: "create_password",
      }),
    }),
    loginWithGoogle: builder.mutation<LoginResponse, void>({
      async queryFn() {
        // Get the users ID token
        try {
          const {idToken} = await GoogleSignin.signIn();
          console.log("got id token", idToken);
          // Create a Google credential with the token
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          console.log("googleCredential", googleCredential);

          // Sign-in the user with the credential
          const {
            user: {uid, displayName, email},
          } = await auth().signInWithCredential(googleCredential);

          console.log("got firebase user creds", uid, displayName, email);

          const response = await apiClient.post<LoginResponse>("social-login", {
            email: email,
            name: displayName,
            firebase_auth_id: uid,
          });

          console.log("got server res", response.data);

          if ("error" in response.data) {
            return {
              error: {
                status: response.status,
                data: {
                  field_errors: {},
                  non_field_error: response.data.error,
                },
              },
              meta: response.config,
            };
          }

          return {
            data: response.data,
          };
        } catch (err) {
          console.log("error happended with google login", err);
          if (isNativeModuleError(err)) {
            let non_field_error = "";

            if (err.code === statusCodes.SIGN_IN_CANCELLED) {
              non_field_error = "Cancelled";
            } else if (err.code === statusCodes.IN_PROGRESS) {
              non_field_error = "In progress";
            } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              non_field_error = "Play service not available";
            } else {
              non_field_error = "Some native error happened";
            }

            return {
              error: {
                data: {
                  field_errors: {},
                  non_field_error,
                },
                status: 400,
              },
            };
          }

          // @ts-ignore
          const error: ApplicationError = err;
          return {
            meta: error.request,
            error: {
              status: error.status,
              data: error.getFormattedMessage(),
            },
          };
        }
      },
    }),
    register: builder.mutation<RegisterResponse, RegisterUserDto>({
      query: credentials => ({
        method: "POST",
        url: "register",
        body: credentials,
      }),
    }),
    changePassword: builder.mutation<
      {success: string} | {error: string},
      ChangePasswordRequest
    >({
      query: body => ({
        body,
        method: "POST",
        url: "change-password",
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
          .postForm<{success: string}>("update-profile", body, {
            onUploadProgress,
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
              meta: error.request,
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
  useLazyGetProfileQuery,
  useGetTransactionsQuery,
  useGetNotificationsQuery,
  useUpdateProfileMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLazyGetTransactionsQuery,
  useLazyGetNotificationsQuery,
  useLoginWithGoogleMutation,
} = authApi;
