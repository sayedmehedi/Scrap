import React from 'react';
import useAppConfig from '@hooks/useAppConfig';
import { HomeStackRoutes, } from '@constants/routes'
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, Pressable } from 'react-native';
import { HomeCategory, HomeStackParamList } from '@src/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const IMAGE_CONTAINER_HEIGHT = 80
const IMAGE_CONTAINER_WIDTH = 80

type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const EachCateriesItem = ({ item }: { item: HomeCategory }) => {
  const appConfig = useAppConfig();
  const navigation = useNavigation<HomeStackNavigationProp>();

  return (
    <Pressable
      onPress={() => navigation.navigate(HomeStackRoutes.INDIVIDUAL_CATEGORIES, {
        categoryId: item.id
      })}
      style={{
        margin: 1,
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
      }}>

      <View
        style={{
          width: IMAGE_CONTAINER_WIDTH,
          height: IMAGE_CONTAINER_HEIGHT,
          borderRadius: 40,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <Image
          source={{ uri: `${appConfig.mediaBaseUrl}/${item.image}` }}
          style={{ width: IMAGE_CONTAINER_WIDTH * 0.35, height: IMAGE_CONTAINER_HEIGHT * 0.35 }}
        />
      </View>

      <Text style={{ fontSize: 10, fontFamily: 'Inter-Bold', margin: 7 }}>
        {item.title}
      </Text>
    </Pressable>
  );
};

export default EachCateriesItem;
