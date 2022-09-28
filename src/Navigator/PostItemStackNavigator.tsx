import React from "react";
import {forFade} from "@utils/misc";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import {PostItemStackRoutes} from "../constants/routes";
import AuthStackNavigator from "./AuthStackNavigator";
import {defaultTabBarStyles} from "@constants/Colors";
import {createStackNavigator} from "@react-navigation/stack";
import LocationStackNavigator from "./LocationStackNavigator";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import ProductAddPriceScreen from "../Screen/ProductAddPriceScreen";
import {HomeTabParamList, PostItemStackParamList} from "@src/types";
import ProductImageUploadScreen from "../Screen/ProductImageUploadScreen";
import ProductAddSuccessScreen from "../Screen/ProductAddSuccessScreen";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import ProductAddDeliveryMethodScreen from "../Screen/ProductAddDeliveryMethodScreen";
import ProductAddDetailsScreen from "../Screen/ProductAddDetailsScreen/ProductAddDetailsScreen";

const PostItemStack = createStackNavigator<PostItemStackParamList>();

type Props = NativeStackScreenProps<HomeTabParamList>;

export default function PostItemStackNavigator({
  navigation: tabNavigation,
}: Props) {
  const theme = useTheme();
  const profile = useAppSelector(state => state.auth.profile);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFirstTimeLogin = useAppSelector(state => state.auth.firstTimeLogin);

  React.useEffect(() => {
    const options: Record<string, any> = {};

    if (isFirstTimeLogin || !isAuthenticated) {
      options.tabBarStyle = {display: "none"};
    } else {
      options.tabBarStyle = defaultTabBarStyles;
    }

    tabNavigation.setOptions(options);
  }, [tabNavigation, isAuthenticated, isFirstTimeLogin]);

  return (
    <PostItemStack.Navigator
      initialRouteName={PostItemStackRoutes.UPLOAD_PHOTO}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-Bold",
          color: theme.colors.white,
        },
        headerTintColor: theme.colors.white,
        cardStyleInterpolator: forFade,
      }}>
      {(isAuthenticated && isFirstTimeLogin) ||
      (isAuthenticated && !profile?.location) ? (
        <PostItemStack.Screen
          component={LocationStackNavigator}
          name={PostItemStackRoutes.LOCATION}
        />
      ) : isAuthenticated ? (
        <React.Fragment>
          <PostItemStack.Screen
            options={{
              title: "Photo & Title",
            }}
            component={ProductImageUploadScreen}
            name={PostItemStackRoutes.UPLOAD_PHOTO}
          />

          <PostItemStack.Screen
            options={{
              title: "Details info",
            }}
            component={ProductAddDetailsScreen}
            name={PostItemStackRoutes.ADD_DETAILS}
          />

          <PostItemStack.Screen
            options={{
              title: "Price & Auction Duration",
            }}
            component={ProductAddPriceScreen}
            name={PostItemStackRoutes.ADD_PRICE}
          />

          <PostItemStack.Screen
            options={{
              title: "Delivery Method",
            }}
            component={ProductAddDeliveryMethodScreen}
            name={PostItemStackRoutes.ADD_DELIVERY_METHOD}
          />

          <PostItemStack.Screen
            options={{
              title: "Thank you!",
              headerTitleAlign: "center",
            }}
            component={ProductAddSuccessScreen}
            name={PostItemStackRoutes.SUCCESS}
          />
        </React.Fragment>
      ) : (
        <PostItemStack.Screen
          options={{
            headerShown: false,
          }}
          name={PostItemStackRoutes.AUTH}
          component={AuthStackNavigator}
        />
      )}
    </PostItemStack.Navigator>
  );
}
