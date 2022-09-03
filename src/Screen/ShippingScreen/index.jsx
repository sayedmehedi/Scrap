import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import CustomStatusBar from '../../Component/CustomStatusBar';
import Colors from '../../Constant/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../Component/Header';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import EachProductItem from '../../Component/EachProductItem';
const productData = [
  {
    id: '1',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/test.png'),
  },
  {
    id: '2',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod2.png'),
  },
  {
    id: '3',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod3.png'),
  },
  {
    id: '4',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod4.png'),
  },
  {
    id: '5',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod5.png'),
  },
];

const renderAllProduct = ({item}) => <EachProductItem item={item} />;
const ShippingScreen = () => {
  const isDarkMode = true;
  return (
    <>
      <CustomStatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.PRIMARY_COLOR}
      />
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <Header from="shipping" />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 15,
            alignSelf: 'center',
          }}>
          <FontAwesome5 name="shuttle-van" size={18} color={'#111111'} />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 14,
              color: '#111111',
              marginLeft: 5,
            }}>
            Shipping
          </Text>
        </View>

        <FlatList
          data={productData}
          renderItem={renderAllProduct}
          keyExtractor={item => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default ShippingScreen;

const styles = StyleSheet.create({});
