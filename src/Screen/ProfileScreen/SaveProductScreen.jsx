import {FlatList} from 'react-native';
import React from 'react';

import Colors from '../../Constant/Colors';
import Header from '../../Component/Header';
import CustomStatusBar from '../../Component/CustomStatusBar';
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

const SaveProductScreen = () => {
  const isDarkMode = true;
  return (
    <>
      <FlatList
        data={productData}
        renderItem={renderAllProduct}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default SaveProductScreen;
