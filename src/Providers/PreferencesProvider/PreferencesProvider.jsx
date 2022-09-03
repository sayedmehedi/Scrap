import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'react-native-elements';

import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {combinedDarkTheme, combinedDefaultTheme} from './theme';

const rnElementsTheme = {
  colors: {
    white: '#FFFFFF',
    black: '#000000',
    primary: '#E62B56',
    secondary: '#191F2B',
  },
};

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: false,
});

export default function PreferencesProvider(props) {
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  
  const theme = isThemeDark ? combinedDarkTheme : combinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <StatusBar backgroundColor={theme.colors.primary} />

      <SafeAreaProvider>
        <ThemeProvider
          theme={rnElementsTheme}
          useDark={ isThemeDark}>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              {props.children}
            </NavigationContainer>
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </PreferencesContext.Provider>
  );
}
