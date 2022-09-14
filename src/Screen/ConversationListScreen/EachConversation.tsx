import React from 'react';
import { Conversation } from '@src/types';
import { useNavigation } from '@react-navigation/native';
import { RootStackRoutes } from '../../constants/routes';
import { View, Text, Image, TouchableOpacity } from 'react-native';


const EachConversation = ({ item }: { item: Conversation }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(RootStackRoutes.SINGLE_CONVERSATION, {
          conversationId: item.id,
          userName: item.user_name,
          userImage: item.user_image,
          userLocation: "",
          productPrice: item.product !== "" ? +item.product.price : 0,
          productImage: item.product !== "" ? item.product.image : "",
        })
      }
      style={{
        height: 80,
        width: '100%',
        marginBottom: 1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-between',
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: item.user_image }}
          style={{ height: 50, width: 50, borderRadius: 25, marginRight: 20 }}
        />

        <View>
          <Text
            style={{ color: '#023047', fontFamily: 'Inter-Bold', fontSize: 15 }}>
            {item.user_name}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: '#023047',
              fontFamily: 'Inter-Regular',
            }}>
            {item.message.title}
          </Text>

          <Text
            style={{
              fontSize: 10,
              color: '#E62B56',
              fontFamily: 'Inter-Regular',
            }}>
            {item.message.created_at}
          </Text>
        </View>
      </View>

      {item.product !== "" ? <View>
        <Image
          source={{ uri: item.product.image }}
          style={{ height: 50, width: 50, borderRadius: 8 }}
        />
        <Text>${item.product.price}</Text>
      </View> : null}

    </TouchableOpacity>
  );
};

export default EachConversation;
