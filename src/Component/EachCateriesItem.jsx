import React from 'react';
import {View, Text, Image, Pressable} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
const EachCateriesItem = ({item}) => {
  const navigation = useNavigation();
  return (
    <Pressable
    onPress={()=> navigation.navigate('individualCategories')}
      key={item.id}
      style={{
        margin: 1,
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: 80,
          width: 80,
          backgroundColor: '#FFFFFF',
          borderRadius: 40,

          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        {item.uri}
      </View>
      <Text style={{fontSize: 10, fontFamily: 'Inter-Bold', margin: 7}}>
        {item.name}
      </Text>
    </Pressable>
  );
};

export default EachCateriesItem;
