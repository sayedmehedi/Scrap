import React from 'react';
import {useTheme} from 'react-native-paper';
import {AuthContext} from '../Providers/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import LoginScreen from '../Screen/AuthScreen/LoginScreen';
import {createStackNavigator} from '@react-navigation/stack';
import LocationScreen from '../Screen/AuthScreen/LocationScreen';
import {AuthStackRoutes, RootStackRoutes} from '../Constant/routes';
import ChooseLocationScreen from '../Screen/AuthScreen/ChooseLocationScreen';
import RegistrationScreen from '../Screen/AuthScreen/RegistrationScreen';
import ForgotPasswordScreen from '../Screen/AuthScreen/ForgotPasswordScreen';
import ResetPasswordScreen from '../Screen/AuthScreen/ResetPasswordScreen';


const Auth = createStackNavigator();

const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const AuthStack = () => {
  const theme = useTheme();

  const navigation = useNavigation();
  const {isAuthenticated} = React.useContext(AuthContext);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate(RootStackRoutes.HOME);
    }
  }, [isAuthenticated, navigation]);

  return (
    <Auth.Navigator
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
      <Auth.Screen
        options={{
          title: 'Login',
        }}
        component={LoginScreen}
        name={AuthStackRoutes.LOGIN}
      />

      

      <Auth.Screen
        options={{
          title: 'Locations',
        }}
        component={LocationScreen}
        name={AuthStackRoutes.LOCATION}
      />

      <Auth.Screen
        options={{
          title: 'Back',
        }}
        component={ChooseLocationScreen}
        name={AuthStackRoutes.CHOOSE_LOCATION}
      />

      <Auth.Screen
        options={{
          title: 'Reset Password',
        }}
        component={ResetPasswordScreen}
        name={AuthStackRoutes.RESET_PASSWORD}
      />

      <Auth.Screen
        options={{
          title: 'Register',
        }}
        component={RegistrationScreen}
        name={AuthStackRoutes.REGISTRATION}
      />

      <Auth.Screen
        options={{
          title: 'Forgot Password',
        }}
        component={ForgotPasswordScreen}
        name={AuthStackRoutes.FORGOT_PASSWORD}
      />
    </Auth.Navigator>
  );
};

export default AuthStack;
