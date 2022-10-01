import React from "react";
import HomeStack from "./HomeStack";
import {useTheme} from "react-native-paper";
import {HomeTabParamList} from "@src/types";
import { ChatStackRoutes } from '@constants/routes'
import ChatStackNavigator from "./ChatStackNavigator";
import AntDesign from "react-native-vector-icons/AntDesign";
import SaleStackNavigator from "./SaleStackNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import ProfileStackNavigator from "./ProfileStackNavigator";
import PostItemStackNavigator from "./PostItemStackNavigator";
import Colors, {defaultTabBarStyles} from "../constants/Colors";
import {View, Text, TouchableNativeFeedback} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {HomeTabRoutes, RootStackRoutes} from "../constants/routes";
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";


const HomeTab = createBottomTabNavigator<HomeTabParamList>();

const buttonNativeFeedback: React.FC<BottomTabBarButtonProps> = ({
  children,
  style,
  ...props
}) => (
  <TouchableNativeFeedback
    {...props}
    background={TouchableNativeFeedback.Ripple("#F5DCE7", true)}>
    <View style={style}>{children}</View>
  </TouchableNativeFeedback>
);

const HomeTabNavigator = () => {
  const theme = useTheme();

  return (
    <HomeTab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-Bold",
          color: theme.colors.white,
        },
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: defaultTabBarStyles,
        tabBarButton: buttonNativeFeedback,
        headerTintColor: theme.colors.white,
      }}>
      <HomeTab.Screen
        component={HomeStack}
        name={HomeTabRoutes.HOME}
        listeners={({navigation}) => {
          return {
            tabPress(e) {
              e.preventDefault();
              navigation.navigate(HomeTabRoutes.HOME)
            }
          }
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}>
              <Ionicons
                size={22}
                name="ios-home-outline"
                color={focused ? Colors.PRIMARY_COLOR : "gray"}
              />
              <Text
                style={{
                  color: focused ? Colors.PRIMARY_COLOR : "gray",
                  fontSize: 10,
                  fontFamily: "Inter-SemiBold",
                }}>
                Home
              </Text>
            </View>
          ),
        }}
      />

      <HomeTab.Screen
        listeners={({navigation}) => {
          return {
            tabPress(e) {
              e.preventDefault();
              navigation.navigate(HomeTabRoutes.CHAT, {
                screen: ChatStackRoutes.CONVERSATION_LIST
              })
            }
          }
        }}
        name={HomeTabRoutes.CHAT}
        component={ChatStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}>
              <AntDesign
                size={22}
                name="message1"
                color={focused ? Colors.PRIMARY_COLOR : "gray"}
              />
              <Text
                style={{
                  color: focused ? Colors.PRIMARY_COLOR : "gray",
                  fontSize: 10,
                  fontFamily: "Inter-SemiBold",
                }}>
                Messages
              </Text>
            </View>
          ),
        }}
      />

      <HomeTab.Screen
        name={HomeTabRoutes.POST_ITEM}
        component={PostItemStackNavigator}
        listeners={({navigation}) => {
          return {
            tabPress(e) {
              e.preventDefault();
              navigation.navigate(HomeTabRoutes.POST_ITEM)
            }
          }
        }}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <View
              style={{
                flex: 1,
                width: 80,
                padding: 15,
                alignItems: "center",
                borderTopLeftRadius: 35,
                borderTopRightRadius: 35,
                justifyContent: "center",
                backgroundColor: Colors.PRIMARY_COLOR,
              }}>
              <AntDesign name="pluscircleo" size={22} color={"white"} />
              <Text
                style={{
                  color: "white",
                  fontSize: 10,
                  fontFamily: "Inter-SemiBold",
                }}>
                Post Item
              </Text>
            </View>
          ),
        }}
      />

      <HomeTab.Screen
        name={HomeTabRoutes.EDIT_ITEM}
        component={PostItemStackNavigator}
        options={{
          headerShown: false,
          tabBarButton: () => null,
        }}
      />

      <HomeTab.Screen
        listeners={({navigation}) => {
          return {
            tabPress(e) {
              e.preventDefault();
              navigation.navigate(HomeTabRoutes.SALE)
            }
          }
        }}
        name={HomeTabRoutes.SALE}
        component={SaleStackNavigator}
        options={() => {
          return {
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}>
                <Ionicons
                  size={25}
                  name="copy-outline"
                  color={focused ? Colors.PRIMARY_COLOR : "gray"}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: "Inter-SemiBold",
                    color: focused ? Colors.PRIMARY_COLOR : "gray",
                  }}>
                  Selling
                </Text>
              </View>
            ),
          };
        }}
      />

      <HomeTab.Screen
        listeners={({navigation}) => {
          return {
            tabPress(e) {
              e.preventDefault();
              navigation.navigate(HomeTabRoutes.PROFILE)
            }
          }
        }}
        name={HomeTabRoutes.PROFILE}
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: "center", justifyContent: "center", flex: 1}}>
              <SimpleLineIcons
                size={25}
                name="user"
                color={focused ? Colors.PRIMARY_COLOR : "gray"}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Inter-SemiBold",
                  color: focused ? Colors.PRIMARY_COLOR : "gray",
                }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </HomeTab.Navigator>
  );
};

export default HomeTabNavigator;
