import React from "react";
import {Button} from "react-native-elements";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {Divider, Text, Title, useTheme} from "react-native-paper";
import {ProductActionsStackParamList, RootStackParamList} from "@src/types";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {ProductActionsStackRoutes, RootStackRoutes} from "@constants/routes";
import {useUpsertBidOrOfferMutation} from "@data/laravel/services/offerNBids";

type Props = NativeStackScreenProps<
  ProductActionsStackParamList,
  typeof ProductActionsStackRoutes.REVIEW_OFFER
>;

type RootNavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function ReviewOfferScreen({route}: Props) {
  const theme = useTheme();
  const navigation = useNavigation<RootNavigationProps>();
  const {enqueueSuccessSnackbar} = useAppSnackbar();

  const [upsertOffer, {isSuccess, data}] = useUpsertBidOrOfferMutation();

  React.useEffect(() => {
    if (isSuccess && data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });

      navigation.replace(RootStackRoutes.PRODUCT_DETAILS, {
        productId: route.params.productId,
      });
    }
  }, [enqueueSuccessSnackbar, data, isSuccess, navigation, route]);

  const totalPrice = React.useMemo(
    () => route.params.offerPrice + route.params.shippingCost,
    [route.params.offerPrice, route.params.shippingCost],
  );

  const handleSendOffer = () => {
    upsertOffer({
      type: "0",
      price: route.params.offerPrice,
      product_id: route.params.productId,
    });
  };

  return (
    <View style={{flex: 1, padding: 15}}>
      <Text style={{textAlign: "center"}}>
        Your Offer: ${route.params.offerPrice}
      </Text>
      <Text style={{textAlign: "center"}}>
        Shopping cost: ${route.params.shippingCost}
      </Text>

      <Divider style={{marginVertical: 25, height: 2}} />

      <Title
        style={{
          fontSize: 25,
          fontWeight: "700",
          textAlign: "center",
        }}>
        Total: ${totalPrice.toFixed(2)}
      </Title>

      <Text
        style={{
          textAlign: "center",
          // @ts-ignore
          color: theme.colors.tertiary,
        }}>
        Taxes me be applied at checkout.
      </Text>

      <View style={{marginTop: 25}}>
        <AppPrimaryButton text={"Send Offer"} onPress={handleSendOffer} />
      </View>

      <Button
        type="clear"
        style={{
          marginTop: 15,
        }}
        title={"Edit offer"}
        onPress={() => navigation.goBack()}
        TouchableComponent={TouchableOpacity}
        titleStyle={{
          textDecorationColor: "#000",
          textDecorationStyle: "solid",
          textDecorationLine: "underline",
          color: theme.colors.black,
        }}
      />
    </View>
  );
}
