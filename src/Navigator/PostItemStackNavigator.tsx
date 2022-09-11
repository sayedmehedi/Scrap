import React from 'react';
import { forFade } from '@utils/misc';
import { useTheme } from 'react-native-paper';
import { PostItemStackParamList } from '@src/types';
import { PostItemStackRoutes } from '../constants/routes';
import { createStackNavigator } from '@react-navigation/stack';
import ProductAddPriceScreen from '../Screen/ProductAddPriceScreen';
import ProductImageUploadScreen from '../Screen/ProductImageUploadScreen';
import ProductAddSuccessScreen from '../Screen/ProductAddSuccessScreen';
import ProductAddDeliveryMethodScreen from '../Screen/ProductAddDeliveryMethodScreen';
import ProductAddDetailsScreen from '../Screen/ProductAddDetailsScreen/ProductAddDetailsScreen';

const PostItemStack = createStackNavigator<PostItemStackParamList>();


export default function PostItemStackNavigator() {
  const theme = useTheme();
  return (
    <PostItemStack.Navigator
      initialRouteName={PostItemStackRoutes.UPLOAD_PHOTO}
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
        // @ts-ignore
        headerTintColor: theme.colors.white,
        cardStyleInterpolator: forFade,
      }}>
      <PostItemStack.Screen
        options={{
          title: 'Photo & Title',
        }}
        component={ProductImageUploadScreen}
        name={PostItemStackRoutes.UPLOAD_PHOTO}
      />

      <PostItemStack.Screen
        options={{
          title: 'Details info',
        }}
        component={ProductAddDetailsScreen}
        name={PostItemStackRoutes.ADD_DETAILS}
      />

      <PostItemStack.Screen
        options={{
          title: 'Price & Auction Duration',
        }}
        component={ProductAddPriceScreen}
        name={PostItemStackRoutes.ADD_PRICE}
      />

      <PostItemStack.Screen
        options={{
          title: 'Delivery Method',
        }}
        component={ProductAddDeliveryMethodScreen}
        name={PostItemStackRoutes.ADD_DELIVERY_METHOD}
      />

      <PostItemStack.Screen
        options={{
          title: 'Thank you!',
          headerTitleAlign: 'center',
        }}
        component={ProductAddSuccessScreen}
        name={PostItemStackRoutes.SUCCESS}
      />
    </PostItemStack.Navigator>
  );
}
