import React from "react";
import HomeStack from "./HomeStack";
import Colors from "../constants/Colors";
import ProfileStack from "./ProfileStack";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import {HomeTabParamList} from "@src/types";
import useAppSnackbar from "@hooks/useAppSnackbar";
import SellingScreen from "../Screen/SellingScreen";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import PostItemStackNavigator from "./PostItemStackNavigator";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {View, Text, TouchableNativeFeedback} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ConversationListScreen from "@src/Screen/ConversationListScreen";
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  HomeTabRoutes,
  AuthStackRoutes,
  RootStackRoutes,
} from "../constants/routes";

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

const BottomTab = () => {
  const theme = useTheme();
  const {enqueueInfoSnackbar} = useAppSnackbar();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const profileHasLocationData = useAppSelector(
    state =>
      !!state.auth.profile?.location &&
      !!state.auth.profile?.latitude &&
      !!state.auth.profile?.longitude,
  );

  return (
    <HomeTab.Navigator
      screenListeners={({navigation, route}) => {
        return {
          tabPress(e) {
            if (route.name !== HomeTabRoutes.HOME && !isAuthenticated) {
              e.preventDefault();
              navigation.replace(RootStackRoutes.AUTH, {
                screen: AuthStackRoutes.LOGIN,
                params: {
                  nextScreen: {
                    name: RootStackRoutes.HOME,
                    params: {
                      screen: route.name,
                      params: route.params,
                    },
                  },
                },
              });
            } else if (route.name === HomeTabRoutes.POST_ITEM) {
              if (isAuthenticated && !profileHasLocationData) {
                enqueueInfoSnackbar({
                  text1: "Please add your location info",
                });

                e.preventDefault();

                navigation.replace(RootStackRoutes.CHOOSE_LOCATION, {
                  params: {
                    nextScreen: {
                      name: route.name,
                      params: route.params,
                    },
                  },
                });
              }
            }
          },
        };
      }}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontFamily: "Inter-Bold",
          // @ts-ignore
          color: theme.colors.white,
        },
        tabBarShowLabel: false,
        // @ts-ignore
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
          // cardStyleInterpolator: forFade,
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
        component={ConversationListScreen}
        options={({navigation}) => ({
          title: "Messages",
          headerRight: () => (
            <View style={{paddingRight: 10}}>
              <MaterialIcons
                size={22}
                color={"white"}
                name="notifications-none"
                onPress={() => {
                  navigation.navigate(RootStackRoutes.NOTIFICATIONS);
                }}
              />
            </View>
          ),
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: "center", justifyContent: "center", flex: 1}}>
              <AntDesign
                size={22}
                name="message1"
                color={focused ? Colors.PRIMARY_COLOR : "gray"}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Inter-SemiBold",
                  color: focused ? Colors.PRIMARY_COLOR : "gray",
                }}>
                Message
              </Text>
            </View>
          ),
        })}
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
        component={SellingScreen}
        name={HomeTabRoutes.SELLING}
        options={({navigation}) => {
          return {
            title: "Selling",
            // cardStyleInterpolator: forFade,
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
            headerRight: () => (
              <View style={{paddingRight: 10}}>
                <MaterialIcons
                  color={"white"}
                  size={22}
                  name="notifications-none"
                  onPress={() => {
                    navigation.navigate(RootStackRoutes.NOTIFICATIONS);
                  }}
                />
              </View>
            ),
          };
        }}
      />

      <HomeTab.Screen
        component={ProfileStack}
        name={HomeTabRoutes.PROFILE}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: "center", justifyContent: "center", flex: 1}}>
              <EvilIcons
                name="user"
                size={30}
                color={focused ? Colors.PRIMARY_COLOR : "gray"}
              />
              <Text
                style={{
                  color: focused ? Colors.PRIMARY_COLOR : "gray",
                  fontSize: 10,
                  fontFamily: "Inter-SemiBold",
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

export default BottomTab;
