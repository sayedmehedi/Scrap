import React from 'react';
import { FilterProduct } from '@src/types';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, Dimensions, Pressable } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;

const EachProductItem = ({ item, }: { item: FilterProduct & { type: "data" } | { type: "skeleton" } }) => {
  const navigation = useNavigation();

  if (item.type === "skeleton") {
    return <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item width={itemWidth - 6}>
        <SkeletonPlaceholder.Item width={110} height={120} />
        <SkeletonPlaceholder.Item width={50} height={4} marginTop={5} />
        <SkeletonPlaceholder.Item width={80} height={7} marginTop={5} />
        <SkeletonPlaceholder.Item width={30} height={7} marginTop={5} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  }

  return (
    <Pressable
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
          source={{ uri: item.image }}
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
          paddingHorizontal: 5,
          justifyContent: 'space-between',
        }}>
        <Text style={{ fontSize: 10, fontFamily: 'Inter-Regular', color: '#023047' }}>
          {item.location}
        </Text>
        <Image source={require('../assets/Images/map1.png')}
          style={{ height: 8, width: 6 }}
        />
      </View>
      <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#023047' }}>{item.title}</Text>
      <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#023047' }}>{item.price}</Text>
    </Pressable>
  );
};

export default EachProductItem;
