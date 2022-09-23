import React from "react";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {useForm, Controller} from "react-hook-form";
import Entypo from "react-native-vector-icons/Entypo";
import {ErrorMessage} from "@hookform/error-message";
import {useNavigation} from "@react-navigation/native";
import {useAppSelector, useAppStore} from "@hooks/store";
import GoogleSignInBtn from "@src/Component/GoogleSignInBtn";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthStackParamList, RootStackParamList} from "@src/types";
import {useTheme, Text, ActivityIndicator} from "react-native-paper";
import {AuthStackRoutes, RootStackRoutes} from "../../constants/routes";
import {addServerErrors, isJoteyQueryError} from "@utils/error-handling";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import {
  useLoginMutation,
  useLazyGetProfileQuery,
} from "@data/laravel/services/auth";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  View,
  Image,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import {
  setGlobalStyles,
  FloatingLabelInput,
} from "react-native-floating-label-input";
import FacebookSignInBtn from "@src/Component/FacebookSignInBtn";

setGlobalStyles.containerStyles = {
  height: 58,
  borderRadius: 6,
  paddingHorizontal: 10,
  backgroundColor: "#fff",
};

setGlobalStyles.customLabelStyles = {
  fontSizeFocused: 12,
  fontSizeBlurred: 15,
  colorFocused: "#707070",
  colorBlurred: "#707070",
};

setGlobalStyles.labelStyles = {
  paddingTop: 5,
  paddingHorizontal: 5,
  fontFamily: "Inter-Regular",
};

setGlobalStyles.inputStyles = {
  fontSize: 15,
  marginTop: 15,
  color: "#707070",
  fontWeight: "600",
};

type Props = NativeStackScreenProps<
  AuthStackParamList,
  typeof AuthStackRoutes.LOGIN
