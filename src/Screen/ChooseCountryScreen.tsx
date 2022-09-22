import React from "react";
import {View} from "react-native";
import {RootStackParamList} from "@src/types";
import {Overlay} from "react-native-elements";
import {REAC_APP_GOOGLE_MAPS_API_KEY} from "react-native-dotenv";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import CircularProgress from "react-native-circular-progress-indicator";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {
  HomeStackRoutes,
  HomeTabRoutes,
  RootStackRoutes,
} from "@constants/routes";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.CHOOSE_LOCATION
>;

const ChooseCountryScreen = ({navigation, route}: Props) => {
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const [
    updateProfile,
    {
      data: updateProfileReponse,
      isLoading: isUpdatingProfile,
      isError: isUpdateProfileError,
      isSuccess: isUpdateProfileSuccess,
    },
  ] = useUpdateProfileMutation();

  const redirectIntended = React.useCallback(() => {
    if (route.params?.nextScreen) {
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
  }, [route, navigation]);

  React.useEffect(() => {
    if (isUpdateProfileSuccess && !!updateProfileReponse) {
      redirectIntended();
    }
  }, [isUpdateProfileSuccess, updateProfileReponse, redirectIntended]);

  return (
    <View style={{flex: 1}}>
      <Overlay
        isVisible={
          isUpdatingProfile && !isUpdateProfileSuccess && !isUpdateProfileError
        }
        overlayStyle={{
          width: "80%",
          elevation: 0,
          height: "50%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}>
        <CircularProgress
          radius={50}
          maxValue={100}
          duration={2000}
          titleColor={"black"}
          value={uploadProgress}
          activeStrokeColor={"white"}
          progressValueColor={"white"}
        />
      </Overlay>

      <GooglePlacesAutocomplete
        fetchDetails
        currentLocation
        placeholder={"Enter your location"}
        currentLocationLabel="Use Current Location"
        onPress={(data, details) => {
          if (details) {
            const location = details.name;
            const {lat, lng} = details.geometry.location;

            updateProfile({
              location,
              latitude: lat.toString(),
              longitude: lng.toString(),
              onUploadProgress(event) {
                const progress = Math.round(event.loaded / event.total) * 100;
                setUploadProgress(progress);
              },
            });
          }
        }}
        onFail={error => console.error("fail", error)}
        onNotFound={() => console.error("not found")}
        query={{
          language: "en",
          key: REAC_APP_GOOGLE_MAPS_API_KEY,
        }}
      />
    </View>
  );
};

export default ChooseCountryScreen;
