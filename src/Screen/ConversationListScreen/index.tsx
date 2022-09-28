import React from "react";
import EachConversation from "./EachConversation";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";
import {SafeAreaView, View, Text, FlatList} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {GetConversationsResponse, PaginationQueryParams} from "@src/types";
import {
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
} from "@data/laravel/services/message";

const ConversationListScreen = () => {
  const [getConversations, {isFetching: isFetchingNextPage}] =
    useLazyGetConversationsQuery();
  const {
    refetch,
    isLoading,
    data: getConversationsResponse,
    isFetching: isFetchingInitial,
  } = useGetConversationsQuery({});
  const [converstaionPages, setConversationPages] = React.useState<
    Array<GetConversationsResponse["messages"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<
    typeof getConversations
  > | null>(null);

  useRefreshOnFocus(refetch);

  React.useEffect(() => {
    if (!isLoading && !!getConversationsResponse) {
      setConversationPages([getConversationsResponse.messages]);
    }
  }, [getConversationsResponse, isLoading]);

  const getNextConversations = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = converstaionPages[converstaionPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = getConversations(params, true);

    try {
      const conversationsResponse = await actionCreaterRef.current.unwrap();

      setConversationPages(prevPages => {
        return prevPages.concat(conversationsResponse.messages);
      });
    } finally {
    }
  };

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {
        actionCreaterRef.current.abort();
      }
    };
  }, []);

  const conversations = React.useMemo(() => {
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

    return converstaionPages.flatMap(conversationPage =>
      conversationPage.data.map(conversation => ({
        type: "data" as const,
        ...conversation,
      })),
    );
  }, [isLoading, converstaionPages]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: "#F7F7F7"}}>
        {getConversationsResponse?.total_unseen_messages !== undefined &&
          getConversationsResponse.total_unseen_messages > 0 && (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#51B764",
                  fontFamily: "Inter-Regular",
                }}>
                You have {getConversationsResponse?.total_unseen_messages} new
                message
              </Text>
            </View>
          )}

        <View>
          <FlatList<typeof conversations[0]>
            onRefresh={refetch}
            data={conversations}
            onEndReached={getNextConversations}
            contentContainerStyle={{
              padding: 15,
              paddingBottom: 90,
            }}
            refreshing={isFetchingInitial}
            ListEmptyComponent={() => (
              <View>
                <Text style={{textAlign: "center"}}>No data</Text>
              </View>
            )}
            renderItem={({item}) => {
              if (item.type === "skeleton") {
                return (
                  <SkeletonPlaceholder>
                    <SkeletonPlaceholder.Item paddingBottom={15}>
                      <SkeletonPlaceholder.Item height={100} borderRadius={5} />
                    </SkeletonPlaceholder.Item>
                  </SkeletonPlaceholder>
                );
              }

              return <EachConversation item={item} />;
            }}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ConversationListScreen;
