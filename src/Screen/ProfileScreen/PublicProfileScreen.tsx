import React from "react";
import styles from "./styles";
import { Rating } from "react-native-elements";
import { useAppSelector } from "@hooks/store";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import AntDesign from "react-native-vector-icons/AntDesign";
import ProfileImageUploader from "./ProfileImageUploader";
import EachProductItem from "../../Component/EachProductItem";
import { GetSaleOrArchivedProductsReponse, PaginationQueryParams } from "@src/types";
import { FlatList, View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { useGetSaleProductsQuery, useLazyGetSaleProductsQuery } from "@data/laravel/services/product";




const PublicProfileScreen = () => {
  const profile = useAppSelector(state => state.auth.profile)
  const [fetchProducts, { isFetching }] = useLazyGetSaleProductsQuery();
  const { data: saleProductsResponse, isLoading } = useGetSaleProductsQuery({})

  const [productPages, setProductPages] = React.useState<Array<GetSaleOrArchivedProductsReponse["products"]>>([]);
  const actionCreaterRef = React.useRef<ReturnType<typeof fetchProducts> | null>(null);

  React.useEffect(() => {
    if (!isLoading && !!saleProductsResponse) {
      setProductPages([saleProductsResponse.products])
    }
  }, [saleProductsResponse, isLoading])

  const getNextProducts = async () => {
    if (isFetching || isLoading) {
      return;
    }

    const lastProductPage = productPages[productPages.length - 1]

    if (lastProductPage && !lastProductPage.has_more_data) {
      return;
    }

    const params: PaginationQueryParams = {}

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

    actionCreaterRef.current = fetchProducts(params, true)

    try {
      const productResponse = await actionCreaterRef.current.unwrap()

      setProductPages(prevPages => {


        return prevPages.concat(productResponse.products)
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
      <View>
        <FlatList<typeof products[0]>
          onEndReached={getNextProducts}
          ListHeaderComponent={() => (
            <React.Fragment>
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  alignItems: "center",
                  paddingHorizontal: 10,
                }}>
                <ProfileImageUploader />
                <Text style={{ fontFamily: "Inter-Bold", fontSize: 20 }}>
                  {profile?.name}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                  <Rating
                    lock={true}
                    imageSize={15}
                    readonly={true}
                    showRating={false}
                    startingValue={profile?.rating ?? 0}
                  />
                  <Text style={{ marginLeft: 8 }}>({profile?.rating} rating)</Text>
                </View>
                <Text
                  style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#667085", marginVertical: 5 }}>
                  {profile?.location}
                </Text>
                <Text
                  style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#667085", marginBottom: 5 }}>
                  Joined {profile?.joined_date}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                  }}>
                  <View style={{ alignItems: "center", marginRight: 5 }}>
                    <Text>{profile?.total_sold}</Text>
                    <Text>Sold</Text>
                  </View>

                  <View style={{ alignItems: "center", marginLeft: 5 }}>
                    <Text>{profile?.total_purchased}</Text>
                    <Text>Purchased</Text>
                  </View>
                </View>

                <View
                  style={{
                    width: "100%",
                    borderTopWidth: 1,
                    paddingVertical: 10,
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    alignContent: "center",
                    justifyContent: "center",
                    borderTopColor: "#E2E2E2",
                    borderBottomColor: "#E2E2E2",
                  }}>
                  <View style={styles.socialMediaContainer}>
                    <Fontisto name="email" size={20} color={"#707070"} />
                  </View>

                  <View style={styles.socialMediaContainer}>
                    <Fontisto name="email" size={20} color={"#707070"} />
                  </View>
                  <View style={styles.socialMediaContainer}>
                    <Feather name="phone" size={20} color={"#707070"} />
                  </View>
                  <View style={styles.socialMediaContainer}>
                    <Feather name="facebook" size={20} color={"#707070"} />
                  </View>
                </View>

                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: 14,
                    color: "#344054",
                    marginVertical: 10,
                  }}>
                  This Seller Product
                </Text>
              </View>
            </React.Fragment>
          )}
          numColumns={3}
          data={products}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <EachProductItem item={item} />}
        />
      </View>
    </>
  );
};

export default PublicProfileScreen;
