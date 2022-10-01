import React from "react";
import {forFade} from "@utils/misc";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import ProfileScreen from "../Screen/ProfileScreen";
import {ProfileStackRoutes} from "@constants/routes";
import {defaultTabBarStyles} from "@constants/Colors";
import AuthStackNavigator from "./AuthStackNavigator";
import {createStackNavigator} from "@react-navigation/stack";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import LocationStackNavigator from "./LocationStackNavigator";
import {HomeTabParamList, ProfileStackParamList} from "@src/types";
import PurchasesScreen from "../Screen/ProfileScreen/PurchasesScreen";
import ContactUsScreen from "@src/Screen/ProfileScreen/ContactUsScreen";
import HelpAndSupportScreen from "@src/Screen/ProfileScreen/HelpAndSupportScreen";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import OfferAndBidScreen from "../Screen/ProfileScreen/OfferAndBidScreen";
import SaveProductScreen from "../Screen/ProfileScreen/SaveProductScreen";
import PublicProfileScreen from "../Screen/ProfileScreen/PublicProfileScreen";
import AccountSettingScreen from "../Screen/ProfileScreen/AccountSettingScreen";
import TransactionsScreen from "@src/Screen/ProfileScreen/TransactionListScreen";

const ProfileStack = createStackNavigator<ProfileStackParamList>();

type Props = NativeStackScreenProps<HomeTabParamList>;

const ProfileStackNavigator = ({navigation: tabNavigation}: Props) => {
  const theme = useTheme();
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
    <ProfileStack.Navigator
      initialRouteName={ProfileStackRoutes.PROFILE_SCREEN}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-Bold",
          color: theme.colors.white,
        },
        headerTitleAlign: "center",
        headerTintColor: theme.colors.white,
        cardStyleInterpolator: forFade,
      }}>
      {isAuthenticated && isFirstTimeLogin ? (
        <ProfileStack.Screen
        options={{
          headerShown: false,
        }}
          component={LocationStackNavigator}
          name={ProfileStackRoutes.LOCATION}
        />
      ) : isAuthenticated ? (
        <React.Fragment>
          <ProfileStack.Screen
            options={{
              title: "My Account",
            }}
            component={ProfileScreen}
            name={ProfileStackRoutes.PROFILE_SCREEN}
          />

          <ProfileStack.Screen
            options={{
              title: "Transactions",
            }}
            component={TransactionsScreen}
            name={ProfileStackRoutes.TRANSACTION}
          />

          <ProfileStack.Screen
            options={{
              title: "Offer & Bid",
            }}
            name={ProfileStackRoutes.OFFER_N_BID}
            component={OfferAndBidScreen}
          />

          <ProfileStack.Screen
            options={{
              title: "Save Product",
            }}
            name={ProfileStackRoutes.SAVE_PRODUCT}
            component={SaveProductScreen}
          />

          <ProfileStack.Screen
            options={{
              title: "Public Profile",
            }}
            component={PublicProfileScreen}
            name={ProfileStackRoutes.PUBLIC_PROFILE}
          />

          <ProfileStack.Screen
            options={{
              title: "Account Settings",
            }}
            name={ProfileStackRoutes.ACCOUNT_SETTING}
            component={AccountSettingScreen}
          />
          <ProfileStack.Screen
            options={{
              title: "Terms & Policy",
            }}
            name={ProfileStackRoutes.CONTACT}
            component={ContactUsScreen}
          />
          <ProfileStack.Screen
            options={{
              title: "Help & Support",
            }}
            name={ProfileStackRoutes.HELPANDSUPPORT}
            component={HelpAndSupportScreen}
          />

          <ProfileStack.Screen
            options={{
              title: "Purchase History",
            }}
            component={PurchasesScreen}
            name={ProfileStackRoutes.PURCHASES}
          />
        </React.Fragment>
      ) : (
        <ProfileStack.Screen
          options={{
            headerShown: false,
          }}
          name={ProfileStackRoutes.AUTH}
          component={AuthStackNavigator}
        />
      )}
    </ProfileStack.Navigator>
  );
};

export default ProfileStackNavigator;
