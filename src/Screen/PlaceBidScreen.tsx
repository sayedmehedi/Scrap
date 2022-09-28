import React from "react";
import {TextInput, View} from "react-native";
import {Avatar} from "react-native-elements";
import {currencyTransform} from "@utils/form";
import {Text, useTheme} from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {ErrorMessage} from "@hookform/error-message";
import {Controller, useForm} from "react-hook-form";
import {useFocusEffect} from "@react-navigation/native";
import {ProductActionsStackParamList} from "@src/types";
import {ProductActionsStackRoutes} from "@constants/routes";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useUpsertBidOrOfferMutation} from "@data/laravel/services/offerNBids";
import {isErrorWithSuggestion, isJoteyQueryError} from "@utils/error-handling";

type Props = NativeStackScreenProps<
  ProductActionsStackParamList,
  typeof ProductActionsStackRoutes.PLACE_BID
>;

export default function PlaceBidScreen({route, navigation}: Props) {
  const theme = useTheme();
  const {enqueueSuccessSnackbar} = useAppSnackbar();

  const [makeBid, {isSuccess, data, error, isError}] =
    useUpsertBidOrOfferMutation();

  useFocusEffect(
    React.useCallback(() => {
      if (route.params.isInitial) {
        navigation.goBack();
      }
    }, [route.params, navigation]),
  );

  const {
    control,
    formState: {errors},
    setValue,
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      bidPrice: "1.00",
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
    setValue("bidPrice", route.params.bidStartingPrice.toString());
  }, [route]);

  const handlePlaceBid = handleSubmit(values => {
    makeBid({
      type: "1",
      price: parseFloat(values.bidPrice),
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
        rules={{
          required: "This field is required",
          min: {
            value: route.params.bidStartingPrice,
            message: `Minimum price should be $${route.params.bidStartingPrice}`,
          },
        }}
        render={({field}) => {
          return (
            <TextInput
              style={{
                fontSize: 45,
                textAlign: "center",
                borderBottomWidth: 2,
                borderBottomColor: theme.colors.black,
              }}
              keyboardType={"numeric"}
              value={currencyTransform.inputFloat(field.value)}
              onChangeText={price =>
                field.onChange(currencyTransform.outputFloat(price))
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
