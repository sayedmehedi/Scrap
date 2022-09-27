import React from "react";
import HomeStack from "./HomeStack";
import Colors from "../constants/Colors";
import {useTheme} from "react-native-paper";
import {HomeTabParamList} from "@src/types";
import ChatStackNavigator from "./ChatStackNavigator";
import Entypo from "react-native-vector-icons/Entypo";
import SaleStackNavigator from "./SaleStackNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import ProfileStackNavigator from "./ProfileStackNavigator";
import PostItemStackNavigator from "./PostItemStackNavigator";
import {HomeTabRoutes, RootStackRoutes} from "../constants/routes";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {View, Text, TouchableNativeFeedback} from "react-native";
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
        headerTintColor: theme.colors.white,
        tabBarStyle: {
          height: 70,
          elevation: 10,
          paddingBottom: 0,
          shadowRadius: 3.84,
          shadowOpacity: 0.2,
          backgroundColor: "#FFFFFF",
          shadowColor: Colors.PRIMARY_COLOR,
          shadowOffset: {
            width: 0,
            height: 5,
          },
        },
        tabBarHideOnKeyboard: true,
        tabBarButton: buttonNativeFeedback,
      }}>
      <HomeTab.Screen
        component={HomeStack}
        name={HomeTabRoutes.HOME}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}>
              <Entypo
                name="home"
                size={22}
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
        name={HomeTabRoutes.CHAT}
        component={ChatStackNavigator}
        options={{
          headerShown: false,
        }}
      />

      <HomeTab.Screen
        name={HomeTabRoutes.POST_ITEM}
        component={PostItemStackNavigator}
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
              <FontAwesome5 name="edit" size={20} color={"white"} />
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
              <FontAwesome5 name="edit" size={20} color={"white"} />
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
                  name="pricetag"
                  size={22}
                  color={focused ? Colors.PRIMARY_COLOR : "gray"}
                />
                <Text
                  style={{
                    color: focused ? Colors.PRIMARY_COLOR : "gray",
                    fontSize: 10,
                    fontFamily: "Inter-SemiBold",
                  }}>
                  Selling
                </Text>
              </View>
            ),
          };
        }}
      />

      <HomeTab.Screen
        name={HomeTabRoutes.PROFILE}
        component={ProfileStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: "center", justifyContent: "center", flex: 1}}>
              <EvilIcons
                size={30}
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
