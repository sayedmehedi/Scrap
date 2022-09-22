import React from "react";
import truncate from "lodash.truncate";
import {CheckBox} from "react-native-elements";
import {useAppSelector} from "@hooks/store";
import Entypo from "react-native-vector-icons/Entypo";
import {useNavigation} from "@react-navigation/native";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";
import AntDesign from "react-native-vector-icons/AntDesign";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import EachProductItem from "../../Component/EachProductItem";
import {ActivityIndicator, useTheme} from "react-native-paper";
import {HomeStackRoutes, RootStackRoutes} from "@constants/routes";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  useGetFilterProductsQuery,
  useLazyGetFilterProductsQuery,
} from "@data/laravel/services/product";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  Condition,
  FilterProductQueryParams,
  FilterProductsResponse,
  HomeStackParamList,
} from "@src/types";

const {width} = Dimensions.get("window");
const itemWidth = width / 3;

type Props = NativeStackScreenProps<
  HomeStackParamList,
  typeof HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA
>;

const ProductisListByCriteriaScreen = ({route, navigation}: Props) => {
  const theme = useTheme();
  const rootNavigation = useNavigation();
  const profile = useAppSelector(state => state.auth.profile);
  const [distance, setDistance] = React.useState<number>(30);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [location, setLocation] = React.useState<string | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [minPrice, setMinPrice] = React.useState<number | null>(null);
  const [hideFilterActions, setHideFilterActions] = React.useState(false);
  const [condition, setCondition] = React.useState<Condition | null>(null);
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [subcategoryId, setSubcategoryId] = React.useState<number | null>(null);
  const [attributes, setAttributes] = React.useState<Record<
    number,
    number
  > | null>(null);
  const [sortBy, setSortBy] =
    React.useState<FilterProductQueryParams["sort_by"]>("oldest");
  const [productType, setProductType] = React.useState<
    "all" | "is_locale" | "is_shipping"
  >("all");

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      // @ts-ignore
      headerTitleContainerStyle: {
        marginLeft: -5,
      },
      headerTitleStyle: {
        fontSize: 18,
        fontFamily: "Inter-Bold",
        // @ts-ignore
        color: theme.colors.white,
      },
      // @ts-ignore
      headerTintColor: theme.colors.white,
      title: truncate(route.params.screenTitle, {
        length: 20,
      }),
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingEnd: 10,
            }}>
            <TouchableOpacity
              // @ts-ignore
              onPress={() =>
                rootNavigation.navigate(RootStackRoutes.SEARCH_PRODUCT)
              }
              style={{padding: 5}}>
              <AntDesign name="search1" size={25} color={"white"} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={{padding: 5}}>
              <View style={{flexDirection: "row", paddingHorizontal: 10}}>
                <Image
                  source={require("@assets/Images/Arrow.png")}
                  style={{
                    height: 20,
                    width: 20,
                  }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              // @ts-ignore
              onPress={() =>
                rootNavigation.navigate(RootStackRoutes.PRODUCT_FILTER, {
                  distance,
                  location: location ?? undefined,
                  maxPrice: maxPrice ?? undefined,
                  minPrice: minPrice ?? undefined,
                  condition: condition ?? undefined,
                  categoryId: route.params.categoryId,
                  categoryTitle: route.params.screenTitle,
                })
              }
              style={{padding: 5}}>
              <Image
                style={{height: 20, width: 20}}
                source={require("@assets/Images/filter.png")}
              />
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [navigation, route, location, distance, maxPrice, minPrice, condition]);

  React.useEffect(() => {
    if (route.params.location) {
      setLocation(route.params.location);
    } else if (profile?.location) {
      setLocation(profile.location);
    }

    if (route.params.distance) {
      setDistance(route.params.distance);
    }

    if (route.params.maxPrice) {
      setMaxPrice(route.params.maxPrice);
    }

    if (route.params.minPrice) {
      setMinPrice(route.params.minPrice);
    }

    if (route.params.condition) {
      setCondition(route.params.condition);
    }

    if (route.params.attributes) {
      setAttributes(route.params.attributes);
    }

    if (route.params.isShipping) {
      setProductType("is_shipping");
    }

    if (route.params.isLocale) {
      setProductType("is_locale");
    }

    if (route.params.categoryId) {
      setCategoryId(route.params.categoryId);
    }

    if (route.params.subcategoryId) {
      setSubcategoryId(route.params.subcategoryId);
    }

    if (route.params.hideFilterActions) {
      setHideFilterActions(route.params.hideFilterActions);
    }
  }, [route, profile]);

  const queryParams = React.useMemo(() => {
    const data: FilterProductQueryParams = {};

    data.sort_by = sortBy;

    if (productType === "is_locale") {
      data.is_locale = "1";
    }

    if (productType === "is_shipping") {
      data.is_shipping = "1";
    }

    if (!!location) {
      data.location = location;
    }

    if (!!subcategoryId) {
      data.sub_category_id = subcategoryId;
    }

    if (!!categoryId) {
      data.category_id = categoryId;
    }

    if (!!distance) {
      data.distance = distance;
    }

    if (!!maxPrice) {
      data.max_price = maxPrice;
    }

    if (!!minPrice) {
      data.min_price = minPrice;
    }

    if (!!condition) {
      data.condition_id = condition.id;
    }

    if (!!attributes) {
      data.attributes = attributes;
    }

    return data;
  }, [
    sortBy,
    location,
    distance,
    maxPrice,
    minPrice,
    condition,
    categoryId,
    attributes,
    productType,
    subcategoryId,
  ]);

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
                  alignSelf: "flex-end",
                  padding: 15,
                }}>
                <Entypo name="cross" size={25} color={"#222222"} />
              </TouchableOpacity>

              <View style={{alignItems: "center"}}>
                <Text style={{fontFamily: "Inter-SemiBold", fontSize: 16}}>
                  Sort By
                </Text>
              </View>

              <View style={{padding: 20}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
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
                <View style={{flexDirection: "row", alignItems: "center"}}>
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
                <View style={{flexDirection: "row", alignItems: "center"}}>
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

                <View style={{flexDirection: "row", alignItems: "center"}}>
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
      <View style={{flex: 1, backgroundColor: "#F7F7F7"}}>
        {!hideFilterActions && (
          <View style={{flexDirection: "row"}}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    productType === "all" ? "#191F2B" : "#E6E6E6",
                },
              ]}
              onPress={() => setProductType("all")}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-SemiBold",
                  color: productType === "all" ? "white" : "#191F2B",
                }}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    productType === "is_locale" ? "#191F2B" : "#E6E6E6",
                },
              ]}
              onPress={() => setProductType("is_locale")}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-SemiBold",
                  color: productType === "is_locale" ? "white" : "#191F2B",
                }}>
                Local PickUp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    productType === "is_shipping" ? "#191F2B" : "#E6E6E6",
                },
              ]}
              onPress={() => setProductType("is_shipping")}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Inter-SemiBold",
                  color: productType === "is_shipping" ? "white" : "#191F2B",
                }}>
                Shipping
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
            alignSelf: "center",
          }}>
          {productType === "is_shipping" ? (
            <Image
              resizeMode={"contain"}
              style={{height: 18, width: 18}}
              source={require("@assets/Images/van.png")}
            />
          ) : (
            <Image
              resizeMode={"contain"}
              style={{height: 18, width: 18}}
              source={require("@assets/Images/map1.png")}
            />
          )}
          {productType === "all" ? (
            <Text
              style={{
                fontSize: 14,
                marginLeft: 10,
                color: "#111111",
                fontFamily: "Inter-Regular",
              }}>
              {!!location ? `${location}, ` : ""}
              {distance} Miles + Shipping
            </Text>
          ) : productType === "is_locale" ? (
            <Text
              style={{
                fontSize: 14,
                marginLeft: 10,
                color: "#111111",
                fontFamily: "Inter-Regular",
              }}>
              {!!location ? `${location}, ` : ""}
              {distance} Miles
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 14,
                marginLeft: 10,
                color: "#111111",
                fontFamily: "Inter-Regular",
              }}>
              Shipping
            </Text>
          )}
        </View>

        <ProductList params={queryParams} />
      </View>
    </>
  );
};

