import React from "react";
import {View, Image} from "react-native";
import {useTheme} from "react-native-paper";
import {RootStackParamList} from "@src/types";
import {useAppDispatch} from "@hooks/store";
import useAppSnackbar from "@hooks/useAppSnackbar";
import Geolocation from "@react-native-community/geolocation";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {setFirstTimeLoginFalse} from "@store/slices/authSlice";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {
  HomeStackRoutes,
  HomeTabRoutes,
  RootStackRoutes,
} from "@constants/routes";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.LOCATION_PROMPT
>;

const LocationPropmtScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();

  const [updateProfile, {isLoading, isSuccess, data}] =
    useUpdateProfileMutation();

  const redirectIntended = React.useCallback(() => {
    if (route.params.nextScreen) {
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
  }, [route.params.nextScreen, navigation]);

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });

      redirectIntended();
    }
  }, [enqueueSuccessSnackbar, isSuccess, data, redirectIntended]);

  React.useEffect(() => {
    dispatch(setFirstTimeLoginFalse());
  }, [dispatch]);

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
    <SafeAreaProvider>
      <View style={{justifyContent: "space-around", flex: 1}}>
        <View
          style={{
            alignItems: "center",
          }}>
          <Image
            style={{height: 100, width: 100}}
            source={require("@assets/Images/logo.png")}
          />
        </View>

        <View style={{alignItems: "center"}}>
          <Image
            style={{height: 120, width: 150}}
            source={require("@assets/Images/location.png")}
          />
        </View>

        <View>
          <View style={{marginBottom: 15}}>
            <AppPrimaryButton
              disabled={isLoading}
              text={"User Current Location"}
              containerStyle={{
                width: 275,
                backgroundColor: "#F7F7F7",
              }}
              iconContainerStyle={{
                backgroundColor: "#FCDFE6",
              }}
              textStyle={{
                fontWeight: "500",
                color: theme.colors.text,
              }}
              iconProps={{
                color: theme.colors.text,
              }}
              onPress={handleCurrentLocation}
            />
          </View>

          <View style={{marginBottom: 15}}>
            <AppPrimaryButton
              text={"Select it Manually"}
              containerStyle={{
                width: 275,
                backgroundColor: "#F7F7F7",
              }}
              iconContainerStyle={{
                backgroundColor: "#FCDFE6",
              }}
              textStyle={{
                fontWeight: "500",
                color: theme.colors.text,
              }}
              iconProps={{
                color: theme.colors.text,
              }}
              onPress={() => {
                navigation.navigate(RootStackRoutes.CHOOSE_LOCATION, {
                  nextScreen: route.params.nextScreen,
                });
              }}
            />
          </View>

          <AppPrimaryButton
            disabled={isLoading}
            text={"Skip"}
            containerStyle={{
              width: 275,
              backgroundColor: "#F7F7F7",
            }}
            iconContainerStyle={{
              backgroundColor: "#FCDFE6",
            }}
            textStyle={{
              fontWeight: "500",
              color: theme.colors.text,
            }}
            iconProps={{
              color: theme.colors.text,
            }}
            onPress={() => {
              redirectIntended();
            }}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default LocationPropmtScreen;
