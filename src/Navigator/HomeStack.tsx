import React from 'react';
import { forFade } from '@utils/misc';
import HomeScreen from '../Screen/HomeScreen';
import { useTheme } from 'react-native-paper';
import { HomeStackParamList } from '@src/types';
import { HomeStackRoutes } from '@constants/routes';
import ShippingScreen from '../Screen/ShippingScreen';
import LocalPickupScreen from '../Screen/LocalPickupScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AllCategoriesScreen from '../Screen/AllCategoriesScreen';
import ProductisListByCriteriaScreen from '../Screen/ProductisListByCriteriaScreen';

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  const theme = useTheme();

  return (
    <HomeStack.Navigator
      screenOptions={{
        cardStyleInterpolator: forFade,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: 'Inter-Bold',
          // @ts-ignore
          color: theme.colors.white,
        },
        // @ts-ignore
        headerTintColor: theme.colors.white,
      }}>
      <HomeStack.Screen
        options={{
          headerShown: false
        }}
        name={HomeStackRoutes.HOME} component={HomeScreen} />
      <HomeStack.Screen
        options={{
          title: "Local Pickup"
        }}
        name={HomeStackRoutes.LOCAL_PICKUP} component={LocalPickupScreen} />

      <HomeStack.Screen
        component={ProductisListByCriteriaScreen}
        name={HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA}
      />

      <HomeStack.Screen
        options={{
          title: "Shipping"
        }}
        name={HomeStackRoutes.SHIPPING}
        component={ShippingScreen} />

      <HomeStack.Screen
        options={{
          headerShown: false
        }}
        component={AllCategoriesScreen}
        name={HomeStackRoutes.ALL_CATEGORIES}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
