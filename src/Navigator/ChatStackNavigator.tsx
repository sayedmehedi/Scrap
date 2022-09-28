import React from "react";
import {View} from "react-native";
import {forFade} from "@utils/misc";
import {useAppSelector} from "@hooks/store";
import AuthStackNavigator from "./AuthStackNavigator";
import {defaultTabBarStyles} from "@constants/Colors";
import {createStackNavigator} from "@react-navigation/stack";
import {selectIsAuthenticated} from "@store/slices/authSlice";
import LocationStackNavigator from "./LocationStackNavigator";
import {ChatStackParamList, HomeTabParamList} from "@src/types";
import {ChatStackRoutes, RootStackRoutes} from "@constants/routes";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import ConversationListScreen from "@src/Screen/ConversationListScreen";
import SingleConversationScreen from "@src/Screen/SingleConversationScreen";

const ChatStack = createStackNavigator<ChatStackParamList>();

type Props = NativeStackScreenProps<HomeTabParamList>;

export default function ChatStackNavigator({navigation: tabNavigation}: Props) {
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
