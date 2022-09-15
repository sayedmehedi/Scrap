import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Header from '../../Component/Header';
import { HomeStackParamList } from '@src/types';
import { HomeStackRoutes } from '@constants/routes';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useGetAllCategoriesQuery } from '@data/laravel/services/category';
import { NativeStackNavigationProp, } from '@react-navigation/native-stack';



const { width } = Dimensions.get("window")

const skeletonTitleWidth = width * 0.25

const AllCategoriesScreen = () => {
  const [active, setActive] = React.useState<number | null>(null);

  const handleRowPressed = (rowIndex: number | null) => setActive(rowIndex)

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
        <Header from="allCategories" />
        <View
          style={{
            width: '100%',
            backgroundColor: '#F7F7F7',
          }}>
          <CategoryList active={active} onRowPressed={handleRowPressed} />
        </View>
      </View>
    </>
  );
};

type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const CategoryList = ({ active, onRowPressed }: { active: number | null, onRowPressed: (rowIndex: number | null) => void }) => {
  const navigation = useNavigation<HomeStackNavigationProp>();
  const { data, isLoading } = useGetAllCategoriesQuery();


  const categories = React.useMemo(() => {
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

    return data?.categories.map(category => ({
      type: "data" as const,
      ...category
    })) ?? []

  }, [isLoading, data])

  return (
    <FlatList<typeof categories[0]>
      data={categories}
      contentContainerStyle={{
        marginHorizontal: 20
      }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View>
          <Text style={{ textAlign: "center" }}>No data</Text>
        </View>
      )}
      renderItem={({ item, index }) => {
        if (item.type === "skeleton") {
          return (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item borderBottomWidth={0.3} flexDirection="row" alignItems="center" height={50} paddingHorizontal={10}>
                <SkeletonPlaceholder.Item flex={1}>
                  <SkeletonPlaceholder.Item width={skeletonTitleWidth} height={15} borderRadius={50} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item marginLeft={20}>
                  <SkeletonPlaceholder.Item width={10} height={10} borderRadius={4} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          );

        }

        const onPress = (category: typeof item) => {
          onRowPressed(index === active ? null : index)
        };

        const open = active == index;

        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              key={item.id}
              activeOpacity={1}
              onPress={() => onPress(item)}
              style={{ paddingVertical: 20, borderBottomWidth: 0.3 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#403C39',
                    fontFamily: 'Inter-Medium',
                  }}>
                  {item.title}
                </Text>
                {open ? (
                  <FontAwesome name="angle-up" size={18} color={'black'} />
                ) : (
                  <FontAwesome name="angle-down" size={18} color={'black'} />
                )}
              </View>
              <View style={{ flexDirection: 'row' }}>
                {open && (
                  <FlatList data={item.sub_categories} renderItem={({ item }) => {
                    return (
                      <View style={{ paddingLeft: 15 }}>
                        <TouchableOpacity activeOpacity={0.2}></TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => navigation.navigate(HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA, {
                            categoryId: item.id,
                            categoryTitle: item.title
                          })}
                          style={{ width: '100%', marginVertical: 7 }}
                        >
                          <Text
                            numberOfLines={2}
                            style={{ fontSize: 14, fontFamily: 'Inter-Light', color: '#403C39' }}>
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }} />
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
        );
      }}
    />
  )
}

export default AllCategoriesScreen;

const styles = StyleSheet.create({});
