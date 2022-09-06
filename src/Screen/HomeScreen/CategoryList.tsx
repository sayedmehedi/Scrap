import React from 'react'
import { FlatList, View, Text } from 'react-native'
import EachCateriesItem from '@src/Component/EachCateriesItem'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { useGetHomeScreenCategoriesQuery } from '@data/laravel/services/category'

const CategoryList = () => {
    const { data: homeCategoriesResponse, isLoading: isHomeCategoriesLoading } = useGetHomeScreenCategoriesQuery()

    const categories = React.useMemo(() => {
        return homeCategoriesResponse?.categories ?? []
    }, [homeCategoriesResponse])

    if (isHomeCategoriesLoading) {
        return (
            <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item paddingHorizontal={15} flexDirection="row" alignItems="center" justifyContent='space-between'>
                    <SkeletonPlaceholder.Item width={80} height={80} borderRadius={40} />
                    <SkeletonPlaceholder.Item width={80} height={80} borderRadius={40} />
                    <SkeletonPlaceholder.Item width={80} height={80} borderRadius={40} />
                    <SkeletonPlaceholder.Item width={80} height={80} borderRadius={40} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        )
    }

    return (
        <FlatList
            horizontal
            data={categories}
            ListEmptyComponent={() => (
                <View>
                    <Text>No data</Text>
                </View>
            )}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <EachCateriesItem item={item} />}
        />
    )
}

export default CategoryList