const ProductList = ({params = {}}: {params?: FilterProductQueryParams}) => {
  const [trigger, {isFetching: isFetchingNextPage}] =
    useLazyGetFilterProductsQuery();
  const actionCreaterRef = React.useRef<ReturnType<typeof trigger> | null>(
    null,
  );
  const {
    refetch,
    isLoading,
    data: filterProductsResponse,
    isFetching: isFetchingInitial,
  } = useGetFilterProductsQuery(params);
  const [productPages, setProductPages] = React.useState<
    Array<FilterProductsResponse["products"]>
  >([]);

  useRefreshOnFocus(refetch);

  React.useEffect(() => {
    if (!isLoading && !!filterProductsResponse) {
      setProductPages(() => {
        return [filterProductsResponse.products];
      });
    }
  }, [filterProductsResponse, isLoading]);

  const getNextProducts = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = productPages[productPages.length - 1];

    if (
      !lastProductPage ||
      (!!lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const newParams = {
      ...params,
      page: lastProductPage.current_page + 1,
    };

    actionCreaterRef.current = trigger(newParams, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();
      setProductPages(prevPages => {
        return prevPages.concat(productResponse.products);
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

  const products = React.useMemo(() => {
    if (isLoading || productPages.length === 0) {
      return [
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
      ];
    }

    return productPages.flatMap(productPage =>
      productPage.data.map(product => ({
        type: "data" as const,
        ...product,
      })),
    );
  }, [isLoading, productPages]);

  return (
    <React.Fragment>
      <FlatList<typeof products[0]>
        numColumns={3}
        data={products}
        contentContainerStyle={{
          paddingLeft: SCREEN_PADDING_HORIZONTAL,
        }}
        columnWrapperStyle={{
          marginBottom: 20,
        }}
        onEndReached={getNextProducts}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View>
            <Text style={{textAlign: "center"}}>No data</Text>
          </View>
        )}
        renderItem={({item}) => <EachProductItem item={item} />}
      />

      {isFetchingNextPage ? (
        <View
          style={{
            padding: 50,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator size={"small"} />
        </View>
      ) : null}
    </React.Fragment>
  );
};

export default ProductisListByCriteriaScreen;

const styles = StyleSheet.create({
  tabButton: {
    height: 50,
    width: itemWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalView: {
    height: 300,
    width: "100%",
    backgroundColor: "white",
  },
});
