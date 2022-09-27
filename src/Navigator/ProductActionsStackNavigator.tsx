import React from "react";
import {useAppSelector} from "@hooks/store";
import PlaceBidScreen from "../Screen/PlaceBidScreen";
import AuthStackNavigator from "./AuthStackNavigator";
import MakeOfferScreen from "../Screen/MakeOfferScreen";
import {ProductActionsStackParamList} from "@src/types";
import AskQuestionScreen from "../Screen/AskQuestionScreen";
import ReviewOfferScreen from "../Screen/ReviewOfferScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {ProductActionsStackRoutes} from "@constants/routes";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import LocationPropmtScreen from "@src/Screen/LocationPromptScreen";
import LocationStackNavigator from "./LocationStackNavigator";

const ProductActionsStack =
  createStackNavigator<ProductActionsStackParamList>();

export default function ProductActionsStackNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFirstTimeLogin = useAppSelector(state => state.auth.firstTimeLogin);

  return (
    <ProductActionsStack.Navigator>
      {isAuthenticated && isFirstTimeLogin ? (
        <ProductActionsStack.Screen
          component={LocationStackNavigator}
          name={ProductActionsStackRoutes.LOCATION}
        />
      ) : isAuthenticated ? (
        <React.Fragment>
          <ProductActionsStack.Screen
            component={PlaceBidScreen}
            name={ProductActionsStackRoutes.PLACE_BID}
            options={{
              title: "Place Bid",
              headerTitleAlign: "center",
            }}
          />

          <ProductActionsStack.Screen
            component={MakeOfferScreen}
            name={ProductActionsStackRoutes.MAKE_OFFER}
            options={{
              title: "Make an offer",
              headerTitleAlign: "center",
            }}
          />

          <ProductActionsStack.Screen
            component={ReviewOfferScreen}
            name={ProductActionsStackRoutes.REVIEW_OFFER}
            options={{title: "Review Your Offer", headerTitleAlign: "center"}}
          />

          <ProductActionsStack.Screen
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
