import React from "react";
import {AuthStackParamList} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Text, HelperText} from "react-native-paper";
import {useForm, Controller} from "react-hook-form";
import Entypo from "react-native-vector-icons/Entypo";
import {ErrorMessage} from "@hookform/error-message";
import {ScrollView} from "react-native-gesture-handler";
import {AuthStackRoutes} from "../../constants/routes";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useResetPasswordMutation} from "@data/laravel/services/auth";
import {
  View,
  Image,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import {
  setGlobalStyles,
  FloatingLabelInput,
} from "react-native-floating-label-input";

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
  typeof AuthStackRoutes.RESET_PASSWORD
>;

const ResetPasswordScreen = ({navigation, route}: Props) => {
  const [toggleNewPassword, setToggleNewPassword] = React.useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] =
    React.useState(false);
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();

  const [resetPassword, {isLoading, isSuccess, data}] =
    useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      reset();
      enqueueSuccessSnackbar({
        text1: "Success",
        text2: data.success,
      });

      navigation.navigate(AuthStackRoutes.LOGIN, {});
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: data.error,
      });
    }
  }, [data, isSuccess, enqueueErrorSnackbar, enqueueSuccessSnackbar]);

  const handleResetPassword = handleSubmit(values => {
    resetPassword({
      otp: values.otp,
      email: route.params.email,
      password: values.password,
      password_confirmation: values.confirmPassword,
    });
  });

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

            <Text style={{fontSize: 22, fontWeight: "bold"}}>
              Reset Password
            </Text>
          </View>

          <KeyboardAvoidingView
            style={{flexWrap: "wrap", marginTop: 20}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                control={control}
                rules={{
                  required: "This field is required",
                }}
                name={"password"}
                render={({field}) => {
                  return (
                    <FloatingLabelInput
                      isPassword
                      label={"Password"}
                      value={field.value}
                      togglePassword={toggleNewPassword}
                      onChangeText={field.onChange}
                      rightComponent={
                        <Pressable
                          style={{
                            justifyContent: "center",
                          }}
                          onPress={() =>
                            setToggleNewPassword(prevStae => !prevStae)
                          }>
                          <Entypo
                            size={20}
                            name={toggleNewPassword ? "eye-with-line" : "eye"}
                          />
                        </Pressable>
                      }
                    />
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={"password"}
                render={({message}) => (
                  <HelperText type={"error"}>{message}</HelperText>
                )}
              />
            </View>

            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                control={control}
                rules={{
                  required: "This field is required",
                }}
                name={"confirmPassword"}
                render={({field}) => {
                  return (
                    <FloatingLabelInput
                      isPassword
                      value={field.value}
                      label={"Confirm Password"}
                      onChangeText={field.onChange}
                      togglePassword={toggleConfirmPassword}
                      rightComponent={
                        <Pressable
                          style={{
                            justifyContent: "center",
                          }}
                          onPress={() =>
                            setToggleConfirmPassword(prevStae => !prevStae)
                          }>
                          <Entypo
                            size={20}
                            name={
                              toggleConfirmPassword ? "eye-with-line" : "eye"
                            }
                          />
                        </Pressable>
                      }
                    />
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={"confirmPassword"}
                render={({message}) => (
                  <HelperText type={"error"}>{message}</HelperText>
                )}
              />
            </View>

            <View style={{width: "100%"}}>
              <Controller
                control={control}
                rules={{
                  required: "This field is required",
                }}
                name={"otp"}
                render={({field}) => {
                  return (
                    <FloatingLabelInput
                      label={"Otp"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={"otp"}
                render={({message}) => (
                  <HelperText type={"error"}>{message}</HelperText>
                )}
              />
            </View>
          </KeyboardAvoidingView>

          <AppPrimaryButton
            disabled={isLoading}
            onPress={handleResetPassword}
            containerStyle={{
              marginTop: 40,
              alignSelf: "center",
            }}
            text={"Reset"}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ResetPasswordScreen;
