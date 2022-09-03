import React from 'react';
import Navigator from './src/Navigator';
import SplashScreen from 'react-native-splash-screen';
import AuthProvider from './src/Providers/AuthProvider';
import PreferencesProvider from './src/Providers/PreferencesProvider';

const App = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AuthProvider>
      <PreferencesProvider>
        <Navigator />
      </PreferencesProvider>
    </AuthProvider>
  );
};

export default App;
