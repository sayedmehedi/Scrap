import React from "react";
import styles from "./styles";
import {Rating} from "react-native-elements";
import {ProfileStackRoutes} from "@constants/routes";
import {FlatList, View, Text} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";
import ProfileImageUploader from "./ProfileImageUploader";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import EachProductItem from "../../Component/EachProductItem";
import {ActivityIndicator, useTheme} from "react-native-paper";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  PaginationQueryParams,
  GetSaleOrArchivedProductsReponse,
  ProfileStackParamList,
} from "@src/types";
import {
  useGetSellerProductsQuery,
  useLazyGetSellerProductsQuery,
} from "@data/laravel/services/product";
import {useAppSelector} from "@hooks/store";

type Props = NativeStackScreenProps<
  ProfileStackParamList,
  typeof ProfileStackRoutes.PUBLIC_PROFILE
>;

const PublicProfileScreen = ({route}: Props) => {
  const profile = useAppSelector(state => state.auth.profile);

  const [fetchProducts, {isFetching: isFetchingNextPage}] =
    useLazyGetSellerProductsQuery();
  const {
    refetch,
    isLoading,
    data: sellerProductsResponse,
    isFetching: isFetchingInitial,
  } = useGetSellerProductsQuery(
    {
      user_id: profile?.id ?? 0,
    },
    {
      skip: !profile,
    },
  );

  useRefreshOnFocus(refetch);

  const [productPages, setProductPages] = React.useState<
    Array<GetSaleOrArchivedProductsReponse["products"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<
    typeof fetchProducts
  > | null>(null);

  React.useEffect(() => {
    if (!isLoading && !!sellerProductsResponse) {
      setProductPages([sellerProductsResponse.products]);
    }
  }, [sellerProductsResponse, isLoading]);

  const getNextProducts = async () => {
    if (isFetchingNextPage || isFetchingInitial || !profile) {
      return;
    }

    const lastProductPage = productPages[productPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams & {
      user_id: number;
    } = {
      user_id: profile.id,
    };

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = fetchProducts(params, true);

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
    if (isLoading) {
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
    <>
      <View>
        {isFetchingNextPage ? (
          <View
            style={{
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <ActivityIndicator size={"small"} />
          </View>
        ) : null}

        <FlatList<typeof products[0]>
          onEndReached={getNextProducts}
          contentContainerStyle={{
            padding: SCREEN_PADDING_HORIZONTAL,
          }}
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
                <Text style={{fontFamily: "Inter-Bold", fontSize: 20}}>
                  {profile?.name}
                </Text>
                <View
                  style={{
                    marginVertical: 5,
                    alignItems: "center",
                    flexDirection: "row",
                  }}>
                  <Rating
                    imageSize={15}
                    readonly={true}
                    showRating={false}
                    startingValue={profile?.rating ?? 0}
                  />
                  <Text style={{marginLeft: 8}}>
                    ({profile?.rating} rating)
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 12,
                    color: "#667085",
                    marginVertical: 5,
                  }}>
                  {profile?.location}
                </Text>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 12,
                    color: "#667085",
                    marginBottom: 5,
                  }}>
                  Joined {profile?.joined_date}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 10,
                  }}>
                  <View style={{alignItems: "center", marginRight: 5}}>
                    <Text>{profile?.total_sold}</Text>
                    <Text>Sold</Text>
                  </View>

                  <View style={{alignItems: "center", marginLeft: 5}}>
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
                  <View
                    style={[
                      styles.socialMediaContainer,
                      {
                        backgroundColor: profile?.is_email_verified
                          ? "red"
                          : "#D0D0D0",
                      },
                    ]}>
                    <Fontisto
                      name="email"
                      size={20}
                      color={profile?.is_email_verified ? "white" : "#707070"}
                    />
                  </View>

                  <View
                    style={[
                      styles.socialMediaContainer,
                      {
                        backgroundColor: profile?.is_phone_verfied
                          ? "red"
                          : "#D0D0D0",
                      },
                    ]}>
                    <Feather
                      name="phone"
                      size={20}
                      color={profile?.is_phone_verfied ? "white" : "#707070"}
                    />
                  </View>

                  <View
                    style={[
                      styles.socialMediaContainer,
                      {
                        backgroundColor: profile?.is_fb_connected
                          ? "red"
                          : "#D0D0D0",
                      },
                    ]}>
                    <Feather
                      name="facebook"
                      size={20}
                      color={profile?.is_fb_connected ? "white" : "#707070"}
                    />
                  </View>
                </View>

                <Text
                  style={{
                    fontFamily: "Inter-SemiBold",
                    fontSize: 14,
                    color: "#344054",
                    marginVertical: 10,
                  }}>
                  Seller Products
                </Text>
              </View>
            </React.Fragment>
          )}
          numColumns={3}
          data={products}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <EachProductItem item={item} />}
        />
      </View>
    </>
  );
};

export default PublicProfileScreen;
