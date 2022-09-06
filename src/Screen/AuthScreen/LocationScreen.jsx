import React from 'react';
import {View, Image} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppPrimaryButton from '../../Component/AppPrimaryButton';
import {AuthStackRoutes} from '../../constants/routes';

const LocationScreen = ({}) => {
  const navigation = useNavigation();

  const theme = useTheme();
  return (
    <SafeAreaProvider>
      <View style={{justifyContent: 'space-around', flex: 1}}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            style={{height: 100, width: 100}}
            source={require('../../assets/Images/logo.png')}
          />
        </View>

        <View style={{alignItems: 'center'}}>
          <Image
            style={{height: 120, width: 150}}
            source={require('../../assets/Images/location.png')}
          />
        </View>

        <View>
          <View style={{marginBottom: 15}}>
            <AppPrimaryButton
              text={'User Current Location'}
              containerStyle={{
                width: 275,
                backgroundColor: theme.colors.white,
              }}
              iconContainerStyle={{
                backgroundColor: '#FCDFE6',
              }}
              textStyle={{
                fontWeight: '500',
                color: theme.colors.text,
              }}
              iconProps={{
                color: theme.colors.text,
              }}
            />
          </View>

          <AppPrimaryButton
            text={'Select it Manually'}
            containerStyle={{
              width: 275,
              backgroundColor: theme.colors.white,
            }}
            iconContainerStyle={{
              backgroundColor: '#FCDFE6',
            }}
            textStyle={{
              fontWeight: '500',
              color: theme.colors.text,
            }}
            iconProps={{
              color: theme.colors.text,
            }}
            onPress={() => {
              navigation.navigate(AuthStackRoutes.CHOOSE_LOCATION);
            }}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default LocationScreen;
