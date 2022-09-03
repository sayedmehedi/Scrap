import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {View, Text, Image, Dimensions, Pressable} from 'react-native';

const {width} = Dimensions.get('window');
const itemWidth = width / 3;

const EachProductItem = ({item}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      key={item.id}
      style={{
        margin: 3,
      }}
      onPress={() => navigation.navigate('productDetails')}>
      <View
        style={{
          height: 130,
          width: itemWidth - 6,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        }}>
        <Image
          source={item.uri}
          style={{
            width: 110,
            height: 120,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal:5
        }}>
        <Text style={{fontSize: 10, fontFamily: 'Inter-Regular',color:'#023047'}}>
          {item.location}
        </Text>
        <Image source={require('../assets/Images/map1.png')}
        style={{height:8,width:6}}
        />
      </View>
      <Text style={{fontSize: 11, fontFamily: 'Inter-Bold',color:'#023047'}}>{item.name}</Text>
      <Text style={{fontSize: 11, fontFamily: 'Inter-Bold',color:'#023047'}}>{item.price}</Text>
    </Pressable>
  );
};

export default EachProductItem;
