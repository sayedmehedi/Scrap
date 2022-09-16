import React from 'react';
import { View, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RootStackParamList } from '@src/types';
import { HomeStackRoutes, HomeTabRoutes, RootStackRoutes } from '@constants/routes';
import useAppSnackbar from '@hooks/useAppSnackbar';
import Geolocation from '@react-native-community/geolocation';
import AppPrimaryButton from '@src/Component/AppPrimaryButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useUpdateProfileMutation } from '@data/laravel/services/auth';

type Props = NativeStackScreenProps<RootStackParamList, typeof RootStackRoutes.LOCATION_PROMPT>

const LocationPropmtScreen = ({ navigation, route }: Props) => {
  const theme = useTheme();
  const { enqueueSuccessSnackbar, enqueueErrorSnackbar } = useAppSnackbar();

  const [updateProfile, { isLoading, isSuccess, data }] = useUpdateProfileMutation()

  React.useEffect(() => {
    if (isSuccess && !!data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      })

      if (route.params.nextScreen) {
        // @ts-ignore
        navigation.replace(route.params.nextScreen.name, route.params.nextScreen.params)
      } else {
        navigation.replace(RootStackRoutes.HOME, {
          screen: HomeTabRoutes.HOME,
          params: {
            screen: HomeStackRoutes.HOME
          }
        })
      }
    }
  }, [enqueueSuccessSnackbar, isSuccess, data, route, navigation])

  const handleCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      info => {
        const { latitude, longitude } = info.coords

        updateProfile({
          latitude: latitude.toString(),
          longitude: longitude.toString()
        })
      },
      error => {
        enqueueErrorSnackbar({
          text1: error.message
        })
      });
  }

  return (
    <SafeAreaProvider>
      <View style={{ justifyContent: 'space-around', flex: 1 }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Image
            style={{ height: 100, width: 100 }}
            source={require('@assets/Images/logo.png')}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Image
            style={{ height: 120, width: 150 }}
            source={require('@assets/Images/location.png')}
          />
        </View>

        <View>
          <View style={{ marginBottom: 15 }}>
            <AppPrimaryButton
              disabled={isLoading}
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
              onPress={handleCurrentLocation}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
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
                navigation.navigate(RootStackRoutes.CHOOSE_COUNTRY, {
                  nextScreen: route.params.nextScreen
                });
              }}
            />
          </View>

          <AppPrimaryButton
            disabled={isLoading}
            text={'Skip'}
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
              if (route.params.nextScreen) {
                // @ts-ignore
                navigation.replace(route.params.nextScreen.name, route.params.nextScreen.params)
              } else {
                navigation.replace(RootStackRoutes.HOME, {
                  screen: HomeTabRoutes.HOME,
                  params: {
                    screen: HomeStackRoutes.HOME
                  }
                })
              }
            }}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

export default LocationPropmtScreen;
