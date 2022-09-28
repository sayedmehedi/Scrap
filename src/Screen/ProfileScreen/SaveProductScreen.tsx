import React from "react";
import {FlatList, View} from "react-native";
import {ActivityIndicator, Text} from "react-native-paper";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";
import EachProductItem from "../../Component/EachProductItem";
import {GetSavedProductsReponse, PaginationQueryParams} from "@src/types";
import {
  useGetSavedProductsQuery,
  useLazyGetSavedProductsQuery,
} from "@data/laravel/services/product";

const SaveProductScreen = () => {
  const {
    refetch,
    isLoading,
    data: savedProductsResponse,
    isFetching: isFetchingInitial,
  } = useGetSavedProductsQuery({});

  useRefreshOnFocus(refetch);

  const [fetchProducts, {isFetching: isFetchingNextPage}] =
    useLazyGetSavedProductsQuery();

  const [productPages, setProductPages] = React.useState<
    Array<GetSavedProductsReponse["items"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<
    typeof fetchProducts
  > | null>(null);

  React.useEffect(() => {
    if (!isLoading && !!savedProductsResponse) {
      setProductPages([savedProductsResponse.items]);
    }
  }, [savedProductsResponse, isLoading]);

  const getNextProducts = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = productPages[productPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = fetchProducts(params, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();

      setProductPages(prevPages => {
        return prevPages.concat(productResponse.items);
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
    <React.Fragment>
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
        numColumns={3}
        data={products}
        onRefresh={refetch}
        refreshing={isFetchingInitial}
        onEndReached={getNextProducts}
        contentContainerStyle={{padding: 15}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View>
            <Text style={{textAlign: "center"}}>No data</Text>
          </View>
        )}
        renderItem={({item}) => <EachProductItem item={item} />}
      />
    </React.Fragment>
  );
};

export default SaveProductScreen;
