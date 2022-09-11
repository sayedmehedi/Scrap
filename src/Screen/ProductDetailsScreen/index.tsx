import React from "react";
import dayjs from "dayjs";
import styles from "./styles";
import Share from 'react-native-share'
import Colors from "../../constants/Colors";
import { useTimer } from "react-timer-hook";
import { Rating } from "react-native-elements";
import { RootStackParamList } from "@src/types";
import useAppConfig from "@hooks/useAppConfig";
import useAppSnackbar from "@hooks/useAppSnackbar";
import Feather from "react-native-vector-icons/Feather";
import { RootStackRoutes } from "../../constants/routes";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import EachProductItem from "../../Component/EachProductItem";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { useCreateCartMutation } from "@data/laravel/services/order";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { useGetProductDetailsQuery, useToggleProductFavoriteMutation } from "@data/laravel/services/product";
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.PRODUCT_DETAILS
>;


const metalsTableHeadData = ["Metal", "Current Price", "Changes"]


const ProductDetailsScreen = ({ route, navigation }: Props) => {
  const theme = useTheme();
  const config = useAppConfig()
  const [image, setImage] = React.useState("");
  const { enqueueSuccessSnackbar } = useAppSnackbar()
  const [expiryTimestamp,] = React.useState(() => dayjs().toDate())

  const { days, hours, minutes, seconds, restart } = useTimer({
    expiryTimestamp,
  })

  const { data: productDetails, isLoading } = useGetProductDetailsQuery({
    id: route.params.productId,
  });

  const [createCart, { isLoading: isCreatingCart }] = useCreateCartMutation()
  const [toggleFavorite,] = useToggleProductFavoriteMutation()

  React.useEffect(() => {
    if (!isLoading && productDetails) {
      const handleProductShare = async () => {
        try {
          const shareResponse = await Share.open({
            title: 'Share via',
            message: `${productDetails.title}\n`,
            url: `${config.mediaBaseUrl}/product/${productDetails.id}/rolex-watch`,
          });

          console.log("shareResponse", shareResponse)
        } catch (error) {
          console.log("error", error)
        }
      }

      navigation.setOptions({
        title: productDetails?.title ?? "",
        headerRight: () => {
          return (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={handleProductShare}>
                <AntDesign name="sharealt" size={20} color={"white"} />
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 10 }}>
                <TouchableOpacity onPress={() => {
                  toggleFavorite({
                    id: productDetails.id,
                  })
                }}>
                  <AntDesign name={productDetails.is_favourite ? "heart" : "hearto"} size={20} color={"white"} />
                </TouchableOpacity>
              </View>
            </View>
          );
        },
      });
    }
  }, [navigation, isLoading, productDetails, toggleFavorite]);

  React.useEffect(() => {
    if (productDetails && productDetails.images.length !== 0) {
      setImage(productDetails.images[0]);
    }
  }, [productDetails]);

  const relatedProducts = React.useMemo(() => {
    if (isLoading) {
      return new Array(5).fill(0).map((_, id) => ({
        id,
        type: "skeleton" as const,
      }));
    }

    return (
      productDetails?.related_products.data.map(product => ({
        type: "data" as const,
        ...product,
      })) ?? []
    );
  }, [productDetails, isLoading]);

  React.useEffect(() => {
    if (productDetails) {
      const [days, hours, mins, seconds] = productDetails.time_left.split(" ").filter((segment) => segment.match(/\d+/)) as [string, string, string, string]

      let newExpiryDate = dayjs();

      if (!!days) {
        newExpiryDate = newExpiryDate.add(+days, "days")
      }

      if (!!hours) {
        newExpiryDate = newExpiryDate.add(+hours, "h")
      }

      if (!!mins) {
        newExpiryDate = newExpiryDate.add(+mins, "m")
      }

      if (!!seconds) {
        newExpiryDate = newExpiryDate.add(+seconds, "s")
      }

      restart(newExpiryDate.toDate())
    }

  }, [productDetails,])

  const handlePlaceBid = () => {
    if (productDetails) {
      navigation.navigate(RootStackRoutes.PLACE_BID, {
        productId: productDetails.id,
        productName: productDetails.title,
        totalBids: productDetails.total_bids,
        timeLeftToBid: productDetails.time_left,
        productImage: productDetails.images[0] ?? undefined,
        bidStartingPrice: !!productDetails.starting_price ? +productDetails.starting_price : 0,
      });
    }
  };

  const handleMakeOffer = () => {
    if (productDetails) {
      navigation.navigate(RootStackRoutes.MAKE_OFFER, {
        productId: productDetails.id,
        productName: productDetails.title,
        totalOffers: productDetails.total_offers,
        shippingCost: +productDetails.shipping_cost,
        productImage: productDetails.images[0] ?? undefined,
        buyPrice: !!productDetails.buy_price ? +productDetails.buy_price : 0,
      });
    }

  };

  const handleBuyProduct = () => {
    if (productDetails && !!productDetails.buy_price) {
      createCart({
        product_id: route.params.productId,
      })
        .unwrap()
        .then(res => {
          enqueueSuccessSnackbar({
            text1: res.success
          })

          handlePayment();
        })
    }
  }

  const handlePayment = () => {
    if (productDetails) {
      navigation.navigate(RootStackRoutes.CONFIRM_PURCHASE, {
        productImage: image,
        productId: productDetails.id,
        productName: productDetails.title,
        productBuyNowPrice: +productDetails.buy_price,
      });
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (!productDetails) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F7F7F7",
          alignContent: "center",
          justifyContent: "center",
        }}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const metalsChangesCell = (data: [number, number], index: number) => (
    <View style={{ flexDirection: "row", flex: 1 }}>
      <Text style={{
        textAlign: "center", margin: 6, fontWeight: "700",
        // @ts-ignore
        color: data[0] <= data[1] ? theme.colors.error : theme.colors.success
      }}>{data[0]}</Text>
      <Text style={{
        textAlign: "center", margin: 6,
        color: '#252522'
      }}>{data[1]}</Text>
    </View>
  );

  // Bid scenarios: Bid placed, highest bidder, bid out, bid won
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <ScrollView>
          {productDetails.has_bid &&
            <View>
              {/* Scenario: when won the bid show the congratulations text part
                Else show highest bidder text or bid out text or bid placed text */}
              {typeof productDetails.bid === "object" && productDetails.bid.is_winner ? (
                <React.Fragment>
                  <Text style={{
                    textAlign: "center", fontSize: 18, fontWeight: "600", marginTop: 20,
                    // @ts-ignore
                    color: theme.colors.success
                  }}>
                    Congratulations!!
                  </Text>

                  <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600", marginTop: 10 }}>
                    You have won this action,
                  </Text>

                  <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600", marginTop: 5 }}>
                    please pay now!
                  </Text>
                </React.Fragment>
              ) : <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600", marginTop: 20 }}>
                {productDetails.highest_bidder ? 'You’re the highest bidder!' : productDetails.bid_out ? "You have been Out Bid!" : "Your bid is placed"}
              </Text>}


              <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "700", marginVertical: 5 }}>
                ${typeof productDetails.bid === "object" && productDetails.bid.price}
              </Text>

              <Text style={{ textAlign: "center", fontSize: 13 }}>
                {productDetails.total_bids} bids
              </Text>

              {productDetails.highest_bidder && <Text style={{ textAlign: "center", fontSize: 14, marginTop: 5 }}>Your max bid: ${typeof productDetails.bid === "object" && productDetails.bid.price}</Text>}
              <Text style={{ textAlign: "center", fontSize: 14, marginTop: 5 }}>Time Left: {productDetails.time_left}</Text>

              <View style={{ marginVertical: 30 }}>
                {(productDetails.bid_out || !productDetails.highest_bidder) && <AppPrimaryButton
                  text={"Increase max bid"}
                  containerStyle={{
                    borderWidth: 1,
                    backgroundColor: "transparent",
                  }}
                  textStyle={{
                    color: theme.colors.accent,
                  }}
                  iconContainerStyle={{
                    borderWidth: 1,
                    backgroundColor: "transparent",
                  }}
                  iconProps={{
                    color: theme.colors.accent
                  }}
                  onPress={handlePlaceBid}
                />}

                {typeof productDetails.bid === "object" && productDetails.bid.is_winner && <React.Fragment>
                  <AppPrimaryButton
                    onPress={handlePayment}
                    text={"Pay now"}
                  />

                  <Button
                    onPress={() => navigation.navigate(RootStackRoutes.ASK_QUESTION)}
                    color={theme.colors.accent} style={{ marginTop: 10 }} labelStyle={{
                      textTransform: "capitalize",
                      textDecorationLine: 'underline',
                    }}>Ask Question</Button>

                  <Button color={theme.colors.accent} style={{ marginTop: 10 }} labelStyle={{
                    textTransform: "capitalize",
                    textDecorationLine: 'underline',
                  }}>Leave Feedback</Button>
                </React.Fragment>}
              </View>
            </View>
          }


          {productDetails.has_offer &&
            <View>
              {/* Scenario: When offer approved show text for that
                Else show offer placed text */}
              {typeof productDetails.offer === "object" && productDetails.offer.is_winner ? (
                <React.Fragment>
                  <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600", marginTop: 20 }}>
                    You’ve agreed to purchase this item,
                  </Text>

                  <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600", marginTop: 5 }}>
                    so make your payment right away.
                  </Text>
                </React.Fragment>
              ) : (
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600", marginTop: 20 }}>
                  Your offer has been sent!
                </Text>
              )}


              <Text style={{ textAlign: "center", fontSize: 30, fontWeight: "700", marginVertical: 5 }}>
                ${typeof productDetails.offer === "object" && productDetails.offer.price}
              </Text>

              <Text style={{ textAlign: "center", fontSize: 13 }}>
                {productDetails.total_offers} offers
              </Text>

              {productDetails.has_offer && <Text style={{ textAlign: "center", fontSize: 14, marginTop: 5 }}>Your max bid: ${typeof productDetails.offer === "object" && productDetails.offer.price}</Text>}
              <Text style={{ textAlign: "center", fontSize: 14, marginTop: 5 }}>Offer Expire: {productDetails.time_left}</Text>

              <View style={{ marginVertical: 30 }}>
                {typeof productDetails.offer === "object" && productDetails.offer.is_winner && <React.Fragment>
                  <AppPrimaryButton
                    text={"Pay now"}
                    onPress={handlePayment}
                  />

                  <Button
                    onPress={() => navigation.navigate(RootStackRoutes.ASK_QUESTION)}
                    color={theme.colors.accent} style={{ marginTop: 10 }} labelStyle={{
                      textTransform: "capitalize",
                      textDecorationLine: 'underline',
                    }}>Ask Question</Button>

                  <Button color={theme.colors.accent} style={{ marginTop: 10 }} labelStyle={{
                    textTransform: "capitalize",
                    textDecorationLine: 'underline',
                  }}>Leave Feedback</Button>
                </React.Fragment>}
              </View>
            </View>
          }

          {!!image && (
            <Image
              source={{
                uri: image,
              }}
              style={{
                height: 240,
                width: "100%",
              }}
            />
          )}

          <View style={{ padding: 10 }}>
            <FlatList
              data={productDetails?.images ?? []}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={() => setImage(item)} key={index}>
                    <Image
                      source={{ uri: item }}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        marginHorizontal: 8,
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
            />
          </View>

          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontSize: 25,
                color: "#252522",
                fontFamily: "Inter-SemiBold",
              }}>
              {productDetails.title}
            </Text>

            <View style={{ flexDirection: "row" }}>
              {productDetails.is_shipping && <View
                style={{
                  marginBottom: 15,
                  alignItems: "center",
                  flexDirection: "row",
                }}>
                <MaterialIcons name="local-shipping" size={14} color={"#191F2B"} style={{ marginRight: 5 }} />
                <Text style={{ fontFamily: "Inter-Regular", color: "#667085", marginRight: 5 }}>
                  Shipping
                </Text>
              </View>}

              <View
                style={{
                  marginBottom: 15,
                  alignItems: "center",
                  flexDirection: "row",
                }}>
                <Feather name="map-pin" size={14} color={"#191F2B"} />
                <Text style={{ fontFamily: "Inter-Regular", color: "#667085" }}>
                  {productDetails.location}: {productDetails.distance}
                </Text>
              </View>
            </View>

            {!!productDetails.starting_price && <View style={{ marginVertical: 10 }}>
              <Text
                style={{
                  fontSize: 25,
                  color: "#252522",
                  fontFamily: "Inter-SemiBold",
                }}>
                ${productDetails.starting_price}
              </Text>
              <View
                style={{
                  paddingBottom: 10,
                  marginVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#CBCBCB",
                }}>
                <Text style={{ fontFamily: "Inter-Regular", color: "#667085" }}>
                  Starting Price | {productDetails.total_bids} bids | {productDetails.time_left}
                </Text>
              </View>
            </View>}

            {!!productDetails.buy_price && <View style={{ marginVertical: 5 }}>
              <Text
                style={{
                  fontSize: 25,
                  color: "#252522",
                  fontFamily: "Inter-SemiBold",
                }}>
                ${productDetails.buy_price}
              </Text>
              <View
                style={{
                  paddingBottom: 10,
                  marginVertical: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: "#CBCBCB",
                }}>
                <Text style={{ fontFamily: "Inter-Regular", color: "#667085" }}>
                  Buy It Now Price
                </Text>
              </View>
            </View>}
            <View
              style={{
                marginBottom: 10,
                paddingVertical: 5,
                alignItems: "center",
                borderBottomWidth: 1,
                flexDirection: "row",
                borderBottomColor: "#CBCBCB",
              }}>
              <Text style={{ fontFamily: "Inter-Regular", color: "#667085" }}>
                Time Left:
              </Text>
              <View style={{ alignItems: "center", margin: 5 }}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#023047",
                      fontFamily: "Inter-Medium",
                    }}>
                    {days}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#023047",
                    fontFamily: "Inter-Regular",
                  }}>
                  Days
                </Text>
              </View>
              <Text>:</Text>

              <View style={{ alignItems: "center", margin: 5 }}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#023047",
                      fontFamily: "Inter-Medium",
                    }}>
                    {hours}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#023047",
                    fontFamily: "Inter-Regular",
                  }}>
                  Hours
                </Text>
              </View>
              <Text>:</Text>

              <View style={{ alignItems: "center", margin: 5 }}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#023047",
                      fontFamily: "Inter-Medium",
                    }}>
                    {minutes}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#023047",
                    fontFamily: "Inter-Regular",
                  }}>
                  Minutes
                </Text>
              </View>
              <Text>:</Text>

              <View style={{ alignItems: "center", margin: 5 }}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      color: "#023047",
                      fontSize: 16,
                      fontFamily: "Inter-Medium",
                    }}>
                    {seconds}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#023047",
                    fontFamily: "Inter-Regular",
                  }}>
                  Seconds
                </Text>
              </View>
            </View>

            {/* if product has a starting price and the user did not place bid before then show the place bid button */}
            {!!productDetails.starting_price && !productDetails.has_bid && <TouchableOpacity
              onPress={handlePlaceBid}
              style={styles.placeBidButton}
            >
              <View></View>
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontFamily: "Inter-Regular",
                }}>
                Place Bid
              </Text>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.1)",
                }}>
                <Octicons name="arrow-right" color={"white"} size={26} />
              </View>
            </TouchableOpacity>}

            {/* if the user did not make offer before then show the make offer button */}
            {!productDetails.has_offer && <TouchableOpacity
              onPress={handleMakeOffer}
              style={[styles.makeofferButton, { marginVertical: 10 }]}
            >
              <View></View>
              <Text
                style={{
                  fontSize: 16,
                  color: "#023047",
                  fontFamily: "Inter-Regular",
                }}>
                Make Offer
              </Text>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 50,
                  alignItems: "center",
                  borderColor: "#023047",
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                }}>
                <Octicons name="arrow-right" color={"#023047"} size={26} />
              </View>
            </TouchableOpacity>}

            {!!productDetails.buy_price && <TouchableOpacity
              disabled={isCreatingCart}
              onPress={handleBuyProduct}
              style={styles.makeofferButton}
            >
              <View></View>
              <Text
                style={{
                  fontSize: 16,
                  color: "#023047",
                  fontFamily: "Inter-Regular",
                }}>
                Buy It Now
              </Text>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderWidth: 1,
                  borderRadius: 50,
                  alignItems: "center",
                  borderColor: "#023047",
                  justifyContent: "center",
                  backgroundColor: "#FFFFFF",
                }}>
                <Octicons name="arrow-right" color={"#023047"} size={26} />
              </View>
            </TouchableOpacity>}

            {/* metals */}
            <View style={{ marginTop: 30 }}>
              <Text style={{ fontWeight: "600", marginBottom: 30 }}>Current/Live Metals Price</Text>

              <Table>
                <Row data={metalsTableHeadData} textStyle={{ margin: 6, color: '#252522', textAlign: "center" }} style={{ borderWidth: 1, height: 40, backgroundColor: "#EFEFEF", borderColor: "#D0D0D0" }} />
                {
                  ([
                    ['Copper', '$13.40', [-2.33, -2.33] as [number, number]],
                    ['Aluminium', '$27.22', [4.20, +3.00] as [number, number]],
                  ]).map((rowData, index) => (
                    <TableWrapper key={index} style={{ flexDirection: "row", borderWidth: 1, borderTopWidth: 0, borderColor: "#D1D1D1", }}>
                      {
                        rowData.map((cellData, cellIndex) => (
                          <Cell key={cellIndex} data={Array.isArray(cellData) ? metalsChangesCell(cellData, index) : cellData} textStyle={{ margin: 6, color: '#252522', textAlign: "center" }} />
                        ))
                      }
                    </TableWrapper>
                  ))
                }
                {/* <Rows textStyle={{ margin: 6, color: '#252522' }} style={{ borderWidth: 1, borderTopWidth: 0, borderColor: "#D1D1D1" }} data={} /> */}
              </Table>
            </View>

            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
                color: "#252522",
                fontFamily: "Inter-SemiBold",
              }}>
              About this product
            </Text>

            <View
              style={{
                height: 1,
                width: "100%",
                marginBottom: 10,
                marginVertical: 5,
                backgroundColor: "#002642",
              }}>
              <View
                style={{
                  height: 1,
                  width: "20%",
                  backgroundColor: Colors.PRIMARY_COLOR,
                }}
              />
            </View>

            <Text>Condition: {productDetails.condition}</Text>
            <Text>
              Category: {productDetails.category}
            </Text>

            {!Array.isArray(productDetails.attributes) && Object.entries(productDetails.attributes).map(([attr, val]) => (
              <Text key={attr}>`${attr}: ${val}`</Text>
            ))}

            <View
              style={{
                marginVertical: 28,
                alignItems: "center",
                flexDirection: "row",
              }}>
              <Image
                source={{ uri: productDetails.seller.image }}
                style={{ height: 75, width: 75, borderRadius: 40 }}
              />
              <View style={{ marginLeft: 10 }}>
                <Text>{productDetails.seller.name}</Text>

                <View
                  style={{
                    marginVertical: 10,
                    alignItems: "center",
                    flexDirection: "row",
                  }}>
                  <Rating
                    lock={true}
                    imageSize={15}
                    readonly={true}
                    showRating={false}
                    startingValue={productDetails.seller.rating}
                  />
                  <Text>({productDetails.seller.rating} rating)</Text>
                </View>

                <Text>Member Since {productDetails.seller.join_date}</Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: "#252522",
                fontFamily: "Inter-SemiBold",
              }}>
              Descriptions
            </Text>
            <View
              style={{
                height: 1,
                width: "100%",
                marginVertical: 5,
                backgroundColor: "#002642",
              }}>
              <View
                style={{
                  height: 1,
                  width: "20%",
                  backgroundColor: Colors.PRIMARY_COLOR,
                }}
              />
            </View>
            <View>
              <Text style={{ textAlign: "left" }}>
                {productDetails.about}
              </Text>
            </View>

            <View style={{ padding: 10, marginVertical: 10 }}>
              {/* <Image
                style={{ height: 200, width: "100%" }}
                source={require("../../assets/Images/map.jpeg")}
              /> */}

              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{ height: 200, width: "100%" }}
                region={{
                  latitudeDelta: 0.04,
                  longitudeDelta: 0.05,
                  latitude: productDetails.latitude,
                  longitude: productDetails.longitude,
                }}
              >
                <Marker
                  title={productDetails.title}
                  image={require("@assets/Images/map1.png")}
                  coordinate={{
                    latitude: productDetails.latitude,
                    longitude: productDetails.longitude
                  }}
                />
              </MapView>
            </View>

            <Text
              style={{
                fontSize: 16,
                marginTop: 10,
                color: "#252522",
                fontFamily: "Inter-SemiBold",
              }}>
              More like this
            </Text>
            <View
              style={{
                height: 1,
                width: "100%",
                marginVertical: 5,
                backgroundColor: "#002642",
              }}>
              <View
                style={{
                  height: 1,
                  width: "20%",
                  backgroundColor: Colors.PRIMARY_COLOR,
                }}
              />
            </View>

            <View style={{ paddingVertical: 10 }}>
              <FlatList<typeof relatedProducts[0]>
                horizontal
                ListEmptyComponent={() => (
                  <View>
                    <Text>No data</Text>
                  </View>
                )}
                data={relatedProducts}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <EachProductItem item={item} />}
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.askButton}
            onPress={() => navigation.navigate(RootStackRoutes.ASK_QUESTION)}
          >
            <AntDesign name="questioncircleo" size={25} color={"#FFFFFF"} />
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                color: "#FFFFFF",
                fontFamily: "Inter-Medium",
              }}>
              Ask Question
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

export default ProductDetailsScreen;
