import React from "react";
import EachProductItem from "../../Component/EachProductItem";
import { View, Text, StyleSheet, FlatList } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { FilterProductQueryParams, FilterProductsResponse } from "@src/types";
import { useLazyGetFilterProductsQuery } from "@data/laravel/services/product";

const ShippingScreen = () => {
  const [trigger, { isFetching, isLoading }] = useLazyGetFilterProductsQuery();
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

    const params: FilterProductQueryParams = {
      is_shipping: "1"
    }

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

    actionCreaterRef.current = trigger(params, true)

    try {
      const productResponse = await actionCreaterRef.current.unwrap()

      setProductPages(prevPages => {


        return prevPages.concat(productResponse.products)
      })
    } finally {
      // setIsFilterProductsLoading(false)
    }
  }



  React.useEffect(() => {
    const actionCreator: ReturnType<typeof trigger> = trigger({
      is_shipping: "1"
    }, true);

    (async () => {
      // setIsFilterProductsLoading(true)
      try {
        const productResponse = await actionCreator.unwrap()

        setProductPages(() => {


          return [productResponse.products]
        })
      } finally {
        // setIsFilterProductsLoading(false)
      }
    })()

    return () => {

      actionCreator.abort()
    }
  }, [trigger])

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
    <>
      <View style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 15,
            alignSelf: "center",
          }}>
          <FontAwesome5 name="shuttle-van" size={18} color={"#111111"} />
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 14,
              color: "#111111",
              marginLeft: 5,
            }}>
            Shipping
          </Text>
        </View>

        <FlatList<typeof products[0]>
          numColumns={3}
          data={products}
          onEndReached={getNextProducts}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <EachProductItem item={item} />}
        />
      </View>
    </>
  );
};

export default ShippingScreen;

const styles = StyleSheet.create({});
