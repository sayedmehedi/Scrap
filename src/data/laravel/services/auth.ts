import {api} from "./api";
import RNFetchBlob from "rn-fetch-blob";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import auth from "@react-native-firebase/auth";
import {ConfigService} from "@config/ConfigService";
import LoginUserDto from "@core/domain/dto/LoginUserDto";
import RegisterUserDto from "@core/domain/dto/RegisterUserDto";
import {ApplicationError} from "@core/domain/ApplicationError";
import {AccessToken, LoginManager} from "react-native-fbsdk-next";
import {isErrorWithMessage, isNativeModuleError} from "@utils/error-handling";
import {
  statusCodes,
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import {
  RootState,
  LoginResponse,
  RegisterResponse,
  VerifyEmailRequest,
  SocialLoginResponse,
  SocialLoginRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  PaginationQueryParams,
  ChangePasswordRequest,
  GetUserProfileReponse,
  GetTransactionsResponse,
  GetNotificationsResponse,
} from "@src/types";

const config = container.get<ConfigService>(ConfigService);

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
    socialLogin: builder.mutation<LoginResponse, SocialLoginRequest>({
      query(body) {
        console.log("socialLogin got called");
        return {
          body,
          method: "POST",
          url: "social-login",
        };
      },
    }),
    loginWithGoogle: builder.mutation<SocialLoginResponse, void>({
      async queryFn() {
        // First e user er login info anbo
        // jdi kono info na thake tar mane ety first google diye login
        // sei khetre just login kre info gula store kra
        // noile jdi info thake r oi info er mddhe google er info na thake to eta google diye first time r fb diye already hoe gese
        // ty age fb er credentials ta diye login kre then google er take link kra

        // Get the users ID token
        try {
          const {idToken} = await GoogleSignin.signIn();
          console.log("got id token", idToken);
          // Create a Google credential with the token
          const googleCredential = auth.GoogleAuthProvider.credential(idToken);
          console.log("googleCredential", googleCredential);

          // Sign-in the user with the credential
          const userCreds = await auth().signInWithCredential(googleCredential);

          console.log(
            "got firebase user creds",
            userCreds.user.uid,
            userCreds.user.email,
            userCreds.user.displayName,
          );

          return {
            data: {
              provider: "google",
              email: userCreds.user.email!,
              name: userCreds.user.displayName!,
              firebase_auth_id: userCreds.user.uid!,
            },
          };
        } catch (err) {
          console.log("error happended with google login", err);

          let non_field_error = "";

          if (isNativeModuleError(err)) {
            if (err.code === statusCodes.SIGN_IN_CANCELLED) {
              non_field_error = "Cancelled";
            } else if (err.code === statusCodes.IN_PROGRESS) {
              non_field_error = "In progress";
            } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              non_field_error = "Play service not available";
            } else {
              non_field_error = "Some native error happened";
            }
          } else if (isErrorWithMessage(err)) {
            non_field_error = err.message;
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
      },
    }),
    loginWithFacebook: builder.mutation<SocialLoginResponse, void>({
      async queryFn() {
        // Get the users ID token
        try {
          const result = await LoginManager.logInWithPermissions([
            "email",
            "public_profile",
          ]);

          if (result.isCancelled) {
            return {
              error: {
                data: {
                  non_field_error: "Cancelled the login process",
                  field_errors: {},
                },
                status: 400,
              },
            };
          }

          // Once signed in, get the users AccesToken
          const data = await AccessToken.getCurrentAccessToken();

          if (!data) {
            return {
              error: {
                data: {
                  non_field_error:
                    "Something went wrong obtaining access token",
                  field_errors: {},
                },
                status: 400,
              },
            };
          }

          console.log("fb access token", data.accessToken);
          // Create a Google credential with the token
          const facebookCredential = auth.FacebookAuthProvider.credential(
            data.accessToken,
          );
          console.log("facebookCredential", facebookCredential);

          // Sign-in the user with the credential
          const userCreds = await auth().signInWithCredential(
            facebookCredential,
          );

          console.log(
            "got firebase user creds",
            userCreds.user.uid,
            userCreds.user.email,
            userCreds.user.displayName,
          );

          return {
            data: {
              provider: "facebook",
              email: userCreds.user.email!,
              name: userCreds.user.displayName!,
              firebase_auth_id: userCreds.user.uid!,
            },
          };
        } catch (err) {
          console.log("error happended with facebook login", err);

          let non_field_error = "";

          if (isErrorWithMessage(err)) {
            non_field_error = err.message;
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
    verifyEmail: builder.mutation<
      {success: string} | {error: string},
      VerifyEmailRequest
    >({
      query(body) {
        return {
          body,
          method: "POST",
          url: "verify-email",
        };
      },
    }),
    resendOtp: builder.mutation<
      {success: string} | {error: string},
      {email: string}
    >({
      query(body) {
        return {
          body,
          method: "POST",
          url: "resend-otp",
        };
      },
    }),
    updateProfile: builder.mutation<
      {success: string} | {error: string},
      UpdateProfileRequest & {
        onUploadProgress?: (sent: number, total: number) => void;
      }
    >({
      invalidatesTags: () => [QUERY_KEYS.AUTH],
      queryFn({onUploadProgress, ...data}, {getState}) {
        const authToken = (getState() as RootState).auth.token;

        const payload = [];

        if (!!data.name) {
          payload.push({
            name: "name",
            data: data.name,
          });
        }

        if (!!data.email) {
          payload.push({
            name: "email",
            data: data.email,
          });
        }

        if (!!data.phone) {
          payload.push({
            name: "phone",
            data: data.phone,
          });
        }

        if (!!data.location) {
          payload.push({
            name: "location",
            data: data.location,
          });
        }

        if (!!data.latitude) {
          payload.push({
            name: "latitude",
            data: data.latitude,
          });
        }

        if (!!data.longitude) {
          payload.push({
            name: "longitude",
            data: data.longitude,
          });
        }

        if (!!data.image) {
          payload.push({
            name: "image",
            type: data.image.type,
            filename: data.image.fileName,
            data: RNFetchBlob.wrap(data.image.uri!),
          });
        }

        if (!!data.country_id) {
          payload.push({
            name: "country_id",
            data: data.country_id,
          });
        }

        if (!!data.state_id) {
          payload.push({
            name: "state_id",
            data: data.state_id,
          });
        }

        if (!!data.city_id) {
          payload.push({
            name: "city_id",
            data: data.city_id,
          });
        }

        return RNFetchBlob.config({
          trusty: true,
          timeout: 5000,
        })
          .fetch(
            "POST",
            `${config.apiBaseURL}/update-profile`,
            {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
            payload,
          )
          .uploadProgress((sent, total) => {
            onUploadProgress?.(sent, total);
          })
          .then(
            res => res.json() as Promise<{success: string} | {error: string}>,
          )
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useRegisterMutation,
  useResendOtpMutation,
  useVerifyEmailMutation,
  useLazyGetProfileQuery,
  useSocialLoginMutation,
  useGetTransactionsQuery,
  useGetNotificationsQuery,
  useUpdateProfileMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLazyGetTransactionsQuery,
  useLoginWithGoogleMutation,
  useLoginWithFacebookMutation,
  useLazyGetNotificationsQuery,
} = authApi;
