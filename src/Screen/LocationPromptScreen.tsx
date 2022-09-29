import React from "react";
import {View, Image} from "react-native";
import {useAppDispatch} from "@hooks/store";
import {Text, useTheme} from "react-native-paper";
import {LocationStackParamList} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {LocationStackRoutes} from "@constants/routes";
import Geolocation from "@react-native-community/geolocation";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {setFirstTimeLoginFalse} from "@store/slices/authSlice";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  LocationStackParamList,
  typeof LocationStackRoutes.LOCATION_PROMPT
>;

const LocationPropmtScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] =
    React.useState(false);
  const [updateProfile, {isLoading: isUpdatingProfile, isSuccess, data}] =
    useUpdateProfileMutation();

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
    }
  }, [enqueueSuccessSnackbar, isSuccess, data]);

  const handleCurrentLocation = async () => {
    setIsUsingCurrentLocation(true);
    Geolocation.requestAuthorization(
      () => {
        Geolocation.getCurrentPosition(
          info => {
            const {latitude, longitude} = info.coords;

            console.log("current location", info);

            updateProfile({
              
              latitude: latitude.toString(),
              longitude: longitude.toString(),
            })
              .unwrap()
              .then(() => {
                dispatch(setFirstTimeLoginFalse());
                setIsUsingCurrentLocation(false);
              });
          },
          error => {
            setIsUsingCurrentLocation(false);

            enqueueErrorSnackbar({
              text2: error.message,
            });
          },
        );
      },
      error => {
        setIsUsingCurrentLocation(false);

        enqueueErrorSnackbar({
          text2: error.message,
        });
      },
    );
  };

  return (
    <SafeAreaProvider>
      {isUsingCurrentLocation && <Text>Updating...</Text>}

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
              disabled={isUpdatingProfile}
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
                navigation.navigate(LocationStackRoutes.CHOOSE_LOCATION, {
                  nextScreen: route.params?.nextScreen,
                });
              }}
            />
          </View>

          <AppPrimaryButton
            disabled={isUpdatingProfile}
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
