import React from "react";
import {View, Image} from "react-native";
import {useTheme} from "react-native-paper";
import {useAppDispatch} from "@hooks/store";
import {LocationStackParamList} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {LocationStackRoutes} from "@constants/routes";
import Geolocation from "@react-native-community/geolocation";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {setFirstTimeLoginFalse} from "@store/slices/authSlice";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";

type Props = NativeStackScreenProps<
  LocationStackParamList,
  typeof LocationStackRoutes.LOCATION_PROMPT
>;

const LocationPropmtScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();

  const [updateProfile, {isLoading, isSuccess, data}] =
    useUpdateProfileMutation();

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
    }
  }, [enqueueSuccessSnackbar, isSuccess, data]);

  const handleCurrentLocation = async () => {
    Geolocation.requestAuthorization(
      () => {
        Geolocation.getCurrentPosition(
          info => {
            const {latitude, longitude} = info.coords;

            updateProfile({
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            })
              .unwrap()
              .then(() => {
                dispatch(setFirstTimeLoginFalse());
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
                navigation.navigate(LocationStackRoutes.CHOOSE_LOCATION);
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
              dispatch(setFirstTimeLoginFalse());
            }}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default LocationPropmtScreen;
