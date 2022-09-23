import React from "react";
import styles from "./styles";
import {FlatList} from "react-native";
import {useAppSelector} from "@hooks/store";
import {RootStackRoutes} from "@constants/routes";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Avatar, Rating} from "react-native-elements";
import {useNavigation} from "@react-navigation/native";
import {ActivityIndicator, Text, Title, useTheme} from "react-native-paper";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {View, Image, TextInput, TouchableOpacity} from "react-native";
import {useGetProductDetailsQuery} from "@data/laravel/services/product";
import {
  ProductDetails,
  RootStackParamList,
  GetConversationDetailsResponse,
} from "@src/types";
import {
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  useSendMessageMutation,
  useGetConversationDetailsQuery,
  useLazyGetConversationDetailsQuery,
} from "@data/laravel/services/message";
import {useMakeBidWinnerOrAcceptOfferMutation} from "@data/laravel/services/offerNBids";

function AppBar({
  back,
  route,
  navigation,

  user,
  seller,
  product,
  hasSellerRole,
}: NativeStackHeaderProps &
  Omit<GetConversationDetailsResponse, "messages"> & {
    hasSellerRole: boolean;
  }) {
  return (
    <View style={styles.header}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        {back && (
          <TouchableOpacity style={{padding: 0}} onPress={navigation.goBack}>
            <MaterialIcons
              size={22}
              color={"white"}
              name="keyboard-backspace"
            />
          </TouchableOpacity>
        )}

        <View style={{marginHorizontal: 10}}>
          <Avatar
            rounded
            size={"medium"}
            source={{uri: hasSellerRole ? user.image : seller.image}}
          />
        </View>

        <View>
          <Title style={{color: "white"}}>
            {hasSellerRole ? user.name : seller.name}
          </Title>
          {hasSellerRole ? (
            <Text style={{color: "white"}}>{user.location}</Text>
          ) : (
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <View>
                <Rating
                  readonly
                  imageSize={15}
                  showRating={false}
                  tintColor={"#E62B56"}
                  startingValue={seller.rating}
                />
              </View>

              <View style={{marginLeft: 10}}>
                <Text style={{color: "white"}}>({seller.rating} ratings)</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{alignItems: "center"}}>
        <Image
          source={{uri: product.image}}
          style={{height: 50, width: 50, borderRadius: 8}}
        />

        <Text
          style={{
            fontSize: 10,
            marginTop: 5,
            color: "white",
          }}>
          ${product.price}
        </Text>
      </View>
    </View>
  );
}

function AppBarPlaceholder({back, route, navigation}: NativeStackHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        {back && (
          <TouchableOpacity style={{padding: 0}} onPress={navigation.goBack}>
            <MaterialIcons
              size={22}
              color={"white"}
              name={"keyboard-backspace"}
            />
          </TouchableOpacity>
        )}

        <View style={{marginHorizontal: 10}}>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              borderRadius={40}
            />
          </SkeletonPlaceholder>
        </View>

        <View>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item height={15} width={75} />
            <SkeletonPlaceholder.Item height={10} width={50} marginTop={10} />
          </SkeletonPlaceholder>
        </View>
      </View>

      <View style={{alignItems: "center"}}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={50} height={50} borderRadius={4} />
          <SkeletonPlaceholder.Item width={50} height={10} marginTop={10} />
        </SkeletonPlaceholder>
      </View>
    </View>
  );
}

