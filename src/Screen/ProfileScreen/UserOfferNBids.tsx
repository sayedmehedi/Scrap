import React from 'react'
import EachItem from './EachItem';
import { Text } from 'react-native-paper';
import { FlatList, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { GetOfferNBidsResponse, PaginationQueryParams } from '@src/types';
import { useGetUserOfferNBidsQuery, useLazyGetUserOfferNBidsQuery } from '@data/laravel/services/offerNBids';



export default function UserOfferNBids() {
    const [getUserOfferNBids, { isFetching }] = useLazyGetUserOfferNBidsQuery()
    const [offerNBidPages, setOfferNBidPages] = React.useState<Array<GetOfferNBidsResponse["items"]>>([]);
    const actionCreaterRef = React.useRef<ReturnType<typeof getUserOfferNBids> | null>(null);
    const { data: userOfferNBidsResponse, isLoading } = useGetUserOfferNBidsQuery({})

    React.useEffect(() => {
        if (!isLoading && !!userOfferNBidsResponse) {
            setOfferNBidPages([userOfferNBidsResponse.items])
        }
    }, [userOfferNBidsResponse, isLoading])

    const getNextOfferNBids = async () => {
        if (isFetching || isLoading) {
            return;
        }

        const lastProductPage = offerNBidPages[offerNBidPages.length - 1]

        if (lastProductPage && !lastProductPage.has_more_data) {
            return;
        }

        const params: PaginationQueryParams = {}

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
        if (isLoading) {
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

    }, [isLoading, offerNBidPages])

    return (
        <FlatList<typeof offerNBids[0]>
            data={offerNBids}
            renderItem={({ item }) => {
                if (item.type === "skeleton") {
                    return (
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item padding={5}>
                                <SkeletonPlaceholder.Item height={100} />
                            </SkeletonPlaceholder.Item>
                        </SkeletonPlaceholder>
                    )
                }


                return <EachItem item={item} />
            }}
            ListEmptyComponent={() => (
                <View>
                    <Text style={{ textAlign: "center" }}>No data</Text>
                </View>
            )}
            onEndReached={getNextOfferNBids}
            showsVerticalScrollIndicator={false}
        />
    );
}