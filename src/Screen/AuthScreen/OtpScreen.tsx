import React from "react";
import {AuthStackParamList} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {useForm, Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {AuthStackRoutes} from "../../constants/routes";
import {Text, HelperText} from "react-native-paper";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {View, Platform, KeyboardAvoidingView, TextInput} from "react-native";
import {
  useResendOtpMutation,
  useVerifyEmailMutation,
} from "@data/laravel/services/auth";

type Props = NativeStackScreenProps<
  AuthStackParamList,
  typeof AuthStackRoutes.OTP
>;

const OtpScreen = ({navigation, route}: Props) => {
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const {
    reset,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const [verifyEmail, {isLoading}] = useVerifyEmailMutation();
  const [resendOtp, {isLoading: isResendingOtp}] = useResendOtpMutation();

  const handleForgotPassword = handleSubmit(values => {
    verifyEmail({
      otp: +values.otp,
      email: route.params.email,
    })
      .unwrap()
      .then(data => {
        if (!!data && "success" in data) {
          reset();
          enqueueSuccessSnackbar({
            text1: "Success",
            text2: data.success,
          });
        }

        if (!!data && "error" in data) {
          enqueueErrorSnackbar({
            text1: "Error",
            text2: data.error,
          });
        }
        navigation.navigate(AuthStackRoutes.LOGIN, {});
      });
  });

  const handleResendOtp = () => {
    resendOtp({
      email: route.params.email,
    })
      .unwrap()
      .then(data => {
        if (!!data && "success" in data) {
          reset();
          enqueueSuccessSnackbar({
            text1: "Success",
            text2: data.success,
          });
        }

        if (!!data && "error" in data) {
          enqueueErrorSnackbar({
            text1: "Error",
            text2: data.error,
          });
        }
      });
  };

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={{flex: 1, padding: 15, paddingTop: 35}}>
          <View style={{alignItems: "center"}}>
            <Text style={{fontSize: 22, fontWeight: "bold"}}>
              Verification Code
            </Text>
          </View>

          <KeyboardAvoidingView
            style={{flexWrap: "wrap"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{width: "100%", marginVertical: 16}}>
              <Controller
                name={"otp"}
                rules={{
                  maxLength: 4,
                  minLength: 4,
                  pattern: {
                    value: /\d{4}/,
                    message: "Invalid otp",
                  },
                  required: "This field is required",
                }}
                control={control}
                render={({field}) => {
                  return (
                    <TextInput
                      textAlign={"center"}
                      value={field.value}
                      keyboardType={"numeric"}
                      textAlignVertical={"center"}
                      onChangeText={field.onChange}
                      placeholder={"Enter your OTP here."}
                      style={{
                        textAlign: "center",
                        flex: 1,
                      }}
                    />
                  );
                }}
              />

              <HelperText
                type={"info"}
                style={{
                  textAlign: "center",
                }}>
                An authentication code has been sent to {route.params.email}
              </HelperText>

              <ErrorMessage
                name={"otp"}
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
              marginTop: 40,
              alignSelf: "center",
            }}
            text={"Verify Now"}
          />

          <View style={{marginTop: 30}}>
            <Text style={{marginBottom: 10, textAlign: "center"}}>
              I didn't receive code.
            </Text>

            <TouchableOpacity
              style={{
                alignSelf: "center",
              }}
              disabled={isResendingOtp}
              onPress={handleResendOtp}>
              <Text
                style={{
                  textDecorationLine: "underline",
                }}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default OtpScreen;
