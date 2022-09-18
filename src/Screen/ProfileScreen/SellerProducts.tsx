import React from "react";
import {View, Text, FlatList} from "react-native";
import EachSellerProduct from "./EachSellerProduct";
import {useLazyGetSaleProductsQuery} from "@data/laravel/services/product";
import {
  FilterProduct,
  GetSaleOrArchivedProductsReponse,
  PaginationQueryParams,
} from "@src/types";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";

export default function SellerProducts({
  onSelect: handleProductSelect,
}: {
  onSelect: (p: FilterProduct) => void;
}) {
  const [getProducts, {isFetching, isLoading}] = useLazyGetSaleProductsQuery();
  const [productPages, setProductPages] = React.useState<
    Array<GetSaleOrArchivedProductsReponse["products"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<typeof getProducts> | null>(
    null,
  );

  const getNextProducts = async () => {
    if (isFetching) {
      return;
    }

    const lastProductPage = productPages[productPages.length - 1];
    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      console.log("atkai disi", lastProductPage.has_more_data);

      return;
    }

    const params: PaginationQueryParams = {};

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
    const actionCreator: ReturnType<typeof getProducts> = getProducts({}, true);

    (async () => {
      try {
        const productResponse = await actionCreator.unwrap();

        setProductPages(() => {
          return [productResponse.products];
        });
      } finally {
      }
    })();

    return () => {
      actionCreator.abort();
    };
  }, [getProducts]);

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
      contentContainerStyle={{
        paddingLeft: SCREEN_PADDING_HORIZONTAL,
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
  );
}
