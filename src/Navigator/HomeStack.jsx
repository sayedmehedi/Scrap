import React from 'react';
import HomeScreen from '../Screen/HomeScreen';
import ShippingScreen from '../Screen/ShippingScreen';
import {createStackNavigator} from '@react-navigation/stack';
import LocalPickupScreen from '../Screen/LocalPickupScreen';
import AllCategoriesScreen from '../Screen/AllCategoriesScreen';
import IndividualCategoriesScreen from '../Screen/IndividualCategoriesScreen';

const Home = createStackNavigator();
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});
const HomeStack = () => {
  return (
    <Home.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: forFade,
      }}>
      <Home.Screen name="home" component={HomeScreen} />
      <Home.Screen name="localPickup" component={LocalPickupScreen} />
      <Home.Screen
        name="individualCategories"
        component={IndividualCategoriesScreen}
      />
      <Home.Screen name="shipping" component={ShippingScreen} />
      <Home.Screen name="allCategories" component={AllCategoriesScreen} />
    </Home.Navigator>
  );
};

export default HomeStack;
