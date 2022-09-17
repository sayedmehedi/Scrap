import React from "react";
import {View, Text} from "react-native";
import {useAppSelector} from "@hooks/store";
import {RootStackParamList} from "@src/types";
import {RootStackRoutes} from "@constants/routes";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.CONFIRM_PURCHASE
>;

const ConfirmPurchaseScreen = ({navigation, route}: Props) => {
  const profile = useAppSelector(state => state.auth.profile);

  return (
    <View>
      <Text>ConfirmPurchaseScreen</Text>
    </View>
  );
};

export default ConfirmPurchaseScreen;
