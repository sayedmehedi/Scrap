import {View, Text, Image} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import styles from './styles';

const EachItem = ({item}) => {
  return (
    <View
      key={item.id}
      style={{
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        padding: 10,
        borderBottomColor: '#C7C7C7',
      }}>
      <View style={{padding: 5}}>
        <Image
          source={require('../../assets/Images/test.png')}
          style={{height: 50, width: 50, borderRadius: 8}}
        />
      </View>

      <View style={{padding: 5}}>
        <Text
          style={{
            color: '#475467',
            fontFamily: 'Inter-SemiBold',
            fontSize: 16,
          }}>
          {item.title}
        </Text>
        <Text
          style={{color: '#98A2B3', fontFamily: 'Inter-Regular', fontSize: 12}}>
          Condition:{item.condition}
        </Text>
        <Text
          style={{color: '#98A2B3', fontFamily: 'Inter-Regular', fontSize: 12}}>
          {item.Category}
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
          <Text
            style={{
              color: '#667085',
              fontFamily: 'Inter-Regular',
              fontSize: 12,
              marginLeft: 10,
            }}>
            2 Offers | 2d 10h
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity style={styles.offerButton}>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: 12,
                color: 'white',
              }}>
              Offer Approved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.offerButton,
              {backgroundColor: '#E62B56', marginLeft: 5},
            ]}>
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                fontSize: 12,
                color: 'white',
              }}>
              Pay Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EachItem;
