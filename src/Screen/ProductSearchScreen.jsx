import React from 'react';
import {TextInput, View} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//navigator.geolocation = require('@react-native-community/geolocation');

const ProductSearchScreen = () => {
  const theme = useTheme();
  const [placeText, setPlaceText] = React.useState('');

  return (
    <>
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
              value={placeText}
              onChangeText={setPlaceText}
              placeholder={'Enter product name'}
              style={{
                paddingHorizontal: 50,
                borderRadius: theme.roundness * 3,
                backgroundColor: theme.colors.white,
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

export default ProductSearchScreen;
