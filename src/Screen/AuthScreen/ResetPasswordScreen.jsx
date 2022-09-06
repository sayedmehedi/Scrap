import React from 'react';
import {useTheme, Text} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import AppPrimaryButton from '../../Component/AppPrimaryButton';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PreferencesContext} from '../../Providers/PreferencesProvider';
import {AuthStackRoutes} from '../../constants/routes';
import {
  View,
  Image,
  Platform,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import {
  setGlobalStyles,
  FloatingLabelInput,
} from 'react-native-floating-label-input';

setGlobalStyles.containerStyles = {
  height: 58,
  borderRadius: 6,
  paddingHorizontal: 10,
  backgroundColor: '#fff',
};

setGlobalStyles.customLabelStyles = {
  fontSizeFocused: 12,
  fontSizeBlurred: 15,
  colorFocused: '#707070',
  colorBlurred: '#707070',
};

setGlobalStyles.labelStyles = {
  paddingTop: 5,
  paddingHorizontal: 5,
  fontFamily: 'Inter-Regular',
};

setGlobalStyles.inputStyles = {
  fontSize: 15,
  marginTop: 15,
  color: '#707070',
  fontWeight: '600',
};

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const {isThemeDark} = React.useContext(PreferencesContext);
  const [toggleNewPassword, setToggleNewPassword] = React.useState(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] =
    React.useState(false);

  const theme = useTheme();

  const {control} = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={{flex: 1, paddingHorizontal: 15}}>
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                paddingVertical: 10,
              }}>
              <Image
                style={{height: 100, width: 100}}
                source={require('../../assets/Images/logo.png')}
              />
            </View>

            <Text style={{fontSize: 22, fontWeight: 'bold'}}>
              Reset Password
            </Text>
          </View>

          <KeyboardAvoidingView
            style={{flexWrap: 'wrap', marginTop: 20}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{width: '100%', marginBottom: 16}}>
              <Controller
                control={control}
                name={'password'}
                render={({field}) => {
                  return (
                    <FloatingLabelInput
                      isPassword
                      label={'Password'}
                      value={field.value}
                      togglePassword={toggleNewPassword}
                      onChangeText={field.onChange}
                      rightComponent={
                        <Pressable
                          style={{
                            justifyContent: 'center',
                          }}
                          onPress={() =>
                            setToggleNewPassword(prevStae => !prevStae)
                          }>
                          <Entypo
                            size={20}
                            name={toggleNewPassword ? 'eye-with-line' : 'eye'}
                          />
                        </Pressable>
                      }
                    />
                  );
                }}
              />
            </View>

            <View style={{width: '100%'}}>
              <Controller
                control={control}
                name={'confirmPassword'}
                render={({field}) => {
                  return (
                    <FloatingLabelInput
                      isPassword
                      value={field.value}
                      label={'Confirm Password'}
                      onChangeText={field.onChange}
                      togglePassword={toggleConfirmPassword}
                      rightComponent={
                        <Pressable
                          style={{
                            justifyContent: 'center',
                          }}
                          onPress={() =>
                            setToggleConfirmPassword(prevStae => !prevStae)
                          }>
                          <Entypo
                            size={20}
                            name={
                              toggleConfirmPassword ? 'eye-with-line' : 'eye'
                            }
                          />
                        </Pressable>
                      }
                    />
                  );
                }}
              />
            </View>
          </KeyboardAvoidingView>

          <AppPrimaryButton
            onPress={() => navigation.navigate(AuthStackRoutes.LOCATION)}
            containerStyle={{
              marginTop: 40,
              alignSelf: 'center',
            }}
            text={'Reset'}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ResetPasswordScreen;
