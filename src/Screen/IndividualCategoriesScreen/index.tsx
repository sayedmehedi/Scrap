import React from 'react';
import Header from '../../Component/Header';
import { HomeStackRoutes } from '@constants/routes';
import Feather from 'react-native-vector-icons/Feather';
import EachProductItem from '../../Component/EachProductItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLazyGetFilterProductsQuery } from '@data/laravel/services/product';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, } from 'react-native';
import { FilterProductQueryParams, FilterProductsResponse, HomeStackParamList } from '@src/types';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;


type Props = NativeStackScreenProps<HomeStackParamList, typeof HomeStackRoutes.INDIVIDUAL_CATEGORIES>

const IndividualCategoriesScreen = ({ route }: Props) => {

  const [productType, setProductType] = React.useState<"all" | "is_locale" | "is_shipping">("all")

  const queryParams = React.useMemo(() => {
    const data: FilterProductQueryParams = {}

    data.category_id = route.params.categoryId;

    if (productType === "is_locale") {
      data.is_locale = "1"
    }

    if (productType === "is_shipping") {
      data.is_shipping = "1"
    }

    return data;
  }, [route.params.categoryId, productType])

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
        <Header from="individualCategory" />

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={[styles.tabButton, { backgroundColor: productType === "all" ? "#191F2B" : '#E6E6E6' }]} onPress={() => setProductType("all")}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter-SemiBold',
                color: productType === "all" ? 'white' : "#191F2B",
              }}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, { backgroundColor: productType === "is_locale" ? "#191F2B" : '#E6E6E6' }]} onPress={() => setProductType("is_locale")}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter-SemiBold',
                color: productType === "is_locale" ? 'white' : "#191F2B",
              }}>
              Local PickUp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, { backgroundColor: productType === "is_shipping" ? "#191F2B" : '#E6E6E6' }]} onPress={() => setProductType("is_shipping")}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Inter-SemiBold',
                color: productType === "is_shipping" ? 'white' : "#191F2B",
              }}>
              Shipping
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 15,
            alignSelf: 'center',
          }}>
          <Feather name="map-pin" size={18} color={'#111111'} />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 14,
              color: '#111111',
              marginLeft: 10,
            }}>
            New York, 30 Miles + Shipping
          </Text>
        </View>

        <ProductList params={queryParams} />
      </View>
    </>
  );
};

const ProductList = ({ params = {} }: { params?: FilterProductQueryParams }) => {
  const [trigger, { isFetching, isLoading }] = useLazyGetFilterProductsQuery()
  // const [isFilterProductsLoading, setIsFilterProductsLoading] = React.useState(false);
  const [productPages, setProductPages] = React.useState<Array<FilterProductsResponse["products"]>>([]);

  const getNextProducts = async () => {
    if (isFetching) {
      return;
    }

    const lastProductPage = productPages[productPages.length - 1]

    if (lastProductPage && !lastProductPage.has_more_data) {
      return;
    }

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

    try {
      const productResponse = await trigger(params, true).unwrap()

      setProductPages(prevPages => prevPages.concat(productResponse.products))
    } finally {
      // setIsFilterProductsLoading(false)
    }
  }

  React.useEffect(() => {
    (async () => {
      // setIsFilterProductsLoading(true)
      try {
        const productResponse = await trigger(params, true).unwrap()

        setProductPages([productResponse.products])
      } finally {
        // setIsFilterProductsLoading(false)
      }
    })()
  }, [params, trigger])

  const products = React.useMemo(() => {
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

    return productPages.flatMap(productPage => productPage.data.map(product => ({
      type: "data" as const,
      ...product
    })))

  }, [isLoading, productPages])

  return (
    <FlatList<typeof products[0]>
      numColumns={3}
      data={products}
      onEndReached={getNextProducts}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View>
          <Text style={{ textAlign: "center" }}>No data</Text>
        </View>
      )}
      renderItem={({ item }) => <EachProductItem item={item} />}
    />
  )
}

export default IndividualCategoriesScreen;

const styles = StyleSheet.create({
  tabButton: {
    height: 50,
    width: itemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
