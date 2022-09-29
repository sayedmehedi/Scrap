import React from "react";
import {View, Text, FlatList} from "react-native";
import EachSellerProduct from "./EachSellerProduct";
import {
  useGetSellerProductsQuery,
  useLazyGetSellerProductsQuery,
} from "@data/laravel/services/product";
import {
  FilterProduct,
  GetSaleOrArchivedProductsReponse,
  PaginationQueryParams,
} from "@src/types";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import {ActivityIndicator} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";

export default function SellerProducts({
  onSelect: handleProductSelect,
}: {
  onSelect: (p: FilterProduct) => void;
}) {
  const profile = useAppSelector(state => state.auth.profile);
  const {
    refetch,
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

  const [getProducts, {isFetching: isFetchingNext}] =
    useLazyGetSellerProductsQuery();
  const [productPages, setProductPages] = React.useState<
    Array<GetSaleOrArchivedProductsReponse["products"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<typeof getProducts> | null>(
    null,
  );

  React.useEffect(() => {
    if (!!sellerProductsResponse) {
      setProductPages([sellerProductsResponse.products]);
    }
  }, [sellerProductsResponse]);

  const getNextProducts = async () => {
    if (isFetchingNext) {
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
      user_id: profile?.id ?? 0,
    };

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = getProducts(params, true);

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
    if (isFetchingInitial) {
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
  }, [isFetchingInitial, productPages]);

  return (
    <View style={{}}>
      <FlatList<typeof products[0]>
        numColumns={3}
        data={products}
        onRefresh={refetch}
        refreshing={isFetchingInitial}
        onEndReached={getNextProducts}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: SCREEN_PADDING_HORIZONTAL,
          paddingBottom:90
        }}
        columnWrapperStyle={{
         
          marginBottom: 20,
        }}
        ListEmptyComponent={() => (
          <View>
            <Text style={{textAlign: "center"}}>No data</Text>
          </View>
        )}
        renderItem={({item}) => (
          <EachSellerProduct item={item} onSelect={handleProductSelect} />
        )}
      />

      {isFetchingNext ? (
        <View
          style={{
            padding: 10,

            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator size={"small"} />
        </View>
      ) : null}
    </View>
  );
}
