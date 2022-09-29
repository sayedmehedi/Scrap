import React from "react";
import {useAppSelector} from "@hooks/store";
import {useTheme} from "react-native-paper";
import AuthStackNavigator from "./AuthStackNavigator";
import {NotificationStackParamList} from "@src/types";
import {NotificationStackRoutes} from "@constants/routes";
import {createStackNavigator} from "@react-navigation/stack";
import LocationStackNavigator from "./LocationStackNavigator";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import NotificationsScreen from "@src/Screen/NotificationsScreen";

const NotificationStack = createStackNavigator<NotificationStackParamList>();

function NotificationStackNavigator() {
  const theme = useTheme();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFirstTimeLogin = useAppSelector(state => state.auth.firstTimeLogin);

  return (
    <NotificationStack.Navigator
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
        <NotificationStack.Screen
          component={LocationStackNavigator}
          name={NotificationStackRoutes.LOCATION}
        />
      ) : isAuthenticated ? (
        <React.Fragment>
          <NotificationStack.Screen
            component={NotificationsScreen}
            options={{title: "Notifications"}}
            name={NotificationStackRoutes.NOTIFICATIONS}
          />
        </React.Fragment>
      ) : (
        <NotificationStack.Screen
          options={{
            headerShown: false,
          }}
          component={AuthStackNavigator}
          name={NotificationStackRoutes.AUTH}
        />
      )}
    </NotificationStack.Navigator>
  );
}

export default NotificationStackNavigator;
