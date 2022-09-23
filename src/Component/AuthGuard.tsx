import React from "react";
import {View} from "react-native";
import {useAppSelector} from "@hooks/store";
import {RootStackParamList} from "@src/types";
import {ActivityIndicator} from "react-native-paper";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import {AuthStackRoutes, RootStackRoutes} from "@constants/routes";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

type SCRN<T> = {
  name: keyof T;
  params: any;
};

export default function AuthGuard<
  RouteParamList extends object,
  NPT extends NavigationProps,
>(
  props: React.PropsWithChildren<{
    backScreen?: SCRN<RouteParamList> | (() => SCRN<RouteParamList>);
    nextScreen?: SCRN<RouteParamList> | (() => SCRN<RouteParamList>);
    navigateTo?: (navigation: NPT) => void;
  }>,
) {
  const navigation = useNavigation<NPT>();
  const [computing, setComputing] = React.useState(true);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (!isAuthenticated) {
      if (props?.navigateTo) {
        props.navigateTo(navigation);
      } else {
        let backScreen = undefined;

        if (typeof props.backScreen === "function") {
          backScreen = props.backScreen();
        } else {
          backScreen = props.backScreen;
        }

        let nextScreen = undefined;

        if (typeof props.nextScreen === "function") {
          nextScreen = props.nextScreen();
        } else {
          nextScreen = props.nextScreen;
        }

        const navigationState = navigation.getState();
        const initialRoutes = navigationState.routes;
        const routes = initialRoutes.slice(0, -2);

        routes.push({
          name: RootStackRoutes.AUTH,
          params: {
            // @ts-ignore
            screen: AuthStackRoutes.LOGIN,
            params: {
              // @ts-ignore
              nextScreen,
            },
          },
        });

        navigation.dispatch(
          CommonActions.reset({
            routes,
            key: navigationState.key,
            type: navigationState.type,
            stale: navigationState.stale,
            index: navigationState.index,
            history: navigationState.history,
            routeNames: navigationState.routeNames,
          }),
        );
      }
    } else {
      setComputing(false);
    }
  }, [isAuthenticated, navigation, props]);

  return computing ? (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <ActivityIndicator size={"large"} />
    </View>
  ) : (
    <React.Fragment>{props?.children}</React.Fragment>
  );
}
