import React from "react";
import BottomTab from "./BottomTab";
import {forFade} from "@utils/misc";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import {TouchableOpacity} from "react-native";
import {RootStackParamList} from "@src/types";
import {RootStackRoutes} from "../constants/routes";
import AuthStackNavigator from "./AuthStackNavigator";
import PlaceBidScreen from "../Screen/PlaceBidScreen";
import MakeOfferScreen from "../Screen/MakeOfferScreen";
import AskQuestionScreen from "../Screen/AskQuestionScreen";
import ReviewOfferScreen from "../Screen/ReviewOfferScreen";
import {createStackNavigator} from "@react-navigation/stack";
import NotificationsScreen from "../Screen/NotificationsScreen";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import ProductSearchScreen from "../Screen/ProductSearchScreen";
import ProductDetailsScreen from "../Screen/ProductDetailsScreen";
import ChooseCountryScreen from "@src/Screen/ChooseCountryScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocationPropmtScreen from "@src/Screen/LocationPromptScreen";
import ConfirmPurchaseScreen from "@src/Screen/ConfirmPurchaseScreen";
import SingleConversationScreen from "../Screen/SingleConversationScreen";
import SellerReviewScreen from "@src/Screen/ReviewScreen/SellerReviewScreen";
import AddShippingAddressScreen from "@src/Screen/AddShippingAddressScreen";
import SellerPublicProfileScreen from "@src/Screen/SellerPublicProfileScreen";
import ProductFilterScreen from "../Screen/ProductFilterScreen/ProductFilterScreen";

const RootStack = createStackNavigator<RootStackParamList>();

const privateRouteSet = new Set();
privateRouteSet.add(RootStackRoutes.PLACE_BID);
privateRouteSet.add(RootStackRoutes.MAKE_OFFER);
privateRouteSet.add(RootStackRoutes.ASK_QUESTION);
privateRouteSet.add(RootStackRoutes.SINGLE_CONVERSATION);
privateRouteSet.add(RootStackRoutes.CONFIRM_PURCHASE);
privateRouteSet.add(RootStackRoutes.SELLER_REVIEW);
privateRouteSet.add(RootStackRoutes.LOCATION_PROMPT);
privateRouteSet.add(RootStackRoutes.CHOOSE_LOCATION);
privateRouteSet.add(RootStackRoutes.ADD_SHIPPING_ADDRESS);

const RootStackNavigator = () => {
  const theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

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
        component={BottomTab}
        name={RootStackRoutes.HOME}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name={RootStackRoutes.AUTH}
        component={AuthStackNavigator}
      />

      <RootStack.Screen
        component={SingleConversationScreen}
        name={RootStackRoutes.SINGLE_CONVERSATION}
        options={{
          headerShown: false,
          presentation: "modal",
          cardStyleInterpolator: forFade,
        }}
      />

      <RootStack.Screen
        options={({navigation, route}) => {
          return {
            title: "",

            headerLeft: ({onPress}) => {
              return (
                <TouchableOpacity
                  style={{paddingLeft: 15}}
                  onPress={() => {
                    if (!!onPress) {
                      onPress();
                    } else {
                      navigation.navigate(RootStackRoutes.HOME);
                    }
                  }}>
                  <MaterialIcons
                    size={22}
                    color={"white"}
                    name="keyboard-backspace"
                  />
                </TouchableOpacity>
              );
            },
          };
        }}
        component={ProductDetailsScreen}
        name={RootStackRoutes.PRODUCT_DETAILS}
      />

      <RootStack.Screen
        component={PlaceBidScreen}
        name={RootStackRoutes.PLACE_BID}
        options={{
          title: !isAuthenticated ? "" : "Place Bid",
          headerTitleAlign: "center",
        }}
      />

      <RootStack.Screen
        component={MakeOfferScreen}
        name={RootStackRoutes.MAKE_OFFER}
        options={{
          title: !isAuthenticated ? "" : "Make an offer",
          headerTitleAlign: "center",
        }}
      />

      <RootStack.Screen
        component={ReviewOfferScreen}
        name={RootStackRoutes.REVIEW_OFFER}
        options={{title: "Review Your Offer", headerTitleAlign: "center"}}
      />

      <RootStack.Screen
        component={AskQuestionScreen}
        options={{title: !isAuthenticated ? "" : "Ask Question"}}
        name={RootStackRoutes.ASK_QUESTION}
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
          title: "Locations",
        }}
        component={LocationPropmtScreen}
        name={RootStackRoutes.LOCATION_PROMPT}
      />

      <RootStack.Screen
        options={{
          title: "Choose Location",
        }}
        component={ChooseCountryScreen}
        name={RootStackRoutes.CHOOSE_LOCATION}
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
