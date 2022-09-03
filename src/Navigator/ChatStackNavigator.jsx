import React from 'react';
import { View } from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack';
import SingleConversationScreen from '../Screen/SingleConversationScreen';
import ConversationListScreen from '../Screen/ConversationListScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChatStack = createStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const ChatStackNavigator = () => {
  const theme = useTheme();

  return (
    <ChatStack.Navigator
      initialRouteName="conversations"
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
      <ChatStack.Screen
        options={{
          title: 'Messages',
          headerRight: function () {
            return (
              <View style={{marginRight:10}}>
                <MaterialIcons
                size={22}
                color={'white'}
                name="notifications-none"
              />
              </View>
            );
          },
        }}
        name="conversations"
        component={ConversationListScreen}
      />
    </ChatStack.Navigator>
  );
};

export default ChatStackNavigator;
