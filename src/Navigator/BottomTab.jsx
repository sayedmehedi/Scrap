import React from 'react';
import HomeStack from './HomeStack';
import Colors from '../Constant/Colors';
import ProfileStack from './ProfileStack';
import {useTheme} from 'react-native-paper';
import ChatStackNavigator from './ChatStackNavigator';
import SellingScreen from '../Screen/SellingScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PostItemStackNavigator from './PostItemStackNavigator';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  AuthStackRoutes,
  BottomTabRoutes,
  RootStackRoutes,
} from '../Constant/routes';
import {AuthContext} from '../Providers/AuthProvider';

const Tab = createBottomTabNavigator();

const buttonNativeFeedback = ({children, style, ...props}) => (
  <TouchableNativeFeedback
    {...props}
    background={TouchableNativeFeedback.Ripple('#F5DCE7', true)}>
    <View style={style}>{children}</View>
  </TouchableNativeFeedback>
);

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const BottomTab = () => {
  const theme = useTheme();
  const {isAuthenticated} = React.useContext(AuthContext);

  return (
    <Tab.Navigator
      screenListeners={({navigation, route}) => {
        console.log('navigating to route', route.name);

        return {
          tabPress(e) {
            if (route.name !== BottomTabRoutes.HOME && !isAuthenticated) {
              e.preventDefault();
              navigation.navigate(RootStackRoutes.AUTH, {
                screen: AuthStackRoutes.LOGIN,
              });
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
          fontFamily: 'Inter-Bold',
          color: theme.colors.white,
        },
        headerTintColor: theme.colors.white,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          elevation: 10,
          paddingBottom: 0,
          shadowRadius: 3.84,
          shadowOpacity: 0.2,
          backgroundColor: '#FFFFFF',
          shadowColor: Colors.PRIMARY_COLOR,
          shadowOffset: {
            width: 0,
            height: 5,
          },
        },

        tabBarHideOnKeyboard: true,
        tabBarButton: buttonNativeFeedback,
        cardStyleInterpolator: forFade,
      }}>
      <Tab.Screen
        component={HomeStack}
        name={BottomTabRoutes.HOME}
        options={{
          headerShown: false,
          // cardStyleInterpolator: forFade,
          tabBarIcon: ({focused}) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <Entypo
                name="home"
                size={22}
                color={focused ? Colors.PRIMARY_COLOR : 'gray'}
              />
              <Text
                style={{
                  color: focused ? Colors.PRIMARY_COLOR : 'gray',
                  fontSize: 10,
                  fontFamily: 'Inter-SemiBold',
                }}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={BottomTabRoutes.CHAT}
        component={ChatStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <AntDesign
                size={22}
                name="message1"
                color={focused ? Colors.PRIMARY_COLOR : 'gray'}
              />
              <Text
                style={{
                  color: focused ? Colors.PRIMARY_COLOR : 'gray',
                  fontSize: 10,
                  fontFamily: 'Inter-SemiBold',
                }}>
                Message
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={BottomTabRoutes.POST_ITEM}
        component={PostItemStackNavigator}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <View
              style={{
                flex: 1,
                width: 80,
                padding: 15,
                alignItems: 'center',
                borderTopLeftRadius: 35,
                borderTopRightRadius: 35,
                justifyContent: 'center',
                backgroundColor: Colors.PRIMARY_COLOR,
              }}>
              <FontAwesome5 name="edit" size={20} color={'white'} />
              <Text
                style={{
                  color: 'white',
                  fontSize: 10,
                  fontFamily: 'Inter-SemiBold',
                }}>
                Post Item
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        component={SellingScreen}
        name={BottomTabRoutes.SELLING}
        options={{
         
          
          title: 'Selling',
          // cardStyleInterpolator: forFade,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <Ionicons
                name="pricetag"
                size={22}
                color={focused ? Colors.PRIMARY_COLOR : 'gray'}
              />
              <Text
                style={{
                  color: focused ? Colors.PRIMARY_COLOR : 'gray',
                  fontSize: 10,
                  fontFamily: 'Inter-SemiBold',
                }}>
                Selling
              </Text>
            </View>
          ),
          headerRight: ()=> (
            <View style={{paddingRight:10}}>
              <MaterialIcons name='notifications-none' size={20} color={'white'}/>

            </View>
          )
        }}
      />

      <Tab.Screen
        name={BottomTabRoutes.PROFILE}
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
              <EvilIcons
                name="user"
                size={30}
                color={focused ? Colors.PRIMARY_COLOR : 'gray'}
              />
              <Text
                style={{
                  color: focused ? Colors.PRIMARY_COLOR : 'gray',
                  fontSize: 10,
                  fontFamily: 'Inter-SemiBold',
                }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