>;

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const store = useAppStore();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const rootNavigation = useNavigation<RootStackNavigationProp>();
  const [togglePassword, setTogglePassword] = React.useState(false);
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const socialLoginState = useAppSelector(
    state => state.authLoading.socialLoginState,
  );

  const [login, {isLoading, isError, error, isSuccess, data}] =
    useLoginMutation();

  const [getProfile, {isSuccess: isGettingProfileSuccess, data: profileData}] =
    useLazyGetProfileQuery();

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    if (isError && isJoteyQueryError(error)) {
      addServerErrors(error.data.field_errors, setError);
    }
  }, [setError, isError, error]);

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      reset();
      enqueueSuccessSnackbar({
        text1: data.success,
      });
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: data.error,
      });
    }
  }, [enqueueSuccessSnackbar, isSuccess, data, reset, enqueueErrorSnackbar]);

  React.useEffect(() => {
    if (isAuthenticated && isGettingProfileSuccess && !!profileData) {
      const {firstTimeLogin} = store.getState().auth;
      if (firstTimeLogin) {
        rootNavigation.replace(RootStackRoutes.LOCATION_PROMPT, {
          nextScreen: route.params.nextScreen,
        });
      } else if (route.params?.nextScreen) {
        // @ts-ignore
        navigation.replace(
          // @ts-ignore
          route.params?.nextScreen.name,
          // @ts-ignore
          route.params?.nextScreen.params,
        );
      } else {
        // @ts-ignore
        navigation.replace(RootStackRoutes.HOME);
      }
    }
  }, [
    store,
    route,
    navigation,
    profileData,
    isAuthenticated,
    isGettingProfileSuccess,
  ]);

  const handleLogin = handleSubmit(values => {
    login(values)
      .unwrap()
      .then(() => {
        getProfile(undefined, false);
      });
  });

  if (isLoading || socialLoginState === "pending") {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <View style={{alignItems: "center"}}>
            <View
              style={{
                paddingVertical: 10,
              }}>
              <Image
                style={{height: 100, width: 100}}
                source={require("../../assets/Images/logo.png")}
              />
            </View>

            <Text style={{fontSize: 22, fontWeight: "bold"}}>Sign In</Text>
          </View>

          <View
            style={{
              paddingBottom: 20,
              flexDirection: "row",
            }}>
            <View style={{width: "50%", alignItems: "center"}}>
              <Text
                style={{
                  margin: 15,
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme.colors.primary,
                }}>
                Login
              </Text>

              <View
                style={{
                  height: 2,
                  width: "100%",
                  backgroundColor: theme.colors.primary,
                }}
              />
            </View>

            <Pressable
              style={{width: "50%", alignItems: "center"}}
              onPress={() => navigation.navigate(AuthStackRoutes.REGISTRATION)}>
              <Text
                style={{
                  margin: 15,
                  fontSize: 16,
                  color: "#023047",
                  fontWeight: "bold",
                }}>
                Register
              </Text>

              <View
                style={{
                  height: 2,
                  opacity: 0.25,
                  width: "100%",
                  backgroundColor: "#023047",
                }}
              />
            </Pressable>
          </View>

          <ScrollView>
            <KeyboardAvoidingView
              style={{flexWrap: "wrap"}}
              behavior={Platform.OS === "ios" ? "padding" : "height"}>
              <View style={{width: "100%", marginBottom: 16}}>
                <Controller
                  control={control}
                  name={"email"}
                  render={({field}) => {
                    return (
                      <FloatingLabelInput
                        label={"Email"}
                        value={field.value}
                        onChangeText={field.onChange}
                      />
                    );
                  }}
                />

                <ErrorMessage
                  errors={errors}
                  name={"email"}
                  render={({message}) => (
                    <Text style={{color: theme.colors.error, marginTop: 10}}>
                      {message}
                    </Text>
                  )}
                />
              </View>

              <View style={{width: "100%"}}>
                <Controller
                  control={control}
                  name={"password"}
                  render={({field}) => {
                    return (
                      <FloatingLabelInput
                        isPassword
                        label={"Password"}
                        value={field.value}
                        togglePassword={togglePassword}
                        onChangeText={field.onChange}
                        rightComponent={
                          <Pressable
                            style={{
                              justifyContent: "center",
                            }}
                            onPress={() =>
                              setTogglePassword(prevStae => !prevStae)
                            }>
                            <Entypo
                              size={20}
                              name={togglePassword ? "eye-with-line" : "eye"}
                            />
                          </Pressable>
                        }
                      />
                    );
                  }}
                />

                <ErrorMessage
                  errors={errors}
                  name={"email"}
                  render={({message}) => (
                    <Text style={{color: theme.colors.error, marginTop: 10}}>
                      {message}
                    </Text>
                  )}
                />
              </View>
            </KeyboardAvoidingView>
          </ScrollView>

          <View
            style={{
              marginTop: 15,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              {/* <Controller
                control={control}
                name={"rememberMe"}
                render={({field}) => {
                  return (
                    <Checkbox
                      position={"trailing"}
                      status={field.value ? "checked" : "unchecked"}
                      onPress={() => {
                        field.onChange(!field.value);
                      }}
                    />
                  );
                }}
              />
              <Text>Remember Me</Text> */}
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(AuthStackRoutes.FORGOT_PASSWORD)
              }>
              <Text
                style={{
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <AppPrimaryButton
            text={"Login"}
            containerStyle={{
              alignSelf: "center",
            }}
            onPress={handleLogin}
            disabled={isLoading}
          />

          <View
            style={{
              marginTop: 20,
              marginLeft: "auto",
              marginRight: "auto",
            }}>
            <Text
              style={{
                fontSize: 14,
                color: "#111111",
                fontWeight: "600",
                marginBottom: 15,
              }}>
              Or login with social media
            </Text>

            <View
              style={{
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "center",
              }}>
              <View
                style={{
                  marginRight: 20,
                }}>
                <GoogleSignInBtn />
              </View>

              <View>
                <FacebookSignInBtn />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default LoginScreen;
