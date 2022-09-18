import React from "react";
import {View, Text, FlatList} from "react-native";
import SaleOrArchiveItem from "./SaleOrArchiveItem";
import {
  GetSaleOrArchivedProductsReponse,
  PaginationQueryParams,
} from "@src/types";
import {
  useGetArchiveProductsQuery,
  useLazyGetArchiveProductsQuery,
} from "@data/laravel/services/product";

export default function ArchiveProductList() {
  const [fetchProducts, {isFetching: isFetchingNextPage}] =
    useLazyGetArchiveProductsQuery();
  const {
    data: archivedProductsResponse,
    isLoading,
    isFetching: isFetchingInitial,
  } = useGetArchiveProductsQuery({});

  const [productPages, setProductPages] = React.useState<
    Array<GetSaleOrArchivedProductsReponse["products"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<
    typeof fetchProducts
  > | null>(null);

  React.useEffect(() => {
    if (!isLoading && !!archivedProductsResponse) {
      setProductPages([archivedProductsResponse.products]);
    }
  }, [archivedProductsResponse, isLoading]);

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
    <FlatList<typeof products[0]>
      numColumns={3}
      data={products}
      onEndReached={getNextProducts}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View>
          <Text style={{textAlign: "center"}}>No data</Text>
        </View>
      )}
      renderItem={({item}) => <SaleOrArchiveItem item={item} />}
    />
  );
}
