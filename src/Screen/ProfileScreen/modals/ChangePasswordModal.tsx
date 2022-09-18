import React from "react";
import styles from "../styles";
import {useTheme} from "react-native-paper";
import Toast from "react-native-toast-message";
import {ChangePasswordRequest} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Controller, useForm} from "react-hook-form";
import Entypo from "react-native-vector-icons/Entypo";
import AppPrimaryButton from "../../../Component/AppPrimaryButton";
import {useChangePasswordMutation} from "@data/laravel/services/auth";
import {
  View,
  Text,
  Modal,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";

export default function ChangePasswordModal({
  open,
  title,
  subtitle,
  onClose,
  inputs = [],
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  inputs: Array<TextInputProps & {name: string; error?: string}>;
}) {
  const theme = useTheme();
  const {setValue, control, handleSubmit, setError} = useForm();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [changePassword, {isLoading, isSuccess, data}] =
    useChangePasswordMutation();

  React.useEffect(() => {
    inputs.forEach(input => {
      if (input.value) {
        setValue(input.name, input.value);
      }

      if (input.error) {
        setError(input.name, {
          type: "custom",
          message: input.error,
        });
      }
    });
  }, [inputs]);

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
      onClose();
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: data.error,
      });
    }
  }, [enqueueSuccessSnackbar, enqueueErrorSnackbar, isSuccess, data]);

  const handleUpdate = handleSubmit(values => {
    changePassword(values as ChangePasswordRequest);
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

          {inputs.map((input, i) => (
            <Controller
              key={i}
              control={control}
              name={input.name}
              render={({field}) => {
                return (
                  <TextInput
                    value={field.value}
                    style={styles.modalInput}
                    onChangeText={field.onChange}
                    placeholder={input.placeholder ?? ""}
                  />
                );
              }}
            />
          ))}

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
