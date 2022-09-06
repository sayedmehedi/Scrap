import React from 'react';
import { forFade } from '@utils/misc';
import HomeScreen from '../Screen/HomeScreen';
import { HomeStackParamList } from '@src/types';
import { HomeStackRoutes } from '@constants/routes';
import ShippingScreen from '../Screen/ShippingScreen';
import LocalPickupScreen from '../Screen/LocalPickupScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AllCategoriesScreen from '../Screen/AllCategoriesScreen';
import IndividualCategoriesScreen from '../Screen/IndividualCategoriesScreen';

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: forFade,
      }}>
      <HomeStack.Screen name={HomeStackRoutes.HOME} component={HomeScreen} />
      <HomeStack.Screen name={HomeStackRoutes.LOCAL_PICKUP} component={LocalPickupScreen} />
      <HomeStack.Screen
        component={IndividualCategoriesScreen}
        name={HomeStackRoutes.INDIVIDUAL_CATEGORIES}
      />
      <HomeStack.Screen name={HomeStackRoutes.SHIPPING} component={ShippingScreen} />
      <HomeStack.Screen name={HomeStackRoutes.ALL_CATEGORIES} component={AllCategoriesScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
