import {View, Text} from 'react-native';
import React from 'react';
import CustomStatusBar from '../../Component/CustomStatusBar';
import Header from '../../Component/Header';
import Colors from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
const PaymentSuccess = () => {
  const isDarkMode = true;
  return (
    <>
      <CustomStatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.PRIMARY_COLOR}
      />
      <Header from="paymentSuccess" />

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Ionicons
          name="checkmark-circle-outline"
          size={150}
          color={'#51B764'}
        />
        <Text
          style={{fontFamily: 'Inter-Bold', fontSize: 30, color: '#023047'}}>
          Payment Successful!
        </Text>
      </View>
    </>
  );
};

export default PaymentSuccess;
