import React from 'react';
import { Text } from 'react-native-paper';
import { GetSavedProductsReponse, PaginationQueryParams } from '@src/types';
import { FlatList, View } from 'react-native';
import EachProductItem from '../../Component/EachProductItem';
import { useLazyGetSavedProductsQuery } from '@data/laravel/services/product';


const SaveProductScreen = () => {
  const [fetchProducts, { isLoading, isFetching }] = useLazyGetSavedProductsQuery();

  const [productPages, setProductPages] = React.useState<Array<GetSavedProductsReponse["items"]>>([]);
  const actionCreaterRef = React.useRef<ReturnType<typeof fetchProducts> | null>(null);

  const getNextProducts = async () => {
    if (isFetching) {
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
        return prevPages.concat(productResponse.items)
      })
    } finally {

    }
  }


  React.useEffect(() => {
    const actionCreator: ReturnType<typeof fetchProducts> = fetchProducts({}, true);

    (async () => {

      try {
        const productResponse = await actionCreator.unwrap()

        setProductPages(() => {
          return [productResponse.items]
        })
      } finally {

      }
    })()

    return () => {

      actionCreator.abort()
    }
  }, [fetchProducts])

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
      contentContainerStyle={{ padding: 15 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <View>
          <Text style={{ textAlign: "center" }}>No data</Text>
        </View>
      )}
      renderItem={({ item }) => <EachProductItem item={item} />}
    />
  )
};

export default SaveProductScreen;
