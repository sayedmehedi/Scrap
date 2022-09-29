import React from "react";
import styles from "../styles";
import {useForm} from "react-hook-form";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import {Overlay} from "react-native-elements"
import Toast from "react-native-toast-message";
import useAppSnackbar from "@hooks/useAppSnackbar";
import Entypo from "react-native-vector-icons/Entypo";
import {REAC_APP_GOOGLE_MAPS_API_KEY} from "react-native-dotenv";
import {View, Text, Modal, TouchableOpacity,Dimensions} from "react-native";
import AppPrimaryButton from "../../../Component/AppPrimaryButton";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";


export default function ChangeLocationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const profile = useAppSelector(state => state.auth.profile);

  const {setValue, handleSubmit} = useForm({
    defaultValues: {
      location: "",
      latitude: "",
      longitude: "",
    },
  });

  React.useEffect(() => {
    if (profile?.location) {
      setValue("location", profile.location);
    }
    if (profile?.latitude) {
      setValue("latitude", profile.latitude);
    }
    if (profile?.longitude) {
      setValue("longitude", profile.longitude);
    }
  }, [profile, setValue]);

  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [updateProfile, {isLoading, isSuccess, data}] =
    useUpdateProfileMutation();

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
      onClose();
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: data.error,
      });
    }
  }, [enqueueSuccessSnackbar, enqueueErrorSnackbar, isSuccess, data]);

  const handleUpdate = handleSubmit(values => {
    updateProfile({
      latitude: values.latitude,
      location: values.location,
      longitude: values.longitude,
    });
  });

  return (
    <Modal      visible={open}
      transparent={true}
      animationType={"slide"}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalView,{height:Dimensions.get('window').height,paddingHorizontal:20}]}>
        <TouchableOpacity
            style={{alignSelf: "center", marginBottom: 20, borderWidth: 1, borderRadius: 500, padding: 10, borderColor: theme.colors.primary}}
            onPress={onClose}>
            <Entypo name="cross" size={25} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              color: theme.colors.text,
              fontFamily: "Inter-Regular",
            }}>
            Update Location
          </Text>

          <GooglePlacesAutocomplete
            fetchDetails
            currentLocation
            placeholder={"Enter your location"}
            currentLocationLabel="Use Current Location"
            styles={{
              container: {
                width: "100%",
              },
              textInput: {
                height: 40,
                width: 280,
                borderWidth: 1,
                borderColor: "#C9C9C9",
                borderRadius: 8,
                textAlign: "center",
                marginVertical: 20,
              },
            }}
            onPress={(data, details) => {
              if (details) {
                const location = details.name;
                const {lat, lng} = details.geometry.location;

                setValue("location", location);
                setValue("latitude", lat.toString());
                setValue("longitude", lng.toString());
              }
            }}
            onFail={error => console.error("fail", error)}
            onNotFound={() => console.error("not found")}
            query={{
              language: "en",
              key: REAC_APP_GOOGLE_MAPS_API_KEY,
            }}
          />

          <AppPrimaryButton
            disabled={isLoading}
            text={"Update"}
            onPress={handleUpdate}
          />

          <Toast />
        </View>
      </View>
    </Modal>
  );
}
