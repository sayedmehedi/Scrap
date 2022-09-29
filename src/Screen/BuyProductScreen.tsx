import React from "react";
import {View} from "react-native";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {ActivityIndicator} from "react-native-paper";
import {ProductActionsStackParamList} from "@src/types";
import {useCreateCartMutation} from "@data/laravel/services/order";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {ProductActionsStackRoutes, RootStackRoutes} from "@constants/routes";

type Props = NativeStackScreenProps<
  ProductActionsStackParamList,
  typeof ProductActionsStackRoutes.BUY_PRODUCT
>;

export default function BuyProductScreen({route, navigation}: Props) {
  const rootNavigation = useNavigation();
  const [createCart] = useCreateCartMutation();
  const {enqueueSuccessSnackbar} = useAppSnackbar();

  useFocusEffect(
    React.useCallback(() => {
      if (route.params.isInitial) {
        navigation.goBack();
      }

      console.log("first", route.params.isInitial);
    }, [route.params, navigation]),
  );

  React.useEffect(() => {
    if (!route.params.isInitial) {
      createCart({
        product_id: route.params.productId,
      })
        .unwrap()
        .then(res => {
          enqueueSuccessSnackbar({
            text1: res.success,
          });

          rootNavigation.navigate(RootStackRoutes.CONFIRM_PURCHASE);
        });
    }
  }, [rootNavigation, route.params]);

  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ActivityIndicator size={"large"} />
    </View>
  );
}
