import "@src/appEngine";
import React from "react";
import {View} from "react-native";
import {Provider} from "react-redux";
import RootStackNavigator from "./src/Navigator";
import Notifier from "@src/Component/Notifier";
import Toast from "react-native-toast-message";
import {ActivityIndicator} from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import {persistor, store} from "@store/configureStore";
import {enableLatestRenderer} from "react-native-maps";
import AuthProvider from "@src/Providers/AuthProvider";
import {PersistGate} from "redux-persist/integration/react";
import {useNavigationContainerRef} from "@react-navigation/native";
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
    "1098035251669-j4gopt4e5ce00kc8jd16hh3ua6mlg75h.apps.googleusercontent.com",
});

const App = () => {
  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);
  useReduxDevToolsExtension(navigationRef);

  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

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
