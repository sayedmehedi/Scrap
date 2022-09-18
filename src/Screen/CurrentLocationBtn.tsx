import React from "react";
import {RootStackParamList} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Button, useTheme} from "react-native-paper";
import Geolocation from "@react-native-community/geolocation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {
  HomeStackRoutes,
  HomeTabRoutes,
  RootStackRoutes,
} from "@constants/routes";

type ChooseCityRouteProp = RouteProp<
  RootStackParamList,
  typeof RootStackRoutes.CHOOSE_LOCATION
>;
type ChooseCityNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  typeof RootStackRoutes.CHOOSE_LOCATION
>;

export default function CurrentLocationBtn() {
  const theme = useTheme();
  const route = useRoute<ChooseCityRouteProp>();
  const navigation = useNavigation<ChooseCityNavigationProps>();
  const {enqueueErrorSnackbar} = useAppSnackbar();
  const [updateProfile, {isLoading, isSuccess, data}] =
    useUpdateProfileMutation();

  const redirectIntended = React.useCallback(() => {
    if (route.params.nextScreen) {
      // @ts-ignore
      navigation.navigate(
        // @ts-ignore
        route.params.nextScreen.name,
        route.params.nextScreen.params,
      );
    } else {
      navigation.navigate(RootStackRoutes.HOME, {
        screen: HomeTabRoutes.HOME,
        params: {
          screen: HomeStackRoutes.HOME,
        },
      });
    }
  }, [route.params]);

  React.useEffect(() => {
    if (isSuccess && !!data) {
      redirectIntended();
    }
  }, [isSuccess, data, route, navigation, redirectIntended]);

  const handleCurrentLocation = async () => {
    Geolocation.requestAuthorization(
      () => {
        Geolocation.getCurrentPosition(
          info => {
            const {latitude, longitude} = info.coords;

            updateProfile({
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            });
          },
          error => {
            enqueueErrorSnackbar({
              text2: error.message,
            });
          },
        );
      },
      error => {
        enqueueErrorSnackbar({
          text2: error.message,
        });
      },
    );
  };

  return (
    <Button
      uppercase={false}
      disabled={isLoading}
      color={theme.colors.primary}
      onPress={handleCurrentLocation}
      icon={({size, color}) => (
        <MaterialIcons size={size} color={color} name={"location-on"} />
      )}>
      Use Current Location
    </Button>
  );
}
