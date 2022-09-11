import React from 'react';
import { Divider, Title, useTheme } from 'react-native-paper';
import AppPrimaryButton from '../../Component/AppPrimaryButton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ListItem, Button, Slider, Text } from 'react-native-elements';
import { FlatList, Modal, View, TouchableOpacity, } from 'react-native';
import { FloatingLabelInput, setGlobalStyles } from 'react-native-floating-label-input';

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

export default function LocationSelectionModal({ open, onClose, onSelect, initialValue }: {
  open: boolean;
  onClose: () => void; onSelect: (props: { location: string; distance: number }) => void;
  initialValue?: { location?: string; distance?: number }
}) {
  const theme = useTheme()
  const [distance, setDistance] = React.useState(0)
  const [location, setLocation] = React.useState("")

  React.useEffect(() => {
    if (initialValue?.distance) {
      setDistance(initialValue.distance)
    }

    if (initialValue?.location) {
      setLocation(initialValue.location)
    }
  }, [initialValue])

  return (
    <Modal visible={open} animationType={'slide'}>
      <View style={{ padding: 15 }}>
        <Title>Location Filter</Title>
      </View>

      <View style={{ padding: 15 }}>
        <FloatingLabelInput
          label={"Location"}
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={{ padding: 15 }}>
        <Text>Distance</Text>
        <Slider
          step={10}
          minimumValue={0}
          value={distance}
          maximumValue={500}
          thumbTintColor={theme.colors.primary}
          thumbStyle={{ height: 25, width: 25 }}
          onValueChange={(value) => setDistance(value)}
        />
        <Text>{Math.round(distance)} miles</Text>
      </View>

      <View style={{ marginTop: 15 }}>
        <AppPrimaryButton
          onPress={() => {
            onSelect({
              location, distance
            })
            onClose()
          }}
          text={'Apply Location'}
        />
      </View>
    </Modal>
  );
}
