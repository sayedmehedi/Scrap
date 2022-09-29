import React from "react";
import truncate from "lodash.truncate";
import {FilterProduct} from "@src/types";
import {
  HomeTabRoutes,
  PostItemStackRoutes,
  RootStackRoutes,
} from "@constants/routes";
import {useNavigation} from "@react-navigation/native";
import {ActivityIndicator, Colors} from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  useDeleteProductMutation,
  useLazyGetProductEditInfoQuery,
} from "@data/laravel/services/product";
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import useAppSnackbar from "@hooks/useAppSnackbar";

const {width} = Dimensions.get("window");
const itemWidth = width / 2;

const MARGIN_RIGHT = 20;
const BORDER_WIDTH = 6;

const SaleOrArchiveItem = ({
  item,
}: {
  item: (FilterProduct & {type: "data"}) | {id: number; type: "skeleton"};
}) => {
  const navigation = useNavigation();
  
  const {enqueueErrorSnackbar, enqueueSuccessSnackbar} = useAppSnackbar();
  const [deleteProduct, {isLoading: isDeletingProduct}] =
    useDeleteProductMutation();

  const [getProductDetailsForEditQuery, {isLoading: isGettingProductEditInfo}] =
    useLazyGetProductEditInfoQuery();

  if (item.type === "skeleton") {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          width={itemWidth - 6}
          paddingRight={MARGIN_RIGHT}
          paddingLeft={MARGIN_RIGHT}>
          <SkeletonPlaceholder.Item width={"100%"} height={120} />
          <SkeletonPlaceholder.Item width={50} height={4} marginTop={5} />
          <SkeletonPlaceholder.Item width={80} height={7} marginTop={5} />
          <SkeletonPlaceholder.Item width={30} height={7} marginTop={5} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }

  return (
    <View
      style={{
        position: "relative",
        marginRight: MARGIN_RIGHT,
        marginLeft: MARGIN_RIGHT / 2,
      }}>
      <View
        style={{
          top: 10,
          right: 5,
          zIndex: 1,
          position: "absolute",
          flexDirection: "row",
        }}>
        <TouchableOpacity
          disabled={isDeletingProduct || isGettingProductEditInfo}
          onPress={() => {
            getProductDetailsForEditQuery(item.id)
              .unwrap()
              .then(prodData => {
                navigation.navigate(RootStackRoutes.HOME, {
                  screen: HomeTabRoutes.EDIT_ITEM,
                  params: {
                    screen: PostItemStackRoutes.UPLOAD_PHOTO,
                    params: {
                      productEditInfo: prodData.item,
                    },
                  },
                });
              });
          }}
          style={{
            width: 30,
            height: 30,
            marginRight: 10,
            borderRadius: 50,
            alignItems: "center",
            backgroundColor: "black",
            justifyContent: "center",
            
          }}>
          <MaterialIcons size={16} name={"edit"} color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isDeletingProduct || isGettingProductEditInfo}
          onPress={() => {
            deleteProduct(item.id)
              .unwrap()
              .then(res => {
                if ("success" in res) {
                  enqueueSuccessSnackbar({
                    text1: "Success",
                    text2: res.success,
                  });
                }

                if ("error" in res) {
                  enqueueErrorSnackbar({
                    text1: "Error",
                    text2: res.error,
                  });
                }
              });
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            alignItems: "center",
            backgroundColor: "white",
            justifyContent: "center",
          }}>
          <MaterialIcons name="close" color={'#E62B56'} size={20} />
        </TouchableOpacity>
      </View>

      <Pressable
        style={{
          width: itemWidth - MARGIN_RIGHT - BORDER_WIDTH,
        }}
        onPress={() =>
          navigation.navigate(RootStackRoutes.PRODUCT_DETAILS, {
            productId: item.id,
          })
        }>
        <View
          style={{
            height: 130,
            width: "100%",
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
          }}>
          {(isDeletingProduct || isGettingProductEditInfo) && (
            <View
              style={{
                zIndex: 1,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [
                  {
                    translateX: -10,
                  },
                  {
                    translateY: -10,
                  },
                ],
              }}>
              <ActivityIndicator size={"small"} />
            </View>
          )}
          <Image
            source={{uri: item.images.small}}
            style={{
              height: 130,
              width: "100%",
            }}
          />
          <View
            style={{
              bottom: 0,
              padding: 5,
              width: "100%",
              position: "absolute",
              alignItems: "center",
              backgroundColor: "#191F2B",
            }}>
            <Text style={{fontSize: 10, color: "white"}}>
              {item.total_bids} Bids | {item.total_offers} Offers
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Text
            style={{
              fontSize: 11,
              color: "#023047",
              fontFamily: "Inter-Regular",
            }}>
            {truncate(item.location)}
          </Text>
          {item.is_locale && (
            <Image
              resizeMode={"contain"}
              style={{height: 10, width: 10}}
              source={require("@assets/Images/map1.png")}
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
          style={{fontSize: 11, fontFamily: "Inter-Bold", color: "#023047"}}>
          {truncate(item.title, {
            length: 20,
          })}
        </Text>
        <Text
          style={{fontSize: 11, fontFamily: "Inter-Bold", color: "#023047"}}>
          ${item.price}
        </Text>
      </Pressable>
    </View>
  );
};

export default SaleOrArchiveItem;
