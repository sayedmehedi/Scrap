import {FlatList} from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import Header from '../../Component/Header';
import CustomStatusBar from '../../Component/CustomStatusBar';
import EachItem from './EachItem';

const data = [
  {
    id: 1,
    title: 'Product Title here',
    condition: 'New',
    Category: 'Vehicles-Sub Category',
    price: '$14.46',
    status: 'offerApproved',
  },
  {
    id: 2,
    title: 'Product Title here',
    condition: 'New',
    Category: 'Vehicles-Sub Category',
    price: '$14.46',
    status: 'BidWinner',
  },
  {
    id: 3,
    title: 'Product Title here',
    condition: 'New',
    Category: 'Vehicles-Sub Category',
    price: '$14.46',
    status: 'offersent',
  },
  {
    id: 4,
    title: 'Product Title here',
    condition: 'New',
    Category: 'Vehicles-Sub Category',
    price: '$14.46',
    status: 'BidPlaced',
  },
  {
    id: 5,
    title: 'Product Title here',
    condition: 'New',
    Category: 'Vehicles-Sub Category',
    price: '$14.46',
    status: 'outBid',
  },
];

const renderAllItems = ({item}) => <EachItem item={item} />;

const OfferAndBidScreen = () => {
  const isDarkMode = true;
  return (
    <>
      <FlatList
        data={data}
        renderItem={renderAllItems}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default OfferAndBidScreen;
