import { View, Text,FlatList } from 'react-native'
import React from 'react'
import CustomStatusBar from '../../../Component/CustomStatusBar'
import Header from '../../../Component/Header'
import Colors from '../../../Constant/Colors'
import EachPurchases from './EachPurchases'


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
const renderAllPurchases = ({item}) => <EachPurchases item={item} />;
const PurchasesScreen = () => {
    const isDarkMode = true
  return (
    <>
    

      <View>
      <FlatList
        data={data}
        renderItem={renderAllPurchases}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

        
      </View>
    </>
  )
}

export default PurchasesScreen