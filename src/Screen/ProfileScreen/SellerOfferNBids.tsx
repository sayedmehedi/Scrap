import React from 'react'
import { FlatList, View, Image } from 'react-native'
import EachSellerOfferNBids from './EachSellerOfferNBids';
import { useNavigation } from '@react-navigation/native';
import { FilterProduct, GetOfferNBidsResponse } from '@src/types';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Button, Card, Text, Title, useTheme } from 'react-native-paper';
import { useGetSellerOfferNBidsQuery, useLazyGetSellerOfferNBidsQuery } from '@data/laravel/services/offerNBids';

export default function SellerOfferNBids({ product, onBackPressed }: { product: FilterProduct, onBackPressed: () => void }) {
    const theme = useTheme();
    const navigation = useNavigation();
    const [getUserOfferNBids, { isFetching }] = useLazyGetSellerOfferNBidsQuery()
    const { data: sellerOfferNBidsResponse, isLoading: isInitialLoading } = useGetSellerOfferNBidsQuery({ productId: product.id })
    const [offerNBidPages, setOfferNBidPages] = React.useState<Array<GetOfferNBidsResponse["items"]>>([]);
    const actionCreaterRef = React.useRef<ReturnType<typeof getUserOfferNBids> | null>(null);

    React.useEffect(
        () =>
            navigation.addListener('beforeRemove', (e) => {
                // Prevent default behavior of leaving the screen
                e.preventDefault();

                onBackPressed()
            }),
        [navigation, onBackPressed]
    );

    React.useEffect(() => {
        if (!isInitialLoading && !!sellerOfferNBidsResponse) {
            setOfferNBidPages([sellerOfferNBidsResponse.items])
        }
    }, [sellerOfferNBidsResponse])

    const getNextOfferNBids = async () => {
        if (isFetching || isInitialLoading) {
            return;
        }

        const lastProductPage = offerNBidPages[offerNBidPages.length - 1]

        if (lastProductPage && !lastProductPage.has_more_data) {
            return;
        }

        const params: Parameters<typeof getUserOfferNBids>[0] = {
            productId: product.id
        }

        if (lastProductPage) {
            params.page = lastProductPage.current_page + 1;
        }

        actionCreaterRef.current = getUserOfferNBids(params, true)

        try {
            const productResponse = await actionCreaterRef.current.unwrap()

            setOfferNBidPages(prevPages => {
                return prevPages.concat(productResponse.items)
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

    const offerNBids = React.useMemo(() => {
        if (isInitialLoading) {
            return [{
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
        }

        return offerNBidPages.flatMap(offerNBidPage => offerNBidPage.data)

    }, [isInitialLoading, offerNBidPages])

    return (
        <React.Fragment>
            <FlatList<typeof offerNBids[0]>
                data={offerNBids}
                contentContainerStyle={{
                    padding: 15
                }}
                ListHeaderComponent={() => <React.Fragment>
                    <Card.Title
                        title={product.title}
                        subtitle={`$${product.price}`}
                        titleStyle={{
                            fontSize: 15
                        }}
                        subtitleStyle={{
                            // @ts-ignore
                            color: theme.colors.black
                        }}
                        left={(props) => <Image
                            source={{ uri: product.image, }}
                            style={{
                                height: 67, width: 67, borderRadius: 5
                            }}
                        />}
                    />

                    <Title style={{ marginBottom: 15 }}>List</Title>
                </React.Fragment>}
                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                renderItem={({ item }) => {
                    if (item.type === "skeleton") {
                        return <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item />
                        </SkeletonPlaceholder>
                    }


                    return <EachSellerOfferNBids item={item} />
                }}
                ListEmptyComponent={() => (
                    <View style={{ marginLeft: "auto", marginRight: "auto", width: "50%", }}>
                        <Text style={{ textAlign: "center" }}>No data</Text>

                        <Button
                            mode={"contained"}
                            style={{
                                marginTop: 10
                            }}>View products</Button>
                    </View>
                )}
                onEndReached={getNextOfferNBids}
                showsVerticalScrollIndicator={false}
            />
        </React.Fragment>
    );
}