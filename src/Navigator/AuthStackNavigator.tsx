import React from "react";
import {forFade} from "@utils/misc";
import {useTheme} from "react-native-paper";
import {AuthStackParamList} from "@src/types";
import {AuthStackRoutes} from "../constants/routes";
import OtpScreen from "@src/Screen/AuthScreen/OtpScreen";
import LoginScreen from "../Screen/AuthScreen/LoginScreen";
import {createStackNavigator} from "@react-navigation/stack";
import RegistrationScreen from "../Screen/AuthScreen/RegistrationScreen";
import ResetPasswordScreen from "../Screen/AuthScreen/ResetPasswordScreen";
import ForgotPasswordScreen from "../Screen/AuthScreen/ForgotPasswordScreen";

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
  const theme = useTheme();

  return (
    <AuthStack.Navigator
      initialRouteName={AuthStackRoutes.LOGIN}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-Bold",
          color: theme.colors.white,
        },
        headerTintColor: theme.colors.white,
        cardStyleInterpolator: forFade,
      }}>
      <AuthStack.Screen component={LoginScreen} name={AuthStackRoutes.LOGIN} />

      <AuthStack.Screen
        options={{
          title: "Reset Password",
        }}
        component={ResetPasswordScreen}
        name={AuthStackRoutes.RESET_PASSWORD}
      />

      <AuthStack.Screen
        options={{
          title: "Register",
        }}
        component={RegistrationScreen}
        name={AuthStackRoutes.REGISTRATION}
      />

      <AuthStack.Screen
        options={{
          title: "Forgot Password",
        }}
        component={ForgotPasswordScreen}
        name={AuthStackRoutes.FORGOT_PASSWORD}
      />

      <AuthStack.Screen
        options={{
          title: "Email Verification",
        }}
        component={OtpScreen}
        name={AuthStackRoutes.OTP}
      />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
