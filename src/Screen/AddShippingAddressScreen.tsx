import React from "react";
import {View, Text} from "react-native";
import {useAppSelector} from "@hooks/store";
import {useTheme} from "react-native-paper";
import {RootStackParamList} from "@src/types";
import {RootStackRoutes} from "@constants/routes";
import {ErrorMessage} from "@hookform/error-message";
import Feather from "react-native-vector-icons/Feather";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  setGlobalStyles,
  FloatingLabelInput,
} from "react-native-floating-label-input";

setGlobalStyles.containerStyles = {
  height: 58,
  borderRadius: 6,
  paddingHorizontal: 10,
  backgroundColor: "#fff",
};

setGlobalStyles.customLabelStyles = {
  fontSizeFocused: 12,
  fontSizeBlurred: 15,
  colorFocused: "#707070",
  colorBlurred: "#707070",
};

setGlobalStyles.labelStyles = {
  paddingTop: 5,
  paddingHorizontal: 5,
  fontFamily: "Inter-Regular",
};

setGlobalStyles.inputStyles = {
  fontSize: 15,
  marginTop: 15,
  color: "#707070",
  fontWeight: "600",
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.ADD_SHIPPING_ADDRESS
>;
type FormValues = {
  buynowprice: "";
  beginDay: Date;
  quantity: number;
  isListNow: boolean;
  startingPrice: "";
  showMetalPrice: boolean;
};

const AddShippingAddressScreen = ({navigation, route}: Props) => {
  const theme = useTheme();

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      name: "",
      adress: "",
      state: "",
      city: "",
      zipCode: "",
      phone: "",
    },
  });
  const profile = useAppSelector(state => state.auth.profile);

  return (
    <View style={{padding: 20}}>
      <View style={{width: "100%", marginBottom: 16}}>
        <Controller
          control={control}
          name={"name"}
          render={({field}) => {
            return (
              <FloatingLabelInput
                label={"Name*"}
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
          name={"adress"}
          render={({field}) => {
            return (
              <FloatingLabelInput
                label={"Address*"}
                value={field.value}
                onChangeText={field.onChange}
              />
            );
          }}
        />

        <ErrorMessage
          errors={errors}
          name={"adress"}
          render={({message}) => (
            <Text style={{color: theme.colors.error, marginTop: 10}}>
              {message}
            </Text>
          )}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}>
        <View
          style={{
            height: 60,
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 10,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            State*
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                color: "#707070",
              }}>
              Select
            </Text>
            <Feather name="chevron-down" size={25} color={"#707070"} />
          </View>
        </View>

        <View
          style={{
            height: 60,
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 10,
            borderRadius: 8,
          }}>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            City*
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 14,
                color: "#707070",
              }}>
              Select
            </Text>
            <Feather name="chevron-down" size={25} color={"#707070"} />
          </View>
        </View>
      </View>

      <View style={{width: "100%", marginBottom: 16}}>
        <Controller
          control={control}
          name={"zipCode"}
          render={({field}) => {
            return (
              <FloatingLabelInput
                label={"ZipCode*"}
                value={field.value}
                onChangeText={field.onChange}
              />
            );
          }}
        />

        <ErrorMessage
          errors={errors}
          name={"zipCode"}
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
          name={"phone"}
          render={({field}) => {
            return (
              <FloatingLabelInput
                label={"Mobile Number*"}
                value={field.value}
                onChangeText={field.onChange}
              />
            );
          }}
        />

        <ErrorMessage
          errors={errors}
          name={"phone"}
          render={({message}) => (
            <Text style={{color: theme.colors.error, marginTop: 10}}>
              {message}
            </Text>
          )}
        />
      </View>

      <AppPrimaryButton
        text={"Save"}
        containerStyle={{
          alignSelf: "center",
        }}
        onPress={() => {}}
        disabled={false}
      />
    </View>
  );
};

export default AddShippingAddressScreen;
