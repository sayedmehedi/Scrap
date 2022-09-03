import React from 'react';
import {useForm, Controller} from 'react-hook-form';
import {AuthStackRoutes} from '../../Constant/routes';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {Checkbox, useTheme, Text} from 'react-native-paper';
import AppPrimaryButton from '../../Component/AppPrimaryButton';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PreferencesContext} from '../../Providers/PreferencesProvider';
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

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {isThemeDark} = React.useContext(PreferencesContext);

  const theme = useTheme();

  const {control} = useForm({
    defaultValues: {
      email: '',
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
              Forgot Password
            </Text>

            <Text
              style={{
                fontSize: 14,
                marginTop: 10,
                marginBottom: 20,
                color: theme.colors.tertiary,
              }}>
              No worries, We'll send you reset your passward.
            </Text>
          </View>

          <KeyboardAvoidingView
            style={{flexWrap: 'wrap'}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{width: '100%', marginBottom: 16}}>
              <Controller
                control={control}
                name={'email'}
                render={({field}) => {
                  return (
                    <FloatingLabelInput
                      label={'Email'}
                      value={field.value}
                      keyboardType={'email-address'}
                      onChangeText={field.onChange}
                    />
                  );
                }}
              />
            </View>
          </KeyboardAvoidingView>

          <AppPrimaryButton
          onPress={()=>navigation.navigate(AuthStackRoutes.RESET_PASSWORD)}
            containerStyle={{
              alignSelf: 'center',
              marginTop: 40,
            }}
            text={'Submit'}
          />
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ForgotPasswordScreen;
