import React from 'react';
import { forFade } from '@utils/misc';
import { useTheme } from 'react-native-paper';
import ErrorScreen from '../Screen/ErrorScreen';
import ProfileScreen from '../Screen/ProfileScreen';
import { ProfileStackParamList } from '@src/types';
import { createStackNavigator } from '@react-navigation/stack';
import PurchasesScreen from '../Screen/ProfileScreen/PurchasesScreen';
import OfferAndBidScreen from '../Screen/ProfileScreen/OfferAndBidScreen';
import SaveProductScreen from '../Screen/ProfileScreen/SaveProductScreen';
import PublicProfileScreen from '../Screen/ProfileScreen/PublicProfileScreen';
import AccountSettingScreen from '../Screen/ProfileScreen/AccountSettingScreen';


const Profile = createStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  const theme = useTheme();

  return (
    <Profile.Navigator
      initialRouteName="profileScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: 'Inter-Bold',
          // @ts-ignore
          color: theme.colors.white,
        },
        headerTitleAlign: 'center',
        // @ts-ignore
        headerTintColor: theme.colors.white,
        cardStyleInterpolator: forFade,
      }}>
      <Profile.Screen
        options={{
          title: 'My Account',
        }}
        name="profileScreen"
        component={ProfileScreen}
      />

      <Profile.Screen
        options={{
          title: 'Offer And Bid',
        }}
        name="offerAndBid"
        component={OfferAndBidScreen}
      />

      <Profile.Screen
        options={{
          title: 'Save Product',
        }}
        name="saveProduct"
        component={SaveProductScreen}
      />

      <Profile.Screen
        options={{
          title: 'Public Profile',
        }}
        name="publicProfile"
        component={PublicProfileScreen}
      />

      <Profile.Screen
        options={{
          title: 'Account Settings',
        }}
        name="accountSetting"
        component={AccountSettingScreen}
      />
      <Profile.Screen
        options={{
          title: 'Error',
        }}

        name="error"
        component={ErrorScreen}
      />

      <Profile.Screen
        name='purchases'
        options={{
          title: "Purchase History"
        }}
        component={PurchasesScreen}
      />

    </Profile.Navigator>
  );
};

export default ProfileStack;
