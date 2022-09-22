import React from "react";
import {Text, useTheme} from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {TouchableOpacity, Image} from "react-native";
import {useAppDispatch, useAppStore} from "@hooks/store";
import {setFirstTimeLoginFalse} from "@store/slices/authSlice";
import {AuthStackParamList, RootStackParamList} from "@src/types";
import {AuthStackRoutes, RootStackRoutes} from "@constants/routes";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useLoginWithGoogleMutation} from "@data/laravel/services/auth";

type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LoginScreenNavigationProps = NativeStackNavigationProp<
  AuthStackParamList,
  typeof AuthStackRoutes.LOGIN
>;

type LoginScreenRouteProps = RouteProp<
  AuthStackParamList,
  typeof AuthStackRoutes.LOGIN
>;

export default function GoogleSignInBtn() {
  const theme = useTheme();
  const store = useAppStore();
  const dispatch = useAppDispatch();

  const route = useRoute<LoginScreenRouteProps>();
  const rootNavigation = useNavigation<RootStackNavigationProp>();
  const navigation = useNavigation<LoginScreenNavigationProps>();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();

  const [loginWithGoogle, {isLoading, isSuccess, data}] =
    useLoginWithGoogleMutation();

  function onGoogleButtonPress() {
    loginWithGoogle()
      .unwrap()
      .then(data => {
        if (isSuccess && !!data && "success" in data) {
          enqueueSuccessSnackbar({
            text1: data.success,
          });
        }

        if (isSuccess && !!data && "error" in data) {
          enqueueErrorSnackbar({
            text1: data.error,
          });
        }

        const {firstTimeLogin} = store.getState().auth;
        if (firstTimeLogin) {
          rootNavigation.replace(RootStackRoutes.LOCATION_PROMPT, {
            nextScreen: route.params.nextScreen,
          });
          dispatch(setFirstTimeLoginFalse());
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
        disabled={isLoading}
        onPress={onGoogleButtonPress}
        style={{
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.white,
        }}>
        <Image source={require("@assets/Images/google.png")} />
      </TouchableOpacity>
      {isLoading && <Text>Loading..</Text>}
    </React.Fragment>
  );
}
