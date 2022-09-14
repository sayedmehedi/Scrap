import React from 'react';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday'
import { View, SectionList, StyleSheet } from 'react-native';
import isYesterday from 'dayjs/plugin/isYesterday'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Title, Text, useTheme } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { AppNotification, PaginationQueryParams, GetTransactionsResponse, Transaction } from '@src/types';
import { useGetTransactionsQuery, useLazyGetTransactionsQuery } from '@data/laravel/services/auth';

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)

export default function TransactionsScreen() {
    const theme = useTheme();
    const [getTransactions, { isFetching }] = useLazyGetTransactionsQuery({});
    const { data: getTransactionsResponse, isLoading } = useGetTransactionsQuery({});
    const actionCreaterRef = React.useRef<ReturnType<typeof getTransactions> | null>(null);
    const [transactionPages, setTransactionPages] = React.useState<Array<GetTransactionsResponse["transactions"]>>([]);

    React.useEffect(() => {
        if (!isLoading && !!getTransactionsResponse) {
            setTransactionPages([getTransactionsResponse.transactions])
        }
    }, [getTransactionsResponse, isLoading])

    const getNextNotifications = async () => {
        if (isFetching || isLoading) {
            return;
        }

        const lastProductPage = transactionPages[transactionPages.length - 1]

        if (lastProductPage && !lastProductPage.has_more_data) {
            return;
        }

        const params: PaginationQueryParams = {}

        if (lastProductPage) {
            params.page = lastProductPage.current_page + 1;
        }

        actionCreaterRef.current = getTransactions(params, true)

        try {
            const productResponse = await actionCreaterRef.current.unwrap()

            setTransactionPages(prevPages => {
                return prevPages.concat(productResponse.transactions)
            })
        } finally {
        }
    }

    React.useEffect(() => {
        return () => {
            if (actionCreaterRef.current) {

                actionCreaterRef.current.abort()
            }
        }
    }, [])

    const transactions = React.useMemo(() => {
        if (isLoading) {
            return [{
                title: "Today",
                data: [{
                    id: 1,
                    type: "skeleton" as const
                },
                {
                    id: 2,
                    type: "skeleton" as const
                },
                {
                    id: 3,
                    type: "skeleton" as const
                }]
            },
            {
                title: "Yesterday",
                data: [{
                    id: 1,
                    type: "skeleton" as const
                },
                {
                    id: 2,
                    type: "skeleton" as const
                },
                {
                    id: 3,
                    type: "skeleton" as const
                }]
            }]
        }

        const transactionByDate: Record<"Today" | "Yesterday" | string, (Transaction & { type: "data" })[]> = {
            Today: [],
            Yesterday: [],
        }

        transactionPages.forEach(transactionPage => {
            transactionPage.data.forEach(transaction => {
                const isToday = dayjs(transaction.date, "DD MMMM YYYY").isToday()
                const isYesterday = dayjs(transaction.date, "DD MMMM YYYY").isYesterday();

                if (isToday) {
                    transactionByDate.Today.push({
                        type: "data",
                        ...transaction
                    })
                } else if (isYesterday) {
                    transactionByDate.Yesterday.push({
                        type: "data",
                        ...transaction
                    })
                } else {
                    const date = dayjs(transaction.date, "DD MMMM YYYY").format("DD MMM YYYY")

                    if (!transactionByDate[date]) {
                        transactionByDate[date] = []
                    }

                    transactionByDate[date].push({
                        type: "data",
                        ...transaction
                    })
                }
            })
        })


        return Object
            .entries(transactionByDate)
            .map(([title, data]) => ({
                title,
                data
            }))
    }, [isLoading, transactionPages])

    return (
        <View style={{ backgroundColor: 'white', flex: 1, padding: 10 }}>
            <SectionList<typeof transactions[0]["data"][0]>
                sections={transactions}
                keyExtractor={(item, index) => `${item.id + index}`}
                contentContainerStyle={{
                    paddingBottom: 50
                }}
                onEndReached={getNextNotifications}
                renderSectionHeader={({ section: { title, data } }) => (
                    <React.Fragment>
                        <Title style={{ marginBottom: 15 }}>{title}</Title>
                        {data.length === 0 ? <Text style={{ textAlign: "center" }}>No data</Text> : null}
                    </React.Fragment>
                )}
                ListEmptyComponent={() => (
                    <View>
                        <Text style={{ textAlign: "center" }}>No data</Text>
                    </View>
                )}
                renderItem={({ item, }) => {
                    if (item.type === "skeleton") {
                        return (
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item paddingBottom={15}>
                                    <SkeletonPlaceholder.Item height={100} borderRadius={5} />
                                </SkeletonPlaceholder.Item>
                            </SkeletonPlaceholder>
                        )
                    }

                    return (
                        <View style={{
                            height: 100,
                            width: '100%',
                            borderRadius: 8,
                            borderWidth: 1,
                            marginVertical: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            borderColor: '#F1F1F1',
                            backgroundColor: 'white',
                            justifyContent: 'space-around',

                        }}>
                            <View>
                                <Text style={{
                                    fontSize: 14,
                                    color: '#262B2E',
                                    fontFamily: 'SatoshiVariable-Bold',
                                }}>item.clubName</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#8A8D9F',
                                        fontFamily: 'Satoshi-Regular',
                                    }}>item.tableName |</Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#8A8D9F',
                                        fontFamily: 'Satoshi-Regular',
                                    }}> item.numberOfGuest Guest</Text>

                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.dot} />
                                    <Text style={{
                                        fontSize: 10,
                                        color: '#FE2121',
                                        fontFamily: 'Satoshi-Regular',
                                    }}>item.status</Text>
                                </View>
                            </View>

                            <View >
                                <Text style={{
                                    fontFamily: 'Satoshi-Regular',
                                    fontSize: 10,
                                    color: '#8A8D9F',
                                    alignSelf: 'flex-end'
                                }}>{item.payment_method}</Text>
                                <Text style={{
                                    fontFamily: 'SatoshiVariable-Bold',
                                    fontSize: 18,
                                    color: '#262B2E'
                                }}>${item.amount}</Text>
                            </View>

                        </View>

                    )

                    // return (
                    //     <View
                    //         style={{
                    //             padding: 15,
                    //             marginBottom: 15,
                    //             flexDirection: 'row',
                    //             borderRadius: theme.roundness * 3,
                    //             // @ts-ingore
                    //             backgroundColor: theme.colors.white,
                    //         }}>
                    //         <View
                    //             style={{
                    //                 width: 35,
                    //                 height: 35,
                    //                 //   marginRight: 15,
                    //                 borderRadius: 1000,
                    //                 alignItems: 'center',
                    //                 justifyContent: 'center',
                    //                 backgroundColor: 'rgba(81, 183, 100, 0.25)',
                    //             }}>
                    //             <MaterialIcons
                    //                 size={22}
                    //                 color={'#51B764'}
                    //                 name="notifications-none"
                    //             />
                    //         </View>

                    //         <View style={{ flex: 1, paddingLeft: 15 }}>
                    //             <View
                    //                 style={{
                    //                     marginBottom: 15,
                    //                     alignItems: 'center',
                    //                     flexDirection: 'row',
                    //                     justifyContent: 'space-between',
                    //                 }}>
                    //                 <Text
                    //                     style={{
                    //                         fontSize: 16,
                    //                         color: '#F04E26',
                    //                         fontWeight: '700',
                    //                     }}>
                    //                     {item.payment_method}
                    //                 </Text>
                    //             </View>

                    //             <Text style={{
                    //                 color: theme.colors.tertiary
                    //             }}>
                    //                 ${item.amount}
                    //             </Text>
                    //         </View>
                    //     </View>
                    // )
                }}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    dot: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: '#FE2121',
        marginRight: 10
    }
})
