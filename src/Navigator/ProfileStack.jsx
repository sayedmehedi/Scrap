import React from 'react';
import {useTheme} from 'react-native-paper';
import ProfileScreen from '../Screen/ProfileScreen';
import {createStackNavigator} from '@react-navigation/stack';
import PurchasesScreen from '../Screen/ProfileScreen/PurchasesScreen';
import OfferAndBidScreen from '../Screen/ProfileScreen/OfferAndBidScreen';
import SaveProductScreen from '../Screen/ProfileScreen/SaveProductScreen';
import PublicProfileScreen from '../Screen/ProfileScreen/PublicProfileScreen';
import AccountSettingScreen from '../Screen/ProfileScreen/AccountSettingScreen';
import ErrorScreen from '../Screen/ErrorScreen';

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const Profile = createStackNavigator();

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
          color: theme.colors.white,
        },
        headerTitleAlign: 'center',
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
        component={PurchasesScreen}
      />

    </Profile.Navigator>
  );
};

export default ProfileStack;
