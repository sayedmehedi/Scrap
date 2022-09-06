import React from 'react';
import BottomTab from './BottomTab';
import AuthStack from './AuthStack';
import { forFade } from '@utils/misc';
import { useTheme } from 'react-native-paper';
import { RootStackParamList } from '@src/types';
import MakeBidScreen from '../Screen/MakeBidScreen';
import PlaceBidScreen from '../Screen/PlaceBidScreen';
import { RootStackRoutes } from '../constants/routes';
import AskQuestionScreen from '../Screen/AskQuestionScreen';
import ReviewOfferScreen from '../Screen/ReviewOfferScreen';
import { createStackNavigator, } from '@react-navigation/stack';
import NotificationsScreen from '../Screen/NotificationsScreen';
import ProductDetailsScreen from '../Screen/ProductDetailsScreen';
import ProductSearchScreen from '../Screen/ProductSearchScreen';
import SingleConversationScreen from '../Screen/SingleConversationScreen';
import ProductFilterScreen from '../Screen/ProductFilterScreen/ProductFilterScreen';

const RootStack = createStackNavigator<RootStackParamList>();


const Navigator = () => {
  const theme = useTheme();

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: 'Inter-Bold',
          color: theme.colors.white,
        },
        headerTintColor: theme.colors.white,
        cardStyleInterpolator: forFade,
      }}>
      <RootStack.Screen
        component={BottomTab}
        name={RootStackRoutes.HOME}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        component={AuthStack}
        name={RootStackRoutes.AUTH}
      />

      <RootStack.Screen
        component={SingleConversationScreen}
        name={RootStackRoutes.SINGLE_CONVERSATION}
        options={{
          presentation: 'modal',
          cardStyleInterpolator: forFade,
        }}
      />

      <RootStack.Screen
        component={ProductDetailsScreen}
        name={RootStackRoutes.PRODUCT_DETAILS}
      />

      <RootStack.Screen
        component={PlaceBidScreen}
        name={RootStackRoutes.PLACE_BID}
        options={{ title: 'Place Bid', headerTitleAlign: 'center' }}
      />

      <RootStack.Screen
        component={MakeBidScreen}
        name={RootStackRoutes.MAKE_BID}
        options={{ title: 'Make an offer', headerTitleAlign: 'center' }}
      />

      <RootStack.Screen
        component={ReviewOfferScreen}
        name={RootStackRoutes.REVIEW_OFFER}
        options={{ title: 'Review Your Offer', headerTitleAlign: 'center' }}
      />

      <RootStack.Screen
        component={AskQuestionScreen}
        options={{ title: 'Ask Question' }}
        name={RootStackRoutes.ASK_QUESTION}
      />

      <RootStack.Screen
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
        name={RootStackRoutes.NOTIFICATIONS}
      />

      <RootStack.Screen
        component={ProductSearchScreen}
        options={{ title: 'Search Product' }}
        name={RootStackRoutes.SEARCH_PRODUCT}
      />

      <RootStack.Screen
        options={{
          title: 'Filter',
          headerTitleAlign: 'center',
        }}
        component={ProductFilterScreen}
        name={RootStackRoutes.PRODUCT_FILTER}
      />
    </RootStack.Navigator>
  );
};

export default Navigator;
