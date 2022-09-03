import React from 'react';
import {View,Image} from 'react-native'
import BottomTab from './BottomTab';
import AuthStack from './AuthStack';
import {useTheme} from 'react-native-paper';
import {RootStackRoutes,AuthStackRoutes} from '../Constant/routes';
import MakeBidScreen from '../Screen/MakeBidScreen';
import PlaceBidScreen from '../Screen/PlaceBidScreen';
import AskQuestionScreen from '../Screen/AskQuestionScreen';
import ReviewOfferScreen from '../Screen/ReviewOfferScreen';
import {createStackNavigator} from '@react-navigation/stack';
import NotificationsScreen from '../Screen/NotificationsScreen';
import ProductDetailsScreen from '../Screen/ProductDetailsScreen';
import SingleConversationScreen from '../Screen/SingleConversationScreen';
import ProductSearchScreen from '../Screen/ProductSearchScreen';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ProductFilterScreen from '../Screen/ProductFilterScreen/ProductFilterScreen';
const Stack = createStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const Navigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
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
      <Stack.Screen
        component={BottomTab}
        name={RootStackRoutes.HOME}
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}
        
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        component={AuthStack}
        name={RootStackRoutes.AUTH}
      />

      <Stack.Screen name="message" component={SingleConversationScreen}
      options={{
        presentation:'modal',
        cardStyleInterpolator:forFade
      }}
      />

      <Stack.Screen
       
        component={ProductDetailsScreen}
        name={RootStackRoutes.PRODUCT_DETAILS}

      />

      <Stack.Screen
        component={PlaceBidScreen}
        name={RootStackRoutes.PLACE_BID}
        options={{title: 'Place Bid', headerTitleAlign: 'center'}}
      />

      <Stack.Screen
        component={MakeBidScreen}
        name={RootStackRoutes.MAKE_BID}
        options={{title: 'Make an offer', headerTitleAlign: 'center'}}
      />

      <Stack.Screen
        component={ReviewOfferScreen}
        name={RootStackRoutes.REVIEW_OFFER}
        options={{title: 'Review Your Offer', headerTitleAlign: 'center'}}
      />

      <Stack.Screen
        options={{
          headerShown: false,
          cardStyleInterpolator: forFade,
        }}
        component={SingleConversationScreen}
        name={RootStackRoutes.SINGLE_CONVERSATION}
      />

      <Stack.Screen
        component={AskQuestionScreen}
        options={{title: 'Ask Question'}}
        name={RootStackRoutes.ASK_QUESTION}
      />

      <Stack.Screen
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
        name={RootStackRoutes.NOTIFICATIONS}
      />

      <Stack.Screen
        component={ProductSearchScreen}
        options={{title: 'Search Product'}}
        name={RootStackRoutes.SEARCH_PRODUCT}
      />

      <Stack.Screen
        options={{
          title: 'Filter',
          headerTitleAlign: 'center',
        }}
        component={ProductFilterScreen}
        name={AuthStackRoutes.PRODUCT_FILTER}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
