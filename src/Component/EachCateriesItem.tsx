import React from "react";
import {HomeStackRoutes} from "@constants/routes";
import {useNavigation} from "@react-navigation/native";
import {View, Text, Image, Pressable} from "react-native";
import {HomeCategory, HomeStackParamList} from "@src/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const IMAGE_CONTAINER_WIDTH = 80;
const IMAGE_CONTAINER_HEIGHT = 80;

type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const EachCateriesItem = ({item}: {item: HomeCategory}) => {
  const navigation = useNavigation<HomeStackNavigationProp>();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate(HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA, {
          categoryId: item.id,
          screenTitle: item.title,
        })
      }
      style={{
        width: 90,
        justifyContent: "center",
        alignItems:'center'
      }}>
      <View
        style={{
          width: IMAGE_CONTAINER_WIDTH,
          height: IMAGE_CONTAINER_HEIGHT,

          borderRadius: 40,
          shadowColor: "#000",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        <Image
          resizeMode={"center"}
          source={{uri: item.image}}
          style={{width: 35, height: 35}}
        />
      </View>

      <Text
        style={{
          margin: 7,
          fontSize: 11,
          textAlign: "center",
          fontFamily: "Inter-Bold",
        }}>
        {item.title}
      </Text>
    </Pressable>
  );
};

export default EachCateriesItem;
