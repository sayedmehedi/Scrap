import React from 'react';
import styles from './styles';
import { Text } from 'react-native-paper';
import { FilterProduct } from '@src/types';
import UserOfferNBids from './UserOfferNBids';
import SellerProducts from './SellerProducts';
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView, } from 'react-native-safe-area-context';
import SellerOfferNBids from './SellerOfferNBids';

const OfferAndBidScreen = () => {
  const [resourceType, setResourceType] = React.useState<"user" | "seller">("user");
  const [sellerProduct, setSellerProduct] = React.useState<FilterProduct | null>(null)


  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => setResourceType("user")}
            style={[
              styles.tabButton,
              { backgroundColor: resourceType === "user" ? '#191F2B' : '#E6E6E6' },
            ]}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter-SemiBold',
                color: resourceType === "user" ? 'white' : '#191F2B',
              }}>
              User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setResourceType("seller")}
            style={[
              styles.tabButton,
              { backgroundColor: resourceType === "seller" ? '#191F2B' : '#E6E6E6' },
            ]}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter-SemiBold',
                color: resourceType === "seller" ? 'white' : '#191F2B',
              }}>
              Seller
            </Text>
          </TouchableOpacity>
        </View>


        {resourceType === "user" && (
          <React.Fragment>
            <UserOfferNBids />
          </React.Fragment>
        )}

        {resourceType === "seller" && (
          <View style={{ marginTop: 20 }}>
            {sellerProduct === null
              ?
              <SellerProducts onSelect={prod => {
                setSellerProduct(prod)
              }} />
              :
              <SellerOfferNBids product={sellerProduct} onBackPressed={() => setSellerProduct(null)} />}
          </View>
        )}
      </SafeAreaView>
    </>
  )
};

export default OfferAndBidScreen;
