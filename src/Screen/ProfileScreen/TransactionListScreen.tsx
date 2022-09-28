import React from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import {Title, Text} from "react-native-paper";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import {View, SectionList, StyleSheet} from "react-native";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  AppNotification,
  PaginationQueryParams,
  GetTransactionsResponse,
  Transaction,
} from "@src/types";
import {
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
} from "@data/laravel/services/auth";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

const getTransactionStatusColor = (item: Transaction) =>
  item.status === 0 ? "#F04E26" : "#51B764";

export default function TransactionsScreen() {
  const [getTransactions, {isFetching: isFetchingNextPage}] =
    useLazyGetTransactionsQuery({});
  const {
    refetch,
    isLoading,
    data: getTransactionsResponse,
    isFetching: isFetchingInitial,
  } = useGetTransactionsQuery({});

  useRefreshOnFocus(refetch);

  const actionCreaterRef = React.useRef<ReturnType<
    typeof getTransactions
  > | null>(null);
  const [transactionPages, setTransactionPages] = React.useState<
    Array<GetTransactionsResponse["transactions"]>
  >([]);

  React.useEffect(() => {
    if (!isLoading && !!getTransactionsResponse) {
      setTransactionPages([getTransactionsResponse.transactions]);
    }
  }, [getTransactionsResponse, isLoading]);

  const getNextNotifications = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = transactionPages[transactionPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = getTransactions(params, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();

      setTransactionPages(prevPages => {
        return prevPages.concat(productResponse.transactions);
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

  const transactions = React.useMemo(() => {
    if (isLoading) {
      return [
        {
          title: "Today",
          data: [
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
          ],
        },
        {
          title: "Yesterday",
          data: [
            {
              id: 4,
              type: "skeleton" as const,
            },
            {
              id: 5,
              type: "skeleton" as const,
            },
            {
              id: 6,
              type: "skeleton" as const,
            },
          ],
        },
      ];
    }

    const transactionByDate: Record<
      "Today" | "Yesterday" | string,
      (Transaction & {type: "data"})[]
    > = {
      Today: [],
      Yesterday: [],
    };

    transactionPages.forEach(transactionPage => {
      transactionPage.data.forEach(transaction => {
        const isToday = dayjs(transaction.date, "DD MMMM YYYY").isToday();
        const isYesterday = dayjs(
          transaction.date,
          "DD MMMM YYYY",
        ).isYesterday();

        if (isToday) {
          transactionByDate.Today.push({
            type: "data",
            ...transaction,
          });
        } else if (isYesterday) {
          transactionByDate.Yesterday.push({
            type: "data",
            ...transaction,
          });
        } else {
          const date = dayjs(transaction.date, "DD MMMM YYYY").format(
            "DD MMM YYYY",
          );

          if (!transactionByDate[date]) {
            transactionByDate[date] = [];
          }

          transactionByDate[date].push({
            type: "data",
            ...transaction,
          });
        }
      });
    });

    return Object.entries(transactionByDate).map(([title, data]) => ({
      title,
      data,
    }));
  }, [isLoading, transactionPages]);

  return (
    <View style={{backgroundColor: "white", flex: 1, padding: 10}}>
      <SectionList<typeof transactions[0]["data"][0]>
        sections={transactions}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.id + index}`}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        onRefresh={refetch}
        refreshing={isFetchingInitial}
        onEndReached={getNextNotifications}
        renderSectionHeader={({section: {title, data}}) =>
          data.length > 0 ? (
            <React.Fragment>
              <Title style={{marginBottom: 15}}>{title}</Title>
              {data.length === 0 ? (
                <Text style={{textAlign: "center"}}>No data</Text>
              ) : null}
            </React.Fragment>
          ) : null
        }
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

          return (
            <View
              style={{
                height: 100,
                width: "100%",
                borderRadius: 8,
                borderWidth: 1,
                marginVertical: 5,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                borderColor: "#F1F1F1",
                backgroundColor: "white",
                justifyContent: "space-between",
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: "#262B2E",
                    fontFamily: "SatoshiVariable-Bold",
                  }}>
                  {item.product_name ?? "No product"}
                </Text>
                <View style={{flexDirection: "row", marginVertical: 4}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#8A8D9F",
                      fontFamily: "Satoshi-Regular",
                    }}>
                    {item.date}
                  </Text>
                </View>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: getTransactionStatusColor(item),
                      },
                    ]}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: getTransactionStatusColor(item),
                      fontFamily: "Satoshi-Regular",
                    }}>
                    {item.status === 0 ? "Failed" : "Success"}
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={{
                    fontFamily: "Satoshi-Regular",
                    fontSize: 10,
                    color: "#8A8D9F",
                    alignSelf: "flex-end",
                  }}>
                  {item.payment_method}
                </Text>
                <Text
                  style={{
                    fontFamily: "SatoshiVariable-Bold",
                    fontSize: 18,
                    color: "#262B2E",
                  }}>
                  ${item.amount}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginRight: 10,
  },
});
