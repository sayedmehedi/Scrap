import React from "react";
import {useAppSelector} from "./store";
import {RootStackParamList} from "@src/types";
import {useNavigation} from "@react-navigation/native";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import {AuthStackRoutes, RootStackRoutes} from "@constants/routes";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

function useAuthGuard<NPT extends NavigationProps>(props?: {
  navigateTo?: (navigation: NPT) => {};
}) {
  const navigation = useNavigation<NPT>();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (!isAuthenticated) {
      if (props?.navigateTo) {
        props.navigateTo(navigation);
      } else {
        navigation.navigate(RootStackRoutes.AUTH, {
          screen: AuthStackRoutes.LOGIN,
          params: {},
        });
      }
    }
  }, [isAuthenticated, navigation, props]);

  return null;
}

export default useAuthGuard;
