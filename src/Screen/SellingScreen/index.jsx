import styles from './styles';
import React, {useState} from 'react';
import Colors from '../../constants/Colors';
import {HomeTabRoutes} from '../../constants/routes';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';

const SellingScreen = () => {
  const navigation = useNavigation();
  const [check, setCheck] = useState(true);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        {check ? (
          <>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setCheck(true)}
                style={[
                  styles.tabButton,
                  {backgroundColor: check ? '#191F2B' : '#E6E6E6'},
                ]}>
                <Text
                  style={{
                    color: check ? 'white' : '#191F2B',
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 14,
                  }}>
                  Sale
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCheck(false)}
                style={[
                  styles.tabButton,
                  {backgroundColor: !check ? '#191F2B' : '#E6E6E6'},
                ]}>
                <Text
                  style={{
                    color: !check ? 'white' : '#191F2B',
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 14,
                  }}>
                  Archived
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.postItemButton}
              onPress={() => navigation.navigate(HomeTabRoutes.POST_ITEM)}>
              <View></View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 16,
                  color: Colors.PRIMARY_COLOR,
                }}>
                Post New Product
              </Text>

              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_COLOR,
                }}>
                <Feather name="edit" color={Colors.PRIMARY_COLOR} size={20} />
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setCheck(true)}
                style={[
                  styles.tabButton,
                  {backgroundColor: check ? '#191F2B' : '#E6E6E6'},
                ]}>
                <Text
                  style={{
                    color: check ? 'white' : '#191F2B',
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 14,
                  }}>
                  Sale
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCheck(false)}
                style={[
                  styles.tabButton,
                  {backgroundColor: !check ? '#191F2B' : '#E6E6E6'},
                ]}>
                <Text
                  style={{
                    color: !check ? 'white' : '#191F2B',
                    fontFamily: 'Inter-SemiBold',
                    fontSize: 14,
                  }}>
                  Archived
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default SellingScreen;
