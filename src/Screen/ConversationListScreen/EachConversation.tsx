import React from "react";
import truncate from "lodash.truncate";
import {Conversation} from "@src/types";
import {useNavigation} from "@react-navigation/native";
import {
  ChatStackRoutes,
  HomeTabRoutes,
  RootStackRoutes,
} from "../../constants/routes";
import {View, Text, Image, TouchableOpacity} from "react-native";

const EachConversation = ({item}: {item: Conversation}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(RootStackRoutes.HOME, {
          screen: HomeTabRoutes.CHAT,
          params: {
            screen: ChatStackRoutes.SINGLE_CONVERSATION,
            params: {
              userId: item.user_id,
              userName: item.user_name,
              userImage: item.user_image,
              productPrice: item.product.price,
              productImage: item.product.image,
              productId: item.product.product_id,
            },
          },
        });
      }}
      style={{
        height: 80,
        width: "100%",
        marginBottom: 1,
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 15,
        backgroundColor: "#F7F7F7",
        justifyContent: "space-between",
      }}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Image
          source={{uri: item.user_image}}
          style={{height: 50, width: 50, borderRadius: 25, marginRight: 20}}
        />

        <View>
          <Text
            style={{color: "#023047", fontFamily: "Inter-Bold", fontSize: 15}}>
            {item.user_name}
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: "#023047",
              fontFamily: "Inter-Regular",
            }}>
            {truncate(item.message.title)}
          </Text>

          <Text
            style={{
              fontSize: 10,
              color: "#E62B56",
              fontFamily: "Inter-Regular",
            }}>
            {item.date}
          </Text>
        </View>
      </View>

      <View>
        <Image
          source={{uri: item.product.image}}
          style={{height: 50, width: 50, borderRadius: 8}}
        />
        <Text>${item.product.price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default EachConversation;
