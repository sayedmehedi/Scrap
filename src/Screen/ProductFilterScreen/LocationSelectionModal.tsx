import React from "react";
import {Modal, View} from "react-native";
import {Title, useTheme} from "react-native-paper";
import {Slider, Text} from "react-native-elements";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {REAC_APP_GOOGLE_MAPS_API_KEY} from "react-native-dotenv";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {
  FloatingLabelInput,
  setGlobalStyles,
} from "react-native-floating-label-input";

setGlobalStyles.containerStyles = {
  height: 58,
  borderRadius: 6,
  paddingHorizontal: 10,
  backgroundColor: "#fff",
};

setGlobalStyles.customLabelStyles = {
  fontSizeFocused: 12,
  fontSizeBlurred: 15,
  colorFocused: "#707070",
  colorBlurred: "#707070",
};

setGlobalStyles.labelStyles = {
  paddingTop: 5,
  paddingHorizontal: 5,
  fontFamily: "Inter-Regular",
};

setGlobalStyles.inputStyles = {
  fontSize: 15,
  marginTop: 15,
  color: "#707070",
  fontWeight: "600",
};

export default function LocationSelectionModal({
  open,
  onClose,
  onSelect,
  initialValue,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (props: {location: string; distance: number}) => void;
  initialValue?: {location?: string; distance?: number};
}) {
  const theme = useTheme();
  const [distance, setDistance] = React.useState(0);
  const [location, setLocation] = React.useState("");

  React.useEffect(() => {
    if (initialValue?.distance) {
      setDistance(initialValue.distance);
    }

    if (initialValue?.location) {
      setLocation(initialValue.location);
    }
  }, [initialValue]);

  return (
    <Modal visible={open} animationType={"slide"}>
      <View style={{padding: 15}}>
        <Title>Location Filter</Title>
      </View>

      <View style={{paddingHorizontal: 15}}>
        <Text>Location</Text>
      </View>
      <View style={{position: "relative", height: 50, zIndex: 1}}>
        <View
          style={{
            zIndex: 1,
            width: "100%",
            position: "absolute",
            paddingHorizontal: 15,
          }}>
          <GooglePlacesAutocomplete
            fetchDetails
            placeholder={"Enter your location"}
            currentLocationLabel="Use Current Location"
            onPress={(data, details) => {
              if (details) {
                const location = details.name;
                setLocation(location);
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
      </View>

      <View style={{padding: 15}}>
        <Text>Distance</Text>
        <Slider
          step={10}
          minimumValue={0}
          value={distance}
          maximumValue={500}
          thumbTintColor={theme.colors.primary}
          thumbStyle={{height: 25, width: 25}}
          onValueChange={value => setDistance(value)}
        />
        <Text>{Math.round(distance)} miles</Text>
      </View>

      <View style={{marginTop: 15}}>
        <AppPrimaryButton
          onPress={() => {
            onSelect({
              location,
              distance,
            });
            onClose();
          }}
          text={"Apply Location"}
        />
      </View>
    </Modal>
  );
}
