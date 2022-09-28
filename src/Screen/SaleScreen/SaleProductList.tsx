import React from "react";
import {View, Text, FlatList} from "react-native";
import SaleOrArchiveItem from "./SaleOrArchiveItem";
import {
  GetSaleOrArchivedProductsReponse,
  PaginationQueryParams,
} from "@src/types";
import {
  useGetSaleProductsQuery,
  useLazyGetSaleProductsQuery,
} from "@data/laravel/services/product";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import {ActivityIndicator} from "react-native-paper";

export default function SaleProductList({
  ListEmptyComponent,
}: {
  ListEmptyComponent: React.ComponentType;
}) {
  const [fetchProducts, {isFetching: isFetchingNextPage}] =
    useLazyGetSaleProductsQuery();
  const {
    refetch,
    isLoading,
    data: saleProductsResponse,
    isFetching: isFetchingInitial,
  } = useGetSaleProductsQuery({});

  const [productPages, setProductPages] = React.useState<
    Array<GetSaleOrArchivedProductsReponse["products"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<
    typeof fetchProducts
  > | null>(null);

  React.useEffect(() => {
    if (!isLoading && !!saleProductsResponse) {
      setProductPages([saleProductsResponse.products]);
    }
  }, [saleProductsResponse, isLoading]);

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
    <React.Fragment>
      <FlatList<typeof products[0]>
        numColumns={2}
        data={products}
        onRefresh={refetch}
        refreshing={isFetchingInitial}
        onEndReached={getNextProducts}
        columnWrapperStyle={{
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({item}) => <SaleOrArchiveItem item={item} />}
      />

      {isFetchingNextPage ? (
        <View
          style={{
            padding: 10,
            marginBottom: 130,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator size={"small"} />
        </View>
      ) : null}
    </React.Fragment>
  );
}
