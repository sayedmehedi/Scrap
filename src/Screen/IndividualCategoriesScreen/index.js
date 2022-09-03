import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';
import React from 'react';
import CustomStatusBar from '../../Component/CustomStatusBar';
import Colors from '../../Constant/Colors';
import Header from '../../Component/Header';
import Feather from 'react-native-vector-icons/Feather';
const {width} = Dimensions.get('window');
const itemWidth = width / 3;

import EachProductItem from '../../Component/EachProductItem';
import {TouchableOpacity} from 'react-native-gesture-handler';
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
const IndividualCategoriesScreen = () => {
  const isDarkMode = true;
  return (
    <>
      <CustomStatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.PRIMARY_COLOR}
      />
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <Header from="individualCategory" />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.tabButton}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Inter-SemiBold',
                fontSize: 14,
              }}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, {backgroundColor: '#E6E6E6'}]}>
            <Text
              style={{
                color: '#191F2B',
                fontFamily: 'Inter-SemiBold',
                fontSize: 14,
              }}>
              Local PickUp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, {backgroundColor: '#E6E6E6'}]}>
            <Text
              style={{
                color: '#191F2B',
                fontFamily: 'Inter-SemiBold',
                fontSize: 14,
              }}>
              Shipping
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 15,
            alignSelf: 'center',
          }}>
          <Feather name="map-pin" size={18} color={'#111111'} />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 14,
              color: '#111111',
              marginLeft:10
            }}>
            New York, 30 Miles + Shipping
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

export default IndividualCategoriesScreen;

const styles = StyleSheet.create({
  tabButton: {
    height: 50,
    width: itemWidth,
    backgroundColor: '#191F2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
