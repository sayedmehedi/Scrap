import React from "react";
import {LocationStackParamList} from "@src/types";
import {LocationStackRoutes} from "@constants/routes";
import {createStackNavigator} from "@react-navigation/stack";
import LocationPropmtScreen from "@src/Screen/LocationPromptScreen";
import ChooseCountryScreen from "@src/Screen/ChooseLocationScreen";

const LocationStack = createStackNavigator<LocationStackParamList>();

export default function LocationStackNavigator() {
  return (
    <LocationStack.Navigator>
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
        component={ChooseCountryScreen}
        name={LocationStackRoutes.CHOOSE_LOCATION}
      />
    </LocationStack.Navigator>
  );
}
