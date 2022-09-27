import React from "react";
import {View} from "react-native";
import {forFade} from "@utils/misc";
import {useAppSelector} from "@hooks/store";
import {ChatStackParamList} from "@src/types";
import AuthStackNavigator from "./AuthStackNavigator";
import {createStackNavigator} from "@react-navigation/stack";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import LocationStackNavigator from "./LocationStackNavigator";
import {ChatStackRoutes, RootStackRoutes} from "@constants/routes";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ConversationListScreen from "@src/Screen/ConversationListScreen";
import SingleConversationScreen from "@src/Screen/SingleConversationScreen";

const ChatStack = createStackNavigator<ChatStackParamList>();

export default function ChatStackNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isFirstTimeLogin = useAppSelector(state => state.auth.firstTimeLogin);

  return (
    <ChatStack.Navigator>
      {isAuthenticated && isFirstTimeLogin ? (
        <ChatStack.Screen
          component={LocationStackNavigator}
          name={ChatStackRoutes.LOCATION}
        />
      ) : isAuthenticated ? (
        <React.Fragment>
          <ChatStack.Screen
            component={ConversationListScreen}
            name={ChatStackRoutes.CONVERSATION_LIST}
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
            })}
          />

          <ChatStack.Screen
            component={SingleConversationScreen}
            name={ChatStackRoutes.SINGLE_CONVERSATION}
            options={{
              headerShown: false,
              presentation: "modal",
              cardStyleInterpolator: forFade,
            }}
          />
        </React.Fragment>
      ) : (
        <ChatStack.Screen
          options={{
            headerShown: false,
          }}
          name={ChatStackRoutes.AUTH}
          component={AuthStackNavigator}
        />
      )}
    </ChatStack.Navigator>
  );
}
