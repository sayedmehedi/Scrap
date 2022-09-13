import React from 'react';
import styles from '../styles';
import { Order } from '@src/types';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const EachPurchases = ({ item }: { item: Order & { type: "data" } }) => {
  return (
    <View
      key={item.id}
      style={{
        padding: 10,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#C7C7C7',
      }}>
      <View style={{ padding: 5 }}>
        <Image
          source={{ uri: item.product_image }}
          style={{ height: 50, width: 50, borderRadius: 8 }}
        />
      </View>

      <View style={{ padding: 5 }}>
        <Text
          style={{
            color: '#475467',
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
          }}>
          {item.product_title}
        </Text>
        <Text
          style={{ color: '#98A2B3', fontFamily: 'Inter-Regular', fontSize: 12 }}>
          Condition:{item.product_condition}
        </Text>
        <Text
          style={{ color: '#98A2B3', fontFamily: 'Inter-Regular', fontSize: 12 }}>
          {item.product_category}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: 'Inter-Medium',
              fontSize: 14,
              color: '#667085',
            }}>
            {item.price}
          </Text>

        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={[styles.offerButton, { backgroundColor: '#E62B56' }]}>
            <Text
              style={{
                fontSize: 12,
                color: 'white',
                fontFamily: 'Inter-Medium',
              }}>
              Pay Now
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
          >
            <Text
              style={{
                fontSize: 12,
                marginLeft: 8,
                color: '#667085',
                fontFamily: 'Inter-Medium',
                textDecorationLine: 'underline',
              }}>

              Leave Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default EachPurchases