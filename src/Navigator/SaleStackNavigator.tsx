import React from "react";
import {View} from "react-native";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import SaleScreen from "@src/Screen/SaleScreen";
import AuthStackNavigator from "./AuthStackNavigator";
import {defaultTabBarStyles} from "@constants/Colors";
import {createStackNavigator} from "@react-navigation/stack";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import LocationStackNavigator from "./LocationStackNavigator";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {HomeTabParamList, SaleOrArchiveStackParamList} from "@src/types";
import {
  SaleStackRoutes,
  HomeTabRoutes,
  ChatStackRoutes,
} from "@constants/routes";
import NotificationsScreen from "@src/Screen/NotificationsScreen";

const SaleStack = createStackNavigator<SaleOrArchiveStackParamList>();

type Props = NativeStackScreenProps<HomeTabParamList>;

export default function SaleStackNavigator({navigation: tabNavigation}: Props) {
  const theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFirstTimeLogin = useAppSelector(state => state.auth.firstTimeLogin);

  React.useEffect(() => {
    const options: Record<string, any> = {};

    if (isFirstTimeLogin || !isAuthenticated) {
      options.tabBarStyle = {display: "none"};
    } else {
      options.tabBarStyle = defaultTabBarStyles;
    }

    tabNavigation.setOptions(options);
  }, [tabNavigation, isAuthenticated, isFirstTimeLogin]);

  return (
    <SaleStack.Navigator
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
      {isAuthenticated && isFirstTimeLogin ? (
        <SaleStack.Screen
        options={{
          headerShown: false,
        }}
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
                      size={30}
                      color={"white"}
                      name={"notifications-none"}
                      onPress={() => {
                        navigation.navigate(SaleStackRoutes.NOTIFICATIONS);
                      }}
                    />
                  </View>
                ),
              };
            }}
          />

          <SaleStack.Screen
            component={NotificationsScreen}
            options={{title: "Notifications"}}
            name={ChatStackRoutes.NOTIFICATIONS}
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
