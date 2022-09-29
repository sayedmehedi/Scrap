import React from "react";
import {useTheme} from "react-native-paper";
import {LocationStackParamList} from "@src/types";
import {LocationStackRoutes} from "@constants/routes";
import {createStackNavigator} from "@react-navigation/stack";
import LocationPropmtScreen from "@src/Screen/LocationPromptScreen";
import ChooseLocationScreen from "@src/Screen/ChooseLocationScreen";

const LocationStack = createStackNavigator<LocationStackParamList>();

export default function LocationStackNavigator() {
  const theme = useTheme();
  return (
    <LocationStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-Bold",
          color: theme.colors.white,
        },
        headerTintColor: theme.colors.white,
      }}>
      <LocationStack.Screen
        options={{
          title: "Locations",
        }}
        component={LocationPropmtScreen}
        name={LocationStackRoutes.LOCATION_PROMPT}
      />

      <LocationStack.Screen
        options={{
          title: "Choose Location",
        }}
        component={ChooseLocationScreen}
        name={LocationStackRoutes.CHOOSE_LOCATION}
      />
    </LocationStack.Navigator>
  );
}
