import React from "react";
import styles from "../styles";
import {useAppSelector} from "@hooks/store";
import useAppSnackbar from "@hooks/useAppSnackbar";
import Feather from "react-native-vector-icons/Feather";
import {View, Text, TouchableOpacity} from "react-native";
import {
  useLoginWithFacebookMutation,
  useSocialLoginMutation,
} from "@data/laravel/services/auth";

export default function FacebookSettingsItem({}: {}) {
  const profile = useAppSelector(state => state.auth.profile);
  // const [openModal, setOpenModal] = React.useState(false);

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
      });
  }

  return (
    <React.Fragment>
      <View style={styles.buttonContainer}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Feather name="facebook" size={20} color={"#707070"} />

          <Text style={{marginLeft: 10, color: "#707070"}}>
            Connect Facebook
          </Text>
        </View>

        {!profile?.is_fb_connected ? (
          <TouchableOpacity
            onPress={onGoogleButtonPress}
            disabled={isLoadingFbCreds || isLoadingSocialLogin}>
            <Text style={styles.editText}>Connect</Text>
          </TouchableOpacity>
        ) : (
          <Text>Connected</Text>
        )}
      </View>
    </React.Fragment>
  );
}
