import React from "react";
import {forFade} from "@utils/misc";
import {useTheme} from "react-native-paper";
import {ProfileStackParamList} from "@src/types";
import ProfileScreen from "../Screen/ProfileScreen";
import {ProfileStackRoutes} from "@constants/routes";
import {createStackNavigator} from "@react-navigation/stack";
import PurchasesScreen from "../Screen/ProfileScreen/PurchasesScreen";
import OfferAndBidScreen from "../Screen/ProfileScreen/OfferAndBidScreen";
import SaveProductScreen from "../Screen/ProfileScreen/SaveProductScreen";
import PublicProfileScreen from "../Screen/ProfileScreen/PublicProfileScreen";
import AccountSettingScreen from "../Screen/ProfileScreen/AccountSettingScreen";
import TransactionsScreen from "@src/Screen/ProfileScreen/TransactionListScreen";
import ContactUsScreen from "@src/Screen/ProfileScreen/ContactUsScreen";

const Profile = createStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  const theme = useTheme();

  return (
    <Profile.Navigator
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
      <Profile.Screen
        options={{
          title: "My Account",
        }}
        component={ProfileScreen}
        name={ProfileStackRoutes.PROFILE_SCREEN}
      />

      <Profile.Screen
        options={{
          title: "Transactions",
        }}
        component={TransactionsScreen}
        name={ProfileStackRoutes.TRANSACTION}
      />

      <Profile.Screen
        options={{
          title: "Offer & Bid",
        }}
        name={ProfileStackRoutes.OFFER_N_BID}
        component={OfferAndBidScreen}
      />

      <Profile.Screen
        options={{
          title: "Save Product",
        }}
        name={ProfileStackRoutes.SAVE_PRODUCT}
        component={SaveProductScreen}
      />

      <Profile.Screen
        options={{
          title: "Public Profile",
        }}
        component={PublicProfileScreen}
        name={ProfileStackRoutes.PUBLIC_PROFILE}
      />

      <Profile.Screen
        options={{
          title: "Account Settings",
        }}
        name={ProfileStackRoutes.ACCOUNT_SETTING}
        component={AccountSettingScreen}
      />
      <Profile.Screen
        options={{
          title: "Contact",
        }}
        name={ProfileStackRoutes.CONTACT}
        component={ContactUsScreen}
      />

      <Profile.Screen
        options={{
          title: "Purchase History",
        }}
        component={PurchasesScreen}
        name={ProfileStackRoutes.PURCHASES}
      />
    </Profile.Navigator>
  );
};

export default ProfileStack;
