import React from "react";
import styles from "../styles";
import {useTheme} from "react-native-paper";
import auth from "@react-native-firebase/auth";
import {AuthStackParamList} from "@src/types";
import {logout} from "@store/slices/authSlice";
import Toast from "react-native-toast-message";
import {AuthStackRoutes} from "@constants/routes";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Controller, useForm} from "react-hook-form";
import Entypo from "react-native-vector-icons/Entypo";
import {useNavigation} from "@react-navigation/native";
import {useAppDispatch, useAppSelector} from "@hooks/store";
import AppPrimaryButton from "../../../Component/AppPrimaryButton";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {View, Text, Modal, TextInput, TouchableOpacity} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type AuthNavigationProps = NativeStackNavigationProp<AuthStackParamList>;

export default function EmailSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AuthNavigationProps>();
  const profile = useAppSelector(state => state.auth.profile);
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar, enqueueInfoSnackbar} =
    useAppSnackbar();
  const [updateProfile, {isLoading, isSuccess, data}] =
    useUpdateProfileMutation();

  const {control, handleSubmit, setValue} = useForm({
    defaultValues: {
      email: "",
    },
  });

  React.useEffect(() => {
    if (!!profile?.email) {
      setValue("email", profile.email);
    }
  }, [profile, setValue]);

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
      onClose();
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: data.error,
      });
    }
  }, [data, isSuccess, enqueueErrorSnackbar, enqueueSuccessSnackbar]);

  const handleUpdate = handleSubmit(async values => {
    try {
      await updateProfile(values).unwrap();

      try {
        await auth().signOut();
      } catch (_error) {}

      dispatch(logout());
      enqueueInfoSnackbar({
        text1: "Info",
        text2: "You need to verify your email",
      });

      navigation.navigate(AuthStackRoutes.OTP, {
        email: values.email,
      });
    } catch (err) {
      // @ts-ignore
      const error: Error = err;

      enqueueErrorSnackbar({
        text1: "Error",
        text2: error.message,
      });
    }
  });

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType={"slide"}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={{alignSelf: "flex-end", marginRight: 20, marginBottom: 20}}
            onPress={onClose}>
            <Entypo name="cross" size={30} color={"#023047"} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              color: theme.colors.text,
              fontFamily: "Inter-Regular",
            }}>
            Update Email Address
          </Text>

          <Controller
            name={"email"}
            shouldUnregister
            control={control}
            render={({field}) => {
              return (
                <TextInput
                  value={field.value}
                  style={styles.modalInput}
                  onChangeText={field.onChange}
                  keyboardType={"email-address"}
                />
              );
            }}
          />

          <AppPrimaryButton
            disabled={isLoading}
            text={"Update"}
            onPress={handleUpdate}
          />

          <Toast />
        </View>
      </View>
    </Modal>
  );
}
