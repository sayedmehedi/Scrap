import React from 'react'
import { FlatList, Dimensions } from 'react-native'
import EachProductItem from '@src/Component/EachProductItem'
import { FilterProduct, FilterProductQueryParams } from '@src/types'
import { useGetFilterProductsQuery } from '@data/laravel/services/product'

const { width } = Dimensions.get("window")


const ProductPreviewList = ({ params }: { params?: FilterProductQueryParams }) => {
    const { data: filterProductsResponse, isLoading: isFilterProductsLoading } = useGetFilterProductsQuery(params)

    const products: Array<FilterProduct & { type: "data" } | { id: number; type: "skeleton" }> = React.useMemo(() => {
        if (isFilterProductsLoading) {
            return [{
                id: 1,
                type: "skeleton"
            },
            {
                id: 2,
                type: "skeleton"
            },
            {
                id: 3,
                type: "skeleton"
            }]
        }

        return filterProductsResponse?.products.data ?? []
    }, [filterProductsResponse, isFilterProductsLoading])


    return (
        <FlatList
            horizontal
            data={products}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <EachProductItem item={item} />}
        />
    )
}

export default ProductPreviewList