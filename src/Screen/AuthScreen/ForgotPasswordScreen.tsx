import React from "react";
import {useTheme, Text, HelperText} from "react-native-paper";
import {useForm, Controller} from "react-hook-form";
import {AuthStackRoutes} from "../../constants/routes";
import {useNavigation} from "@react-navigation/native";
import {ScrollView} from "react-native-gesture-handler";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {View, Image, Platform, KeyboardAvoidingView} from "react-native";
import {
  setGlobalStyles,
  FloatingLabelInput,
} from "react-native-floating-label-input";
import {useForgotPasswordMutation} from "@data/laravel/services/auth";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {AuthStackParamList} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {ErrorMessage} from "@hookform/error-message";

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
  typeof AuthStackRoutes.FORGOT_PASSWORD
>;

const ForgotPasswordScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const {
    watch,
    control,
    reset,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const [forgotPassword, {isLoading, isSuccess, data}] =
    useForgotPasswordMutation();

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      reset();
      enqueueSuccessSnackbar({
        text1: "Success",
        text2: data.success,
      });
      navigation.navigate(AuthStackRoutes.RESET_PASSWORD, {
        email,
      });
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: data.error,
      });
    }
  }, [data, isSuccess, enqueueErrorSnackbar, enqueueSuccessSnackbar, email]);

  const handleForgotPassword = handleSubmit(({email}) => {
    forgotPassword({
      email,
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
              Forgot Password
            </Text>

            <Text
              style={{
                fontSize: 14,
                marginTop: 10,
                marginBottom: 20,
                color: theme.colors.tertiary,
              }}>
              No worries, We'll send you reset your passward.
            </Text>
          </View>

          <KeyboardAvoidingView
            style={{flexWrap: "wrap"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                name={"email"}
                rules={{
                  required: "This field is required",
                }}
                control={control}
                render={({field}) => {
                  return (
                    <FloatingLabelInput
                      label={"Email"}
                      value={field.value}
                      keyboardType={"email-address"}
                      onChangeText={field.onChange}
                    />
                  );
                }}
              />

              <ErrorMessage
                name={"email"}
                errors={errors}
                render={({message}) => (
                  <HelperText type={"error"}>{message}</HelperText>
                )}
              />
            </View>
          </KeyboardAvoidingView>

          <AppPrimaryButton
            disabled={isLoading}
            onPress={handleForgotPassword}
            containerStyle={{
              alignSelf: "center",
              marginTop: 40,
            }}
            text={"Submit"}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ForgotPasswordScreen;
