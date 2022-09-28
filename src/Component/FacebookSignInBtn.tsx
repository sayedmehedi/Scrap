import React from "react";
import {useAppStore} from "@hooks/store";
import {useTheme} from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {TouchableOpacity, Image} from "react-native";
import {AuthStackParamList, RootStackParamList} from "@src/types";
import {AuthStackRoutes, RootStackRoutes} from "@constants/routes";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {
  useSocialLoginMutation,
  useLoginWithFacebookMutation,
} from "@data/laravel/services/auth";

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LoginScreenNavigationProps = NativeStackNavigationProp<
  AuthStackParamList,
  typeof AuthStackRoutes.LOGIN
>;

type LoginScreenRouteProps = RouteProp<
  AuthStackParamList,
  typeof AuthStackRoutes.LOGIN
>;

export default function FacebookSignInBtn() {
  const theme = useTheme();
  const store = useAppStore();

  const route = useRoute<LoginScreenRouteProps>();
  const rootNavigation = useNavigation<RootStackNavigationProp>();
  const navigation = useNavigation<LoginScreenNavigationProps>();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();

  const [loginWithFacebook, {isLoading: isLoadingFbCreds}] =
    useLoginWithFacebookMutation();

  const [socialLogin, {isLoading: isLoadingSocialLogin}] =
    useSocialLoginMutation();

  function onGoogleButtonPress() {
    loginWithFacebook()
      .unwrap()
      .then(data => {
        return socialLogin(data).unwrap();
      })
      .then(data => {
        if (!!data && "success" in data) {
          enqueueSuccessSnackbar({
            text1: data.success,
          });
        }

        if (!!data && "error" in data) {
          enqueueErrorSnackbar({
            text1: data.error,
          });
        }

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
      });
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={onGoogleButtonPress}
        disabled={isLoadingFbCreds || isLoadingSocialLogin}
        style={{
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.white,
        }}>
        <Image source={require("@assets/Images/facebook.png")} />
      </TouchableOpacity>
    </React.Fragment>
  );
}
