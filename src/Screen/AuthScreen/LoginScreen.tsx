import React from "react";
import auth from "@react-native-firebase/auth";
import { useAppSelector } from "@hooks/store";
import { AuthStackParamList } from "@src/types";
import { useTheme, Text } from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import { useForm, Controller } from "react-hook-form";
import Entypo from "react-native-vector-icons/Entypo";
import { ErrorMessage } from "@hookform/error-message";
import { selectIsAuthenticated } from "@store/slices/authSlice";
import { useGetProfileQuery, useLoginMutation } from "@data/laravel/services/auth";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AuthStackRoutes, RootStackRoutes } from "../../constants/routes";
import { addServerErrors, isJoteyQueryError } from "@utils/error-handling";
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

GoogleSignin.configure({
  webClientId:
    "1098035251669-j4gopt4e5ce00kc8jd16hh3ua6mlg75h.apps.googleusercontent.com",
});

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

type Props = NativeStackScreenProps<AuthStackParamList, typeof AuthStackRoutes.LOGIN>

const LoginScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const { enqueueSuccessSnackbar } = useAppSnackbar();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [togglePassword, setTogglePassword] = React.useState(false);

  const [login, { isLoading, isError, error, isSuccess, data }] = useLoginMutation();

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors },
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
    if (isSuccess && data) {
      reset()
      enqueueSuccessSnackbar({
        text1: data.success
      })
    }
  }, [enqueueSuccessSnackbar, isSuccess, data, reset])

  React.useEffect(() => {
    if (isAuthenticated) {
      if (route.params?.nextScreen) {
        // @ts-ignore
        navigation.navigate(route.params?.nextScreen.name, route.params?.nextScreen.params)
      } else {
        // @ts-ignore
        navigation.navigate(RootStackRoutes.HOME)
      }
    }
  }, [route, navigation, isAuthenticated])

  async function onGoogleButtonPress() {
    // Get the users ID token
    try {
      const { idToken } = await GoogleSignin.signIn();
      console.log(idToken);

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  }

  const handleLogin = handleSubmit(values => {
    login(values)
  });

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                paddingVertical: 10,
              }}>
              <Image
                style={{ height: 100, width: 100 }}
                source={require("../../assets/Images/logo.png")}
              />
            </View>

            <Text style={{ fontSize: 22, fontWeight: "bold" }}>Sign In</Text>
          </View>

          <View
            style={{
              paddingBottom: 20,
              flexDirection: "row",
            }}>
            <View style={{ width: "50%", alignItems: "center" }}>
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
              style={{ width: "50%", alignItems: "center" }}
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

          <KeyboardAvoidingView
            style={{ flexWrap: "wrap" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{ width: "100%", marginBottom: 16 }}>
              <Controller
                control={control}
                name={"email"}
                render={({ field }) => {
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
                render={({ message }) => (
                  <Text style={{ color: theme.colors.error, marginTop: 10 }}>
                    {message}
                  </Text>
                )}
              />
            </View>

            <View style={{ width: "100%" }}>
              <Controller
                control={control}
                name={"password"}
                render={({ field }) => {
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
                render={({ message }) => (
                  <Text style={{ color: theme.colors.error, marginTop: 10 }}>
                    {message}
                  </Text>
                )}
              />
            </View>
          </KeyboardAvoidingView>

          <View
            style={{
              marginTop: 15,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                justifyContent: "space-between",
              }}>
              <TouchableOpacity
                onPress={onGoogleButtonPress}
                style={{
                  width: 60,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  // @ts-ignore
                  backgroundColor: theme.colors.white,
                }}>
                <Image source={require("../../assets/Images/google.png")} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: 60,
                  height: 60,
                  alignItems: "center",
                  backgroundColor: "white",
                  justifyContent: "center",
                }}>
                <Image source={require("../../assets/Images/facebook.png")} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default LoginScreen;
