import React from 'react';
import {TextInput, View} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

//navigator.geolocation = require('@react-native-community/geolocation');

const ChooseLocationScreen = () => {
  const theme = useTheme();
  const [placeText, setPlaceText] = React.useState('');

  const ref = React.useRef();

  React.useEffect(() => {
    ref.current?.setAddressText(placeText);
  }, [placeText]);

  const getCurrentLocation = () => {
    ref.current?.getCurrentLocation();
  };

  return (
    <>
      {/* <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyBS5uptcl-aFEDYs01Ei5wQ47N_JE2ImTU',
        language: 'en',
      }}
    /> */}
      <View style={{flex: 1}}>
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
            <View style={{position: 'absolute', zIndex: 1, left: 15, top: 10}}>
              <MaterialIcons name={'search'} size={30} />
            </View>

            <TextInput
            onFocus={()=>{
             // ref.current?.focus();
            }}
            onBlur={()=>{
              ref.current?.blur();
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
        <View style={{alignSelf: 'flex-start'}}>
          <Button
            uppercase={false}
            icon={({size, color}) => (
              <MaterialIcons size={size} color={color} name={'location-on'} />
            )}
            color={theme.colors.primary}
            onPress={getCurrentLocation}>
            Use Current Location
          </Button>
        </View>

        {/* <GooglePlacesAutocomplete
          ref={ref}
          //currentLocation
          // textInputHide
          listViewDisplayed
          placeholder={'Enter your location'}
          currentLocationLabel="Use Current Location"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log('onPress', data, details);
          }}
          onFail={error => console.error('fail', error)}
          onNotFound={error => console.error('not found', error)}
          query={{
            language: 'en',
            key: 'AIzaSyBS5uptcl-aFEDYs01Ei5wQ47N_JE2ImTU',
          }}
        /> */}
      </View>
    </>
  );
};

export default ChooseLocationScreen;
