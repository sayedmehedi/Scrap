import "@src/appEngine";
import React from "react";
import {View} from "react-native";
import {Provider} from "react-redux";
import Navigator from "./src/Navigator";
import Notifier from "@src/Component/Notifier";
import Toast from "react-native-toast-message";
import {ActivityIndicator} from "react-native-paper";
import {persistor, store} from "@store/configureStore";
import {enableLatestRenderer} from "react-native-maps";
import SplashScreen from "react-native-splash-screen";
import {PersistGate} from "redux-persist/integration/react";
import PreferencesProvider from "./src/Providers/PreferencesProvider";

enableLatestRenderer();

const App = () => {
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
        <PreferencesProvider>
          <Navigator />
          <Notifier />
          <Toast />
        </PreferencesProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
