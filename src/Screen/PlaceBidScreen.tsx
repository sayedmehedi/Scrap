import React from "react";
import {TextInput, View} from "react-native";
import {Avatar} from "react-native-elements";
import {RootStackParamList} from "@src/types";
import {currencyTransform} from "@utils/form";
import {RootStackRoutes} from "@constants/routes";
import {Text, useTheme} from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {ErrorMessage} from "@hookform/error-message";
import {Controller, useForm} from "react-hook-form";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useUpsertBidOrOfferMutation} from "@data/laravel/services/offerNBids";
import {isErrorWithSuggestion, isJoteyQueryError} from "@utils/error-handling";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.PLACE_BID
>;

export default function PlaceBidScreen({route, navigation}: Props) {
  const theme = useTheme();
  const {enqueueSuccessSnackbar} = useAppSnackbar();

  const [makeBid, {isSuccess, data, error, isError}] =
    useUpsertBidOrOfferMutation();

  const {
    control,
    formState: {errors},
    setValue,
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      bidPrice: 0,
    },
  });

  React.useEffect(() => {
    if (
      isError &&
      isJoteyQueryError(error) &&
      isErrorWithSuggestion(error.data)
    ) {
      setError("bidPrice", {
        type: "server",
        message: error.data.suggestion,
      });
    }
  }, [isError, error, setError]);

  React.useEffect(() => {
    if (isSuccess && data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [enqueueSuccessSnackbar, data, isSuccess, navigation]);

  React.useEffect(() => {
    setValue("bidPrice", route.params.bidStartingPrice);
  }, [route]);

  const handlePlaceBid = handleSubmit(values => {
    makeBid({
      type: "1",
      price: values.bidPrice,
      product_id: route.params.productId,
    });
  });

  return (
    <View style={{flex: 1, padding: 15}}>
      <View
        style={{
          padding: 10,
          flexDirection: "row",
          borderRadius: theme.roundness * 3,
          backgroundColor: theme.colors.white,
        }}>
        {!!route.params.productImage && (
          <View style={{marginRight: 10}}>
            <Avatar
              size={"medium"}
              imageProps={{
                resizeMode: "center",
              }}
              source={{uri: route.params.productImage}}
              // @ts-ignore
              style={{
                height: 70,
                width: 70,
                borderRadius: theme.roundness * 3,
              }}
            />
          </View>
        )}

        <View style={{flex: 1}}>
          <Text style={{fontWeight: "600", fontSize: 16}}>Gents Shoes</Text>
          <Text style={{fontWeight: "600", fontSize: 15}}>
            ${route.params.bidStartingPrice}
          </Text>
          <Text style={{fontWeight: "600", fontSize: 15}}>
            Starting bid | {route.params.totalBids} bids |{" "}
            {route.params.timeLeftToBid}
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 25,
          marginTop: 45,
          fontWeight: "600",
          textAlign: "center",
        }}>
        We’ll bid for you, up to
      </Text>

      <Controller
        control={control}
        name={"bidPrice"}
        // rules={{
        //   min: {
        //     value: route.params.bidStartingPrice,
        //     message: `Please bid $${route.params.bidStartingPrice} or higher`
        //   }
        // }}
        render={({field}) => {
          return (
            <TextInput
              style={{
                fontSize: 45,
                textAlign: "center",
                borderBottomWidth: 2,
                // @ts-ignore
                borderBottomColor: theme.colors.black,
              }}
              keyboardType={"numeric"}
              value={currencyTransform.input(field.value)}
              onChangeText={price =>
                field.onChange(currencyTransform.output(price))
              }
            />
          );
        }}
      />

      <ErrorMessage
        errors={errors}
        name={"bidPrice"}
        render={({message}) => (
          <Text
            style={{
              marginTop: 5,
              color: theme.colors.error,
              fontWeight: "700",
              textAlign: "center",
            }}>
            {message}
          </Text>
        )}
      />

      <View style={{marginTop: 45}}>
        <AppPrimaryButton text={"Confirm Bid"} onPress={handlePlaceBid} />
      </View>
    </View>
  );
}
