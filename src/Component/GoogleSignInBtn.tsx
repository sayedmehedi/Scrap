import React from "react";
import {Text, useTheme} from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {TouchableOpacity, Image} from "react-native";
import {useLoginWithGoogleMutation} from "@data/laravel/services/auth";

export default function GoogleSignInBtn() {
  const theme = useTheme();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();

  const [loginWithGoogle, {isLoading, isSuccess, data}] =
    useLoginWithGoogleMutation();

  function onGoogleButtonPress() {
    loginWithGoogle();
  }

  React.useEffect(() => {
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
  }, [enqueueSuccessSnackbar, isSuccess, data, enqueueErrorSnackbar]);

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
