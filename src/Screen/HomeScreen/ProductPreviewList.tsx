import React from 'react'
import { FlatList, View, Text } from 'react-native'
import { FilterProductQueryParams } from '@src/types'
import EachProductItem from '@src/Component/EachProductItem'
import { SCREEN_PADDING_HORIZONTAL } from '@constants/spacing'
import { useGetFilterProductsQuery } from '@data/laravel/services/product'

const ProductPreviewList = ({ params, }: { params?: FilterProductQueryParams, }) => {
    const { data: filterProductsResponse, isLoading: isFilterProductsLoading, } = useGetFilterProductsQuery(params)

    const products = React.useMemo(() => {
        if (isFilterProductsLoading) {
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

        return filterProductsResponse?.products.data.map(product => ({
            type: "data" as const,
            ...product
        })) ?? []
    }, [filterProductsResponse, isFilterProductsLoading])

    return (
        <FlatList<typeof products[0]>
            horizontal
            data={products}
            contentContainerStyle={{
                marginHorizontal: SCREEN_PADDING_HORIZONTAL
            }}
            ListEmptyComponent={() => (
                <View>
                    <Text>No data</Text>
                </View>
            )}
            showsHorizontalScrollIndicator={false}
            // @ts-ignore
            renderItem={({ item }) => <EachProductItem item={item} />}
        />
    )
}

export default ProductPreviewList