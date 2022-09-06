import React from 'react';
import {Image} from 'react-native-elements';
import {Controller, useForm} from 'react-hook-form';
import Entypo from 'react-native-vector-icons/Entypo';
import {PostItemStackRoutes} from '../constants/routes';
import {useNavigation} from '@react-navigation/native';
import SelectionModal from '../Component/SelectionModal';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AppPrimaryButton from '../Component/AppPrimaryButton';
import {HelperText, Text, Title, useTheme} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TextInput, View, Alert, ScrollView, Pressable} from 'react-native';

export default function ProductAddSuccessScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [modalType, setModalType] = React.useState('');

  const handleNextScreen = () => {
    navigation.navigate(PostItemStackRoutes.ADD_DELIVERY_METHOD);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image
        source={require('../assets/Images/success.png')}
        style={{height: 85, width: 85, marginBottom: 15}}
      />
      <Title style={{maxWidth: '50%', textAlign: 'center'}}>
        Product items successfully post!
      </Title>
    </View>
  );
}
