import React from 'react';
import { TextInput, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const ChooseCityScreen = () => {
  const theme = useTheme();
  const [placeText, setPlaceText] = React.useState('');

  return (
    <>
      <View style={{ flex: 1 }}>
        <View
          style={{
            padding: 15,
            paddingTop: 0,
            backgroundColor: theme.colors.primary,
          }}>
          <View
            style={{
              position: 'relative',
              backgroundColor: theme.colors.primary,
            }}>
            <View style={{ position: 'absolute', zIndex: 1, left: 15, top: 10 }}>
              <MaterialIcons name={'search'} size={30} />
            </View>

            <TextInput
              onFocus={() => {
                // ref.current?.focus();
              }}
              value={placeText}
              onChangeText={setPlaceText}
              placeholder={'Enter your location'}
              style={{
                paddingHorizontal: 50,
                borderRadius: theme.roundness * 3,
                backgroundColor: theme.colors.white,
              }}
            />
          </View>
        </View>
        <View style={{ alignSelf: 'flex-start' }}>
          <Button
            uppercase={false}
            icon={({ size, color }) => (
              <MaterialIcons size={size} color={color} name={'location-on'} />
            )}
            color={theme.colors.primary}
          >
            Use Current Location
          </Button>
        </View>
      </View>
    </>
  );
};

export default ChooseCityScreen;
