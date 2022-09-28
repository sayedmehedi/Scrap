import React from "react";
import {TextInput, View} from "react-native";
import {Avatar} from "react-native-elements";
import {currencyTransform} from "@utils/form";
import {Text, useTheme} from "react-native-paper";
import {Controller, useForm} from "react-hook-form";
import {ProductActionsStackParamList} from "@src/types";
import {ErrorMessage} from "@hookform/error-message";
import {useFocusEffect} from "@react-navigation/native";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {ProductActionsStackRoutes} from "../constants/routes";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  ProductActionsStackParamList,
  typeof ProductActionsStackRoutes.MAKE_OFFER
>;

export default function MakeOfferScreen({navigation, route}: Props) {
  const theme = useTheme();

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
    handleSubmit,
  } = useForm({
    defaultValues: {
      offerPrice: "1.00",
    },
  });

  const handleMakeOffer = handleSubmit(values => {
    navigation.navigate(ProductActionsStackRoutes.REVIEW_OFFER, {
      productId: route.params.productId,
      shippingCost: route.params.shippingCost,
      offerPrice: parseFloat(values.offerPrice),
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
          <Text style={{fontWeight: "600", fontSize: 16}}>
            {route.params.productName}
          </Text>
          <Text style={{fontWeight: "600", fontSize: 15}}>
            Buy it now price ${route.params.buyPrice}
          </Text>
          <Text style={{fontWeight: "600", fontSize: 15}}>
            {route.params.totalOffers} Offers
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
        Your Offer
      </Text>

      <Controller
        control={control}
        name={"offerPrice"}
        rules={{
          required: "This field is required",
          min: {
            value: 1.0,
            message: "Minimum price should be $1.00",
          },
        }}
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
        name={"offerPrice"}
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
        <AppPrimaryButton text={"Review Offer"} onPress={handleMakeOffer} />
      </View>
    </View>
  );
}
