import React from "react";
import {View} from "react-native";
import {useAppSelector} from "@hooks/store";
import {SaleOrArchiveStackParamList} from "@src/types";
import AuthStackNavigator from "./AuthStackNavigator";
import SaleScreen from "@src/Screen/SaleScreen";
import {createStackNavigator} from "@react-navigation/stack";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import LocationStackNavigator from "./LocationStackNavigator";
import {SaleStackRoutes, RootStackRoutes} from "@constants/routes";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const SaleStack = createStackNavigator<SaleOrArchiveStackParamList>();

export default function SaleStackNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFirstTimeLogin = useAppSelector(state => state.auth.firstTimeLogin);

  return (
    <SaleStack.Navigator>
      {isAuthenticated && isFirstTimeLogin ? (
        <SaleStack.Screen
          name={SaleStackRoutes.LOCATION}
          component={LocationStackNavigator}
        />
      ) : isAuthenticated ? (
        <React.Fragment>
          <SaleStack.Screen
            component={SaleScreen}
            name={SaleStackRoutes.SALE_OR_ARCHIVE}
            options={({navigation}) => {
              return {
                title: "Selling",
                headerRight: () => (
                  <View style={{paddingRight: 10}}>
                    <MaterialIcons
                      size={22}
                      color={"white"}
                      name={"notifications-none"}
                      onPress={() => {
                        navigation.navigate(RootStackRoutes.NOTIFICATIONS);
                      }}
                    />
                  </View>
                ),
              };
            }}
          />
        </React.Fragment>
      ) : (
        <SaleStack.Screen
          options={{
            headerShown: false,
          }}
          name={SaleStackRoutes.AUTH}
          component={AuthStackNavigator}
        />
      )}
    </SaleStack.Navigator>
  );
}
