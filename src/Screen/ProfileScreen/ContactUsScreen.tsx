import React from "react";
import {TextInput, useTheme} from "react-native-paper";
import {Controller, useForm} from "react-hook-form";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {ErrorMessage} from "@hookform/error-message";
import {ScrollView} from "react-native-gesture-handler";
import {addServerErrors, isJoteyQueryError} from "@utils/error-handling";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import {useContactUsMutation} from "@data/laravel/services/api";
import {FloatingLabelInput} from "react-native-floating-label-input";
import {View, Text, KeyboardAvoidingView, Platform} from "react-native";

export default function ContactUsScreen() {
  const theme = useTheme();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [contactUs, {isLoading, isError, error, isSuccess, data}] =
    useContactUsMutation();

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      reset();
      enqueueSuccessSnackbar({
        text1: data.success,
      });
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: data.error,
      });
    }
  }, [enqueueSuccessSnackbar, isSuccess, data, reset, enqueueErrorSnackbar]);

  const handleContactUs = handleSubmit(values => {
    contactUs(values);
  });

  React.useEffect(() => {
    if (isError && !!error && isJoteyQueryError(error)) {
      addServerErrors(error.data.field_errors, setError);
    }
  }, [isError, error, setError]);

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        padding: 15,
      }}>
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <KeyboardAvoidingView
            style={{flexWrap: "wrap"}}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                control={control}
                name={"name"}
                render={({field}) => {
                  return (
                    <TextInput
                      mode="outlined"
                      label={"Name"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={"name"}
                render={({message}) => (
                  <Text style={{color: theme.colors.error, marginTop: 10}}>
                    {message}
                  </Text>
                )}
              />
            </View>

            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                control={control}
                name={"email"}
                render={({field}) => {
                  return (
                    <TextInput
                      mode="outlined"
                      label={"Email"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={"email"}
                render={({message}) => (
                  <Text style={{color: theme.colors.error, marginTop: 10}}>
                    {message}
                  </Text>
                )}
              />
            </View>

            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                control={control}
                name={"subject"}
                render={({field}) => {
                  return (
                    <TextInput
                      mode="outlined"
                      label={"Subject"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={"subject"}
                render={({message}) => (
                  <Text style={{color: theme.colors.error, marginTop: 10}}>
                    {message}
                  </Text>
                )}
              />
            </View>

            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                control={control}
                name={"description"}
                render={({field}) => {
                  return (
                    <TextInput
                      multiline
                      mode="outlined"
                      numberOfLines={5}
                      value={field.value}
                      outlineColor="black"
                      label={"Description"}
                      textAlignVertical={"top"}
                      onChangeText={field.onChange}
                    />
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={"description"}
                render={({message}) => (
                  <Text style={{color: theme.colors.error, marginTop: 10}}>
                    {message}
                  </Text>
                )}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>

      <View>
        <AppPrimaryButton
          text={"Submit"}
          containerStyle={{
            alignSelf: "center",
          }}
          disabled={isLoading}
          onPress={handleContactUs}
        />
      </View>
    </ScrollView>
  );
}
