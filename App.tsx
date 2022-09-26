import "@src/appEngine";
import React from "react";
import {View} from "react-native";
import {Provider} from "react-redux";
import Notifier from "@src/Component/Notifier";
import Toast from "react-native-toast-message";
import SplashScreen from "react-native-splash-screen";
import {persistor, store} from "@store/configureStore";
import {enableLatestRenderer} from "react-native-maps";
import AuthProvider from "@src/Providers/AuthProvider";
import {useNetInfo} from "@react-native-community/netinfo";
import {ActivityIndicator, Text} from "react-native-paper";
import {PersistGate} from "redux-persist/integration/react";
import {useNavigationContainerRef} from "@react-navigation/native";
import RootStackNavigator from "./src/Navigator/RootStackNavigator";
import PreferencesProvider from "./src/Providers/PreferencesProvider";
import HttpClientConfigure from "@src/Providers/HttpClientConfigure";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {
  useFlipper,
  useReduxDevToolsExtension,
} from "@react-navigation/devtools";

enableLatestRenderer();

GoogleSignin.configure({
  webClientId:
    "384287635095-cn6g90q9h2v4mlnvpjdh1uo1qt716585.apps.googleusercontent.com",
});

const App = () => {
  const state = useNetInfo();
  const navigationRef = useNavigationContainerRef();
  const [hasInternet, setHasInternet] = React.useState<boolean | null>(false);

  useFlipper(navigationRef);
  useReduxDevToolsExtension(navigationRef);

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  React.useEffect(() => {
    if (!state.isConnected) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Check your internet connection",
      });
    }

    setHasInternet(state.isConnected);
  }, [state]);

  if (!hasInternet) {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text>No Internet</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
        loading={
          <View
            style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <ActivityIndicator size={"large"} />
          </View>
        }>
        <HttpClientConfigure>
          <AuthProvider>
            <PreferencesProvider>
              <RootStackNavigator />
              <Notifier />
              <Toast position={"bottom"} bottomOffset={90} />
            </PreferencesProvider>
          </AuthProvider>
        </HttpClientConfigure>
      </PersistGate>
    </Provider>
  );
};

export default App;
