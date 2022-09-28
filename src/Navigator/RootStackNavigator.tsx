import React from "react";
import {forFade} from "@utils/misc";
import {useTheme} from "react-native-paper";
import {RootStackParamList} from "@src/types";
import HomeTabNavigator from "./HomeTabNavigator";
import {RootStackRoutes} from "../constants/routes";
import {createStackNavigator} from "@react-navigation/stack";
import NotificationsScreen from "../Screen/NotificationsScreen";
import ProductSearchScreen from "../Screen/ProductSearchScreen";
import ProductDetailsScreen from "../Screen/ProductDetailsScreen";
import ConfirmPurchaseScreen from "@src/Screen/ConfirmPurchaseScreen";
import ProductActionsStackNavigator from "./ProductActionsStackNavigator";
import SellerReviewScreen from "@src/Screen/ReviewScreen/SellerReviewScreen";
import AddShippingAddressScreen from "@src/Screen/AddShippingAddressScreen";
import SellerPublicProfileScreen from "@src/Screen/SellerPublicProfileScreen";
import ProductFilterScreen from "../Screen/ProductFilterScreen/ProductFilterScreen";
import AuthStackNavigator from "./AuthStackNavigator";

const RootStack = createStackNavigator<RootStackParamList>();

const RootStackNavigator = () => {
  const theme = useTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-Bold",
          color: theme.colors.white,
        },
        cardStyleInterpolator: forFade,
        headerTintColor: theme.colors.white,
      }}>
      <RootStack.Screen
        component={HomeTabNavigator}
        name={RootStackRoutes.HOME}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}
      />

      <RootStack.Screen
        options={{
          title: "",
        }}
        component={ProductDetailsScreen}
        name={RootStackRoutes.PRODUCT_DETAILS}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name={RootStackRoutes.AUTH}
        component={AuthStackNavigator}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name={RootStackRoutes.PRODUCT_ACTIONS}
        component={ProductActionsStackNavigator}
      />

      <RootStack.Screen
        component={NotificationsScreen}
        options={{title: "Notifications"}}
        name={RootStackRoutes.NOTIFICATIONS}
      />

      <RootStack.Screen
        component={ProductSearchScreen}
        options={{title: "Search Product"}}
        name={RootStackRoutes.SEARCH_PRODUCT}
      />

      <RootStack.Screen
        options={{
          title: "Filter",
          headerTitleAlign: "center",
        }}
        component={ProductFilterScreen}
        name={RootStackRoutes.PRODUCT_FILTER}
      />

      <RootStack.Screen
        options={{
          title: "Review",
          headerTitleAlign: "center",
        }}
        component={ConfirmPurchaseScreen}
        name={RootStackRoutes.CONFIRM_PURCHASE}
      />

      <RootStack.Screen
        options={{
          title: "Seller Review",
          headerTitleAlign: "center",
        }}
        component={SellerReviewScreen}
        name={RootStackRoutes.SELLER_REVIEW}
      />

      <RootStack.Screen
        options={{
          title: "Add Shipping Address",
        }}
        component={AddShippingAddressScreen}
        name={RootStackRoutes.ADD_SHIPPING_ADDRESS}
      />

      <RootStack.Screen
        options={{
          title: "Public Profile",
          headerTitleAlign: "center",
        }}
        component={SellerPublicProfileScreen}
        name={RootStackRoutes.SELLER_PUBLIC_PROFILE}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
