import React from "react";
import {forFade} from "@utils/misc";
import {useTheme} from "react-native-paper";
import {TouchableOpacity} from "react-native";
import {AuthStackParamList} from "@src/types";
import {AuthStackRoutes, RootStackRoutes} from "../constants/routes";
import LoginScreen from "../Screen/AuthScreen/LoginScreen";
import {createStackNavigator} from "@react-navigation/stack";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
          // @ts-ignore
          color: theme.colors.white,
        },
        // @ts-ignore
        headerTintColor: theme.colors.white,
        cardStyleInterpolator: forFade,
      }}>
      <AuthStack.Screen
        options={({navigation, route}) => ({
          title: "Login",
          headerLeft: ({onPress}) => {
            return (
              <TouchableOpacity
                style={{paddingLeft: 15}}
                onPress={() => {
                  if (route.params.backScreen) {
                    navigation.navigate(
                      route.params.backScreen.name,
                      route.params.backScreen.params,
                    );
                  } else {
                    navigation.navigate(RootStackRoutes.HOME);
                  }
                }}>
                <MaterialIcons
                  size={22}
                  color={"white"}
                  name="keyboard-backspace"
                />
              </TouchableOpacity>
            );
          },
        })}
        component={LoginScreen}
        name={AuthStackRoutes.LOGIN}
      />

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
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
