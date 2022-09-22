import React from "react";
import {View} from "react-native";
import {useAppSelector} from "@hooks/store";
import {RootStackParamList} from "@src/types";
import {useNavigation} from "@react-navigation/native";
import {ActivityIndicator} from "react-native-paper";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import {AuthStackRoutes, RootStackRoutes} from "@constants/routes";
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

        navigation.navigate(RootStackRoutes.AUTH, {
          screen: AuthStackRoutes.LOGIN,
          params: {
            backScreen,
            nextScreen,
          },
        });
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
