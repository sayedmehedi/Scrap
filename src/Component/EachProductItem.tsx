import React from "react";
import truncate from "lodash.truncate";
import {RootStackRoutes} from "@constants/routes";
import {useNavigation} from "@react-navigation/native";
import {FilterProduct, RootStackParamList} from "@src/types";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {View, Text, Image, Dimensions, Pressable} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

const {width} = Dimensions.get("window");
const dimensionWidth = width;

const MARGIN_RIGHT = 10;
const BORDER_WIDTH = 6;

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const EachProductItem = ({
  item,
  widthDivisor = 3,
}: {
  item: (FilterProduct & {type: "data"}) | {id: number; type: "skeleton"};
  widthDivisor?: number
}) => {
  const navigation = useNavigation<NavigationProps>();

  const itemWidth = width/ widthDivisor

  if (item.type === "skeleton") {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={itemWidth - 6}>
          <SkeletonPlaceholder.Item width={110} height={120} />
          <SkeletonPlaceholder.Item width={50} height={4} marginTop={5} />
          <SkeletonPlaceholder.Item width={80} height={7} marginTop={5} />
          <SkeletonPlaceholder.Item width={30} height={7} marginTop={5} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }

  return (
    <Pressable
      style={{
        marginLeft: 0,
        // flexGrow: (1 / 3),
        marginRight: MARGIN_RIGHT,
        width: itemWidth - MARGIN_RIGHT - BORDER_WIDTH,
      }}
      onPress={() =>
        navigation.push(RootStackRoutes.PRODUCT_DETAILS, {
          productId: item.id,
        })
      }>
      <Image
        source={{uri: item.images.small}}
        style={{
          height: 130,
          width: "100%",
          overflow: "hidden",
          borderColor: "#FFFFFF",
          borderWidth: BORDER_WIDTH,
          borderRadius: BORDER_WIDTH,
        }}
      />

      <View
        style={{
          marginTop: 10,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <Text
          style={{fontSize: 12, fontFamily: "Inter-Regular", color: "#023047"}}>
          {truncate(item.location, {
            length: widthDivisor === 3 ? 15: 19,
          })}
        </Text>

        <View style={{flex:1}}/>
        
        {item.is_locale && (
          <Image
            resizeMode={"contain"}
            style={{height: 10, width: 10, marginRight: 5}}
            source={require("../assets/Images/map1.png")}
          />
        )}

        {item.is_shipping && (
          <Image
            resizeMode={"contain"}
            style={{height: 10, width: 10}}
            source={require("@assets/Images/van.png")}
          />
        )}
      </View>
      <Text
        numberOfLines={2}
        style={{
          fontSize: 13,
          fontFamily: "Inter-Bold",
          color: "#023047",
          marginBottom: 5,
          marginTop: 3,
        }}>
        {truncate(item.title, {
          length: 38,
        })}
      </Text>
      <Text  style={{fontSize: 13, fontFamily: "Inter-Bold", color: "#023047"}}>
        ${item.price}
      </Text>
    </Pressable>
  );
};

export default EachProductItem;
