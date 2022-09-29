import React from "react";
import styles from "../styles";
import {useTheme} from "react-native-paper";
import Toast from "react-native-toast-message";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Controller, useForm} from "react-hook-form";
import Entypo from "react-native-vector-icons/Entypo";
import AppPrimaryButton from "../../../Component/AppPrimaryButton";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {
  View,
  Text,
  Modal,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { colors } from "react-native-elements";

export default function AccountSettingsModal({
  open,
  title,
  subtitle,
  onClose,
  onSuccess,
  inputs = [],
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSuccess?: () => void;
  inputs: Array<TextInputProps & {name: string; error?: string}>;
}) {
  const theme = useTheme();
  const {control, handleSubmit} = useForm();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [updateProfile, {isLoading, isSuccess, data}] =
    useUpdateProfileMutation();

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
      onSuccess?.();
      onClose();
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: data.error,
      });
    }
  }, [
    data,
    onSuccess,
    isSuccess,
    enqueueErrorSnackbar,
    enqueueSuccessSnackbar,
  ]);

  const handleUpdate = handleSubmit(values => {
    updateProfile(values);
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
            style={{alignSelf: "center", marginBottom: 20, borderWidth: 1, borderRadius: 500, padding: 10, borderColor: theme.colors.primary}}
            onPress={onClose}>
            <Entypo name="cross" size={25} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              color: theme.colors.text,
              fontFamily: "Inter-Regular",
            }}>
            {title}
          </Text>

          {!!subtitle && (
            <Text
              style={{
                fontSize: 13,
                marginTop: 15,
                maxWidth: "70%",
                textAlign: "center",
                color: theme.colors.text,
                fontFamily: "Inter-Regular",
              }}>
              {subtitle}
            </Text>
          )}

          {inputs.map((input, i) => {
            const {name, error, onChangeText, ...textinputProps} = input;

            return (
              <Controller
                key={i}
                name={name}
                shouldUnregister
                control={control}
                render={({field}) => {
                  return (
                    <TextInput
                      value={field.value}
                      style={styles.modalInput}
                      onChangeText={field.onChange}
                      {...textinputProps}
                    />
                  );
                }}
              />
            );
          })}

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