function UserAction({product}: {product: ProductDetails}) {
  const theme = useTheme();
  const navigation = useNavigation();

  const actionBtn = product.has_bid ? (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(RootStackRoutes.PLACE_BID, {
          productId: product.id,
          productName: product.title,
          totalBids: product.total_bids,
          timeLeftToBid: product.time_left,
          productImage: product.images.small[0] ?? undefined,
          bidStartingPrice: !!product.starting_price
            ? +product.starting_price
            : 0,
        });
      }}
      style={{
        height: 31,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#191F2B",
      }}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.white,
          fontFamily: "Inter-Regular",
        }}>
        Update Bid
      </Text>
    </TouchableOpacity>
  ) : product.has_offer ? (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(RootStackRoutes.MAKE_OFFER, {
          productId: product.id,
          productName: product.title,
          totalOffers: product.total_offers,
          shippingCost: +product.shipping_cost,
          productImage: product.images.small[0] ?? undefined,
          buyPrice: !!product.buy_price ? +product.buy_price : 0,
        });
      }}
      style={{
        height: 31,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#191F2B",
      }}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.white,
          fontFamily: "Inter-Regular",
        }}>
        Update Offer
      </Text>
    </TouchableOpacity>
  ) : product.time_left !== "0 days 0 hours 0 mins 0 secs" ? (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(RootStackRoutes.PLACE_BID, {
          productId: product.id,
          productName: product.title,
          totalBids: product.total_bids,
          timeLeftToBid: product.time_left,
          productImage: product.images.small[0] ?? undefined,
          bidStartingPrice: !!product.starting_price
            ? +product.starting_price
            : 0,
        });
      }}
      style={{
        height: 31,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#191F2B",
      }}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.white,
          fontFamily: "Inter-Regular",
        }}>
        Place Bid
      </Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(RootStackRoutes.MAKE_OFFER, {
          productId: product.id,
          productName: product.title,
          totalOffers: product.total_offers,
          shippingCost: +product.shipping_cost,
          productImage: product.images.small[0] ?? undefined,
          buyPrice: !!product.buy_price ? +product.buy_price : 0,
        });
      }}
      style={{
        height: 31,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#191F2B",
      }}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.white,
          fontFamily: "Inter-Regular",
        }}>
        Make Offer
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        padding: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Image
          resizeMode={"contain"}
          style={{height: 20, width: 20}}
          source={require("@assets/Images/van.png")}
        />

        <Text
          style={{
            fontSize: 12,
            marginLeft: 8,
            color: "#023047",
            fontFamily: "Inter-Medium",
          }}>
          Ships for: ${product.shipping_cost}
        </Text>
      </View>

      {actionBtn}
    </View>
  );
}

