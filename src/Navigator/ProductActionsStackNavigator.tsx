import React from "react";
import {forFade} from "@utils/misc";
import {useAppSelector} from "@hooks/store";
import {useTheme} from "react-native-paper";
import PlaceBidScreen from "../Screen/PlaceBidScreen";
import AuthStackNavigator from "./AuthStackNavigator";
import MakeOfferScreen from "../Screen/MakeOfferScreen";
import {ProductActionsStackParamList} from "@src/types";
import AskQuestionScreen from "../Screen/AskQuestionScreen";
import ReviewOfferScreen from "../Screen/ReviewOfferScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {ProductActionsStackRoutes} from "@constants/routes";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import LocationStackNavigator from "./LocationStackNavigator";

const ProductActionsStack =
  createStackNavigator<ProductActionsStackParamList>();

export default function ProductActionsStackNavigator() {
  const theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFirstTimeLogin = useAppSelector(state => state.auth.firstTimeLogin);

  return (
    <ProductActionsStack.Navigator
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
      {isAuthenticated && isFirstTimeLogin ? (
        <ProductActionsStack.Screen
          component={LocationStackNavigator}
          name={ProductActionsStackRoutes.LOCATION}
        />
      ) : isAuthenticated ? (
        <React.Fragment>
          <ProductActionsStack.Screen
            component={PlaceBidScreen}
            initialParams={{
              productId: 0,
              totalBids: 0,
              productName: "",
              productImage: "",
              timeLeftToBid: "",
              bidStartingPrice: 0,
              isInitial: true,
            }}
            name={ProductActionsStackRoutes.PLACE_BID}
            options={{
              title: "Place Bid",
              headerTitleAlign: "center",
            }}
          />

          <ProductActionsStack.Screen
            component={MakeOfferScreen}
            name={ProductActionsStackRoutes.MAKE_OFFER}
            initialParams={{
              buyPrice: 0,
              productId: 0,
              totalOffers: 0,
              productName: "",
              shippingCost: 0,
              productImage: "",
              isInitial: true,
            }}
            options={{
              title: "Make an offer",
              headerTitleAlign: "center",
            }}
          />

          <ProductActionsStack.Screen
            component={ReviewOfferScreen}
            initialParams={{
              offerPrice: 0,
              shippingCost: 0,
              productId: 0,
              isInitial: true,
            }}
            name={ProductActionsStackRoutes.REVIEW_OFFER}
            options={{title: "Review Your Offer", headerTitleAlign: "center"}}
          />

          <ProductActionsStack.Screen
            initialParams={{
              sellerId: 0,
              sellerName: "",
              sellerImage: "",

              productId: 0,
              productName: "",
              productImage: "",
              productPrice: 0,

              isInitial: true,
            }}
            component={AskQuestionScreen}
            options={{title: "Ask Question"}}
            name={ProductActionsStackRoutes.ASK_QUESTION}
          />
        </React.Fragment>
      ) : (
        <ProductActionsStack.Screen
          options={{
            headerShown: false,
          }}
          component={AuthStackNavigator}
          name={ProductActionsStackRoutes.AUTH}
        />
      )}
    </ProductActionsStack.Navigator>
  );
}
