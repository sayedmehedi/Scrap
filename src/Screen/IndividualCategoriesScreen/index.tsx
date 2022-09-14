import React from 'react';
import { useTheme } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EachProductItem from '../../Component/EachProductItem';
import { HomeStackRoutes, RootStackRoutes } from '@constants/routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLazyGetFilterProductsQuery } from '@data/laravel/services/product';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, Modal } from 'react-native';
import { Condition, FilterProductQueryParams, FilterProductsResponse, HomeStackParamList } from '@src/types';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;


type Props = NativeStackScreenProps<HomeStackParamList, typeof HomeStackRoutes.INDIVIDUAL_CATEGORIES>

const IndividualCategoriesScreen = ({ route, navigation }: Props) => {
  const theme = useTheme()
  const [modalVisible, setModalVisible] = React.useState(false);

  const [location, setLocation] = React.useState<string | null>(null)
  const [distance, setDistance] = React.useState<number | null>(null)
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null)
  const [minPrice, setMinPrice] = React.useState<number | null>(null)
  const [condition, setCondition] = React.useState<Condition | null>(null)
  const [attributeId, setAttributeId] = React.useState<number | null>(null)
  const [sortBy, setSortBy] = React.useState<FilterProductQueryParams["sort_by"]>("oldest")
  const [productType, setProductType] = React.useState<"all" | "is_locale" | "is_shipping">("all")

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTitleStyle: {
        fontSize: 18,
        fontFamily: 'Inter-Bold',
        // @ts-ignore
        color: theme.colors.white,
      },
      // @ts-ignore
      headerTintColor: theme.colors.white,
      title: route.params.categoryTitle,
      headerRight: () => {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              // @ts-ignore
              onPress={() => navigation.navigate(RootStackRoutes.SEARCH_PRODUCT)}
              style={{ padding: 5 }}>
              <AntDesign name="search1" size={25} color={'white'} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{ padding: 5 }}>
              <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
                <Image
                  source={require('@assets/Images/Arrow.png')}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              // @ts-ignore
              onPress={() => navigation.navigate(RootStackRoutes.PRODUCT_FILTER, {
                location,
                distance,
                maxPrice,
                minPrice,
                condition,
                categoryId: route.params.categoryId,
                categoryTitle: route.params.categoryTitle
              })}
              style={{ padding: 5 }}>
              <Image
                style={{ height: 20, width: 20 }}
                source={require('@assets/Images/filter.png')}
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation, route, location,
    distance,
    maxPrice,
    minPrice,
    condition]);

  React.useEffect(() => {
    if (route.params.location) {
      setLocation(route.params.location)
    }

    if (route.params.distance) {
      setDistance(route.params.distance)
    }

    if (route.params.maxPrice) {
      setMaxPrice(route.params.maxPrice)
    }

    if (route.params.minPrice) {
      setMinPrice(route.params.minPrice)
    }

    if (route.params.condition) {
      setCondition(route.params.condition)
    }

    if (route.params.attribute_id) {
      setAttributeId(+route.params.attribute_id)
    }
  }, [route])


  const queryParams = React.useMemo(() => {
    const data: FilterProductQueryParams = {}

    data.sort_by = sortBy;
    data.category_id = route.params.categoryId;

    if (productType === "is_locale") {
      data.is_locale = "1"
    }

    if (productType === "is_shipping") {
      data.is_shipping = "1"
    }

    if (!!location) {
      data.location = location
    }

    if (!!distance) {
      data.distance = distance
    }

    if (!!maxPrice) {
      data.max_price = maxPrice
    }

    if (!!minPrice) {
      data.min_price = minPrice
    }

    if (!!condition) {
      data.condition_id = condition.id
    }

    if (!!attributeId) {
      data.attribute_id = attributeId
    }

    return data;
  }, [route.params.categoryId,
    productType,
    sortBy,
    location,
    distance,
    maxPrice,
    minPrice,
    condition,
    attributeId])

  if (modalVisible) {
    return (
      <View style={styles.centeredView}>
        <Modal
          transparent
          animationType={"slide"}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  alignSelf: 'flex-end',
                  padding: 15,
                }}>
                <Entypo name="cross" size={25} color={'#222222'} />
              </TouchableOpacity>

              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16 }}>
                  Sort By
                </Text>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedColor="gray"
                    uncheckedIcon="circle-o"
                    checkedIcon="dot-circle-o"
                    checked={sortBy === "low_price"}
                    onPress={() => setSortBy("low_price")}
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>Low Price</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedColor="gray"
                    uncheckedIcon="circle-o"
                    checkedIcon="dot-circle-o"
                    checked={sortBy === "high_price"}
                    onPress={() => setSortBy("high_price")}
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>High Price</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedColor="gray"
                    uncheckedIcon="circle-o"
                    checkedIcon="dot-circle-o"
                    checked={sortBy === "oldest"}
                    onPress={() => setSortBy("oldest")}
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>Oldest</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedColor="gray"
                    uncheckedIcon="circle-o"
                    checkedIcon="dot-circle-o"
                    checked={sortBy === "random"}
                    onPress={() => setSortBy("random")}
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>Randomly</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
        {/* <Header from="individualCategory" /> */}

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
  const actionCreaterRef = React.useRef<ReturnType<typeof trigger> | null>(null);


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

    actionCreaterRef.current = trigger(params,)

    try {
      const productResponse = await actionCreaterRef.current.unwrap()

      setProductPages(prevPages => {


        return prevPages.concat(productResponse.products)
      })
    } finally {

    }
  }



  React.useEffect(() => {
    const actionCreator: ReturnType<typeof trigger> = trigger(params, true);

    (async () => {

      try {
        const productResponse = await actionCreator.unwrap()

        setProductPages(() => {


          return [productResponse.products]
        })
      } finally {

      }
    })()

    return () => {

      actionCreator.abort()
    }
  }, [params, trigger])

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {

        actionCreaterRef.current.abort()
      }
    }
  }, [])

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
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    height: 300,
    width: '100%',
    backgroundColor: 'white',
  },
});