function SellerAction({product}: {product: ProductDetails}) {
  const theme = useTheme();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [
    makeBidWinnerOrAcceptOffer,
    {isLoading, isSuccess, data: makeBidWinnerOrAcceptOfferResponse},
  ] = useMakeBidWinnerOrAcceptOfferMutation();

  React.useEffect(() => {
    if (
      isSuccess &&
      !!makeBidWinnerOrAcceptOfferResponse &&
      "success" in makeBidWinnerOrAcceptOfferResponse
    ) {
      enqueueSuccessSnackbar({
        text1: "Success",
        text2: makeBidWinnerOrAcceptOfferResponse.success,
      });
    }

    if (
      isSuccess &&
      !!makeBidWinnerOrAcceptOfferResponse &&
      "error" in makeBidWinnerOrAcceptOfferResponse
    ) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: makeBidWinnerOrAcceptOfferResponse.error,
      });
    }
  }, [
    isSuccess,
    enqueueErrorSnackbar,
    enqueueSuccessSnackbar,
    makeBidWinnerOrAcceptOfferResponse,
  ]);

  const actionBtn = product.has_bid ? (
    <TouchableOpacity
      onPress={() => {
        if (product.bid !== "" && !!product.bid) {
          makeBidWinnerOrAcceptOffer({
            offerOrBidId: product.bid.id,
          });
        }
      }}
      style={{
        height: 31,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.success,
      }}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.white,
          fontFamily: "Inter-Regular",
        }}>
        Award
      </Text>
    </TouchableOpacity>
  ) : product.has_offer ? (
    <TouchableOpacity
      onPress={() => {
        if (product.offer !== "" && !!product.offer) {
          makeBidWinnerOrAcceptOffer({
            offerOrBidId: product.offer.id,
          });
        }
      }}
      style={{
        height: 31,
        width: 110,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.success,
      }}>
      <Text
        style={{
          fontSize: 12,
          color: theme.colors.white,
          fontFamily: "Inter-Regular",
        }}>
        Accept
      </Text>
    </TouchableOpacity>
  ) : null;

  return (
    <View
      style={{
        padding: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Image
          resizeMode={"contain"}
          style={{height: 20, width: 20}}
          source={require("@assets/Images/van.png")}
        />

        {product.has_bid &&
        product.time_left !== "0 days 0 hours 0 mins 0 secs" ? (
          <Text
            style={{
              fontSize: 12,
              marginLeft: 8,
              color: "#023047",
              fontFamily: "Inter-Medium",
            }}>
            Bid price: ${product.bid === "" ? "" : product.bid?.price ?? "0"}
          </Text>
        ) : product.has_offer ? (
          <Text
            style={{
              fontSize: 12,
              marginLeft: 8,
              color: "#023047",
              fontFamily: "Inter-Medium",
            }}>
            Offer price: $
            {product.offer === "" ? "" : product.offer?.price ?? "0"}
          </Text>
        ) : null}
      </View>

      {actionBtn}
    </View>
  );
}

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.SINGLE_CONVERSATION
>;

const SingleConversationScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const flatlistRef = React.useRef<FlatList>(null!);
  const [messageText, setMessageText] = React.useState("");
  const authId = useAppSelector(state => state.auth.user?.id);
  const [hasSellerRole, setHasSellerRole] = React.useState(false);
  const currentUsername = useAppSelector(state => state.auth.profile?.name);
  const [messagePages, setMessagePages] = React.useState<
    Array<GetConversationDetailsResponse["messages"]>
  >([]);

  const {data: productDetailsRepsonse, isLoading: isLoadingProductDetails} =
    useGetProductDetailsQuery({
      id: route.params.productId,
    });

  const {
    refetch,
    isLoading,
    isFetching: isFetchingInitial,
    data: conversationDetailsResponse,
  } = useGetConversationDetailsQuery(
    {
      receiver_id: route.params.userId,
      product_id: route.params.productId,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useRefreshOnFocus(refetch);

  const [getConversationDetails, {isFetching: isFetchingNextPage}] =
    useLazyGetConversationDetailsQuery();

  const actionCreaterRef = React.useRef<ReturnType<
    typeof getConversationDetails
  > | null>(null);

  const [sendMessage, {isLoading: isSendingMessage}] = useSendMessageMutation();

  React.useEffect(() => {
    if (!!conversationDetailsResponse) {
      setHasSellerRole(conversationDetailsResponse.seller.id === authId);
    }
  }, [conversationDetailsResponse]);

  React.useEffect(() => {
    if (!isLoading && !!conversationDetailsResponse) {
      setMessagePages([conversationDetailsResponse.messages]);
    }
  }, [conversationDetailsResponse, isLoading]);

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {
        actionCreaterRef.current.abort();
      }
    };
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      header: function (props) {
        return !!conversationDetailsResponse ? (
          <AppBar
            {...props}
            hasSellerRole={hasSellerRole}
            user={conversationDetailsResponse.user}
            seller={conversationDetailsResponse.seller}
            product={conversationDetailsResponse.product}
          />
        ) : (
          <AppBarPlaceholder {...props} />
        );
      },
      headerShown: true,
    });
  }, [navigation, conversationDetailsResponse, hasSellerRole]);

  const messages = React.useMemo(() => {
    if (isLoading || isLoadingProductDetails) {
      return new Array(15).fill(1).map((_, id) => ({
        id,
        type: "skeleton" as const,
      }));
    }

    return messagePages.flatMap(messagePage =>
      messagePage.data.map(msg => ({
        type: "data" as const,
        ...msg,
      })),
    );
  }, [isLoading, messagePages, isLoadingProductDetails]);

  const getNextMessages = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = messagePages[messagePages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: Parameters<typeof getConversationDetails>[0] = {
      product_id: productDetailsRepsonse?.id ?? 0,
      receiver_id: productDetailsRepsonse?.seller.id ?? 0,
    };

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = getConversationDetails(params);

    try {
      const conversationDetailsResponse =
        await actionCreaterRef.current.unwrap();

      setMessagePages(prevPages => {
        return prevPages.concat(conversationDetailsResponse.messages);
      });
    } finally {
    }
  };

  const handleSendMessage = () => {
    let receiver_id = productDetailsRepsonse?.seller.id ?? 0;

    if (hasSellerRole) {
      receiver_id = conversationDetailsResponse?.user.id ?? 0;
    }

    sendMessage({
      receiver_id,
      message: messageText,
      product_id: route.params.productId,
    })
      .unwrap()
      .then(() => {
        setMessageText("");
        flatlistRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      });
  };

  return (
    <>
      <View style={{flex: 1}}>
        {!!productDetailsRepsonse &&
          (hasSellerRole ? (
            <SellerAction product={productDetailsRepsonse} />
          ) : (
            <UserAction product={productDetailsRepsonse} />
          ))}

        {isFetchingNextPage ? (
          <View
            style={{
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <ActivityIndicator size={"small"} />
          </View>
        ) : null}

        <FlatList<typeof messages[0]>
          inverted
          data={messages}
          ref={flatlistRef}
          onRefresh={refetch}
          refreshing={isFetchingInitial}
          onEndReached={getNextMessages}
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            padding: 15,
          }}
          renderItem={({item}) => {
            if (item.type === "skeleton") {
              return (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item
                    paddingBottom={15}
                    alignSelf={"flex-start"}
                    width={"50%"}>
                    <SkeletonPlaceholder.Item height={50} borderRadius={5} />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item
                    paddingBottom={15}
                    alignSelf={"flex-start"}
                    width={"40%"}>
                    <SkeletonPlaceholder.Item height={50} borderRadius={5} />
                  </SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item
                    paddingBottom={15}
                    alignSelf={"flex-start"}
                    width={"60%"}>
                    <SkeletonPlaceholder.Item height={50} borderRadius={5} />
                  </SkeletonPlaceholder.Item>

                  <SkeletonPlaceholder.Item
                    paddingBottom={15}
                    alignSelf={"flex-end"}
                    width={"50%"}>
                    <SkeletonPlaceholder.Item height={50} borderRadius={5} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              );
            }

            if (currentUsername === item.sender_name) {
              return (
                <View
                  style={{
                    width: "100%",
                    alignSelf: "flex-end",
                    alignItems: "flex-end",
                  }}>
                  <View
                    style={{
                      padding: 20,
                      width: "auto",
                      maxWidth: "100%",
                      backgroundColor: "#667085",
                      borderRadius: theme.roundness * 3,
                    }}>
                    <Text
                      style={{
                        color: theme.colors.white,
                      }}>
                      {item.title}
                    </Text>
                  </View>

                  <View style={{flexDirection: "row", marginTop: 5}}>
                    <View>
                      <Text>{item.created_at}</Text>
                    </View>

                    <View style={{marginLeft: 10}}>
                      <Avatar
                        rounded
                        size={"small"}
                        // @ts-ignore
                        style={{height: 20, width: 20}}
                        source={{uri: item.sender_image}}
                      />
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <View
                style={{
                  width: "100%",
                  marginBottom: 20,
                  flexDirection: "row",
                  alignItems: "flex-end",
                  alignSelf: "flex-start",
                }}>
                <View style={{marginRight: 10, marginBottom: 20}}>
                  <Avatar
                    rounded
                    size={"small"}
                    source={{uri: item.sender_image}}
                  />
                </View>

                <View style={{flex: 1}}>
                  <View
                    style={{
                      padding: 20,
                      alignSelf: "flex-start",
                      backgroundColor: "#EAECF2",
                      borderRadius: theme.roundness * 3,
                    }}>
                    <Text>{item.title}</Text>
                  </View>

                  <View style={{marginTop: 5}}>
                    <Text>{item.created_at}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />

        <View
          style={{
            paddingVertical: 15,
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: 10,
            backgroundColor: theme.colors.white,
          }}>
          <View style={{flex: 1, borderWidth: 1}}>
            <TextInput
              style={{
                padding: 10,
              }}
              multiline
              numberOfLines={2}
              value={messageText}
              placeholder={"Type here.."}
              onChangeText={setMessageText}
            />
          </View>

          <View
            style={{
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}>
            {isSendingMessage ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!messageText || isSendingMessage}>
                <MaterialIcons name={"send"} size={25} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

export default SingleConversationScreen;
