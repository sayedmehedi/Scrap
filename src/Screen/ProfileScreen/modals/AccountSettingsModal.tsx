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
  const {enqueueSuccessSnackbar} = useAppSnackbar();
  const {setValue, control, handleSubmit, setError} = useForm();
  const [updateProfile, {isLoading, isSuccess, data}] =
    useUpdateProfileMutation();

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
  }, [inputs, setValue, setError]);

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
      onSuccess?.();
      onClose();
    }
  }, [enqueueSuccessSnackbar, isSuccess, data, onSuccess]);

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

          {inputs.map((input, i) => {
            const {name, error, onChangeText, ...textinputProps} = input;

            return (
              <Controller
                key={i}
                name={name}
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
