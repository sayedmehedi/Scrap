import {api} from "./api";
import {Axios} from "axios";
import {container} from "@src/appEngine";
import {QUERY_KEYS} from "@constants/query";
import auth, {FirebaseAuthTypes} from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import LoginUserDto from "@core/domain/dto/LoginUserDto";
import RegisterUserDto from "@core/domain/dto/RegisterUserDto";
import {ApplicationError} from "@core/domain/ApplicationError";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";
import {AccessToken, LoginManager} from "react-native-fbsdk-next";
import {isErrorWithMessage, isNativeModuleError} from "@utils/error-handling";
import {
  statusCodes,
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import {
  LoginResponse,
  RegisterResponse,
  SocialLoginResponse,
  SocialLoginRequest,
  ResetPasswordRequest,
  UpdateProfileRequest,
  PaginationQueryParams,
  ChangePasswordRequest,
  GetUserProfileReponse,
  GetTransactionsResponse,
  GetNotificationsResponse,
  VerifyEmailRequest,
} from "@src/types";

const usersCollection = firestore().collection("Users");

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

          await firestore()
            .collection("Users")
            .doc(userCreds.user.uid)
            .update({
              google: {
                connected: true,
                credential: googleCredential,
              },
            });

          const userLoginInfo = (await firestore()
            .collection("Users")
            .doc(userCreds.user.uid)
            .get()) as {
            facebook?: {
              connected: boolean;
              credential: FirebaseAuthTypes.AuthCredential;
            };
          };

          if (!!userLoginInfo && !userLoginInfo.facebook?.connected) {
            await userCreds.user.linkWithCredential(
              userLoginInfo.facebook!.credential,
            );
          }

          return {
            data: {
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

          await firestore()
            .collection("Users")
            .doc(userCreds.user.uid)
            .update({
              facebook: {
                connected: true,
                credential: facebookCredential,
              },
            });

          const userLoginInfo = (await firestore()
            .collection("Users")
            .doc(userCreds.user.uid)
            .get()) as {
            google?: {
              connected: boolean;
              credential: FirebaseAuthTypes.AuthCredential;
            };
          };

          if (!!userLoginInfo && !userLoginInfo.google?.connected) {
            await userCreds.user.linkWithCredential(
              userLoginInfo.google!.credential,
            );
          }

          return {
            data: {
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
