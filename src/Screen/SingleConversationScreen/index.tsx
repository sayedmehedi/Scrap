import React from "react";
import styles from "./styles";
import {FlatList} from "react-native";
import {useAppSelector} from "@hooks/store";
import {Avatar} from "react-native-elements";
import {RootStackRoutes} from "@constants/routes";
import {Text, Title, useTheme} from "react-native-paper";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {GetConversationDetailsResponse, RootStackParamList} from "@src/types";
import {
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  useGetConversationDetailsQuery,
  useLazyGetConversationDetailsQuery,
  useSendMessageMutation,
} from "@data/laravel/services/message";
import {View, Image, TextInput, TouchableOpacity} from "react-native";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";

function AppBar({
  navigation,
  route,
  back,
  userImage,
  userName,
  productImage,
  productPrice,
  userLocation,
}: NativeStackHeaderProps & {
  userImage: string;
  userName: string;
  userLocation: string;
  productPrice: number;
  productImage: string;
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
          <Avatar rounded size={"medium"} source={{uri: userImage}} />
        </View>

        <View>
          <Title style={{color: "white"}}>{userName}</Title>
          <Text style={{color: "white"}}>{userLocation}</Text>
        </View>
      </View>

      <View style={{alignItems: "center"}}>
        <Image
          source={{uri: productImage}}
          style={{height: 50, width: 50, borderRadius: 8}}
        />

        <Text
          style={{
            fontSize: 10,
            marginTop: 5,
            color: "white",
          }}>
          ${productPrice}
        </Text>
      </View>
    </View>
  );
}

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.SINGLE_CONVERSATION
>;

const SingleConversationScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const [messageText, setMessageText] = React.useState("");
  const currentUsername = useAppSelector(state => state.auth.profile?.name);
  const [messagePages, setMessagePages] = React.useState<
    Array<GetConversationDetailsResponse["messages"]>
  >([]);
  const {
    refetch,
    isLoading,
    isFetching: isFetchingInitial,
    data: conversationDetailsResponse,
  } = useGetConversationDetailsQuery({
    conversationId: route.params.conversationId,
  });
  const [getConversationDetails, {isFetching: isFetchingNextPage}] =
    useLazyGetConversationDetailsQuery();

  useRefreshOnFocus(refetch);

  const actionCreaterRef = React.useRef<ReturnType<
    typeof getConversationDetails
  > | null>(null);

  const [sendMessage, {isLoading: isSendingMessage}] = useSendMessageMutation();

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
        return <AppBar {...props} {...route.params} />;
      },
      headerShown: true,
    });
  }, [navigation, route]);

  const messages = React.useMemo(() => {
    if (isLoading) {
      return [
        {
          id: 1,
          type: "skeleton" as const,
        },
        {
          id: 2,
          type: "skeleton" as const,
        },
        {
          id: 3,
          type: "skeleton" as const,
        },
      ];
    }

    return messagePages.flatMap(productPage =>
      productPage.data.map(product => ({
        type: "data" as const,
        ...product,
      })),
    );
  }, [isLoading, messagePages]);

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
      conversationId: route.params.conversationId,
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
    sendMessage({
      message: messageText,
      conversationId: route.params.conversationId,
      receiver_id: 0, // TODO: from route param or api
    });
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: "#F7F7F7"}}>
        <View
          style={{
            padding: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <FontAwesome5 name="shuttle-van" size={18} color={"#111111"} />
            <Text
              style={{
                fontSize: 12,
                marginLeft: 8,
                color: "#023047",
                fontFamily: "Inter-Medium",
              }}>
              Offer price: $7.99
            </Text>
          </View>
          <TouchableOpacity
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
                // @ts-ignore
                color: theme.colors.white,
                fontFamily: "Inter-Regular",
              }}>
              Make Offer
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList<typeof messages[0]>
          data={messages}
          onEndReached={getNextMessages}
          style={{flex: 1, paddingHorizontal: 15}}
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
                <View style={{alignItems: "flex-end", alignSelf: "flex-end"}}>
                  <View
                    style={{
                      padding: 20,
                      maxWidth: "90%",
                      borderRadius: theme.roundness * 3,
                      backgroundColor: "#667085",
                    }}>
                    <Text
                      style={{
                        // @ts-ignore
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
                        source={require("../../assets/Images/test.png")}
                      />
                    </View>
                  </View>
                </View>
              );
            }

            return (
              <View
                style={{
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

                <View>
                  <View
                    style={{
                      padding: 20,
                      maxWidth: "90%",
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
            // @ts-ignore
            backgroundColor: theme.colors.white,
          }}>
          <View style={{flex: 1}}>
            <TextInput
              multiline
              numberOfLines={3}
              value={messageText}
              placeholder={"Type here.."}
              onChangeText={setMessageText}
            />
          </View>

          <View>
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!messageText || isSendingMessage}>
              <MaterialIcons name={"send"} size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default SingleConversationScreen;
