import React from 'react';
import EachPurchases from './EachPurchases';
import { View, FlatList } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { GetPurchaseHistoryResponse, PaginationQueryParams } from '@src/types';
import { useGetPurchaseHistoryQuery, useLazyGetPurchaseHistoryQuery } from '@data/laravel/services/order';

const PurchasesScreen = () => {
  const [getPurchaseHistory, { isFetching }] = useLazyGetPurchaseHistoryQuery()
  const { data: purchaseHistoryResponse, isLoading } = useGetPurchaseHistoryQuery({});
  const [purchaseHistoryPages, setPurchaseHistoryPages] = React.useState<Array<GetPurchaseHistoryResponse["orders"]>>([]);
  const actionCreaterRef = React.useRef<ReturnType<typeof getPurchaseHistory> | null>(null);


  React.useEffect(() => {
    if (!isLoading && !!purchaseHistoryResponse) {
      setPurchaseHistoryPages([purchaseHistoryResponse.orders])
    }
  }, [purchaseHistoryResponse])

  const getNextPurchaseHistory = async () => {
    if (isFetching || isLoading) {
      return;
    }

    const lastProductPage = purchaseHistoryPages[purchaseHistoryPages.length - 1]

    if (lastProductPage && !lastProductPage.has_more_data) {
      return;
    }

    const params: PaginationQueryParams = {}

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

    actionCreaterRef.current = getPurchaseHistory(params, true)

    try {
      const productResponse = await actionCreaterRef.current.unwrap()

      setPurchaseHistoryPages(prevPages => {
        return prevPages.concat(productResponse.orders)
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

  const purchaseHistories = React.useMemo(() => {
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

    return purchaseHistoryResponse?.orders.data.map(ord => ({
      type: "data" as const,
      ...ord
    })) ?? []
  }, [isLoading, purchaseHistoryResponse])

  return (
    <>
      <View>
        <FlatList<typeof purchaseHistories[0]>
          data={purchaseHistories}
          onEndReached={getNextPurchaseHistory}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === "skeleton") {
              return (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item paddingBottom={15}>
                    <SkeletonPlaceholder.Item height={100} borderRadius={5} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              )
            }

            return <EachPurchases item={item} />
          }}
        />
      </View>
    </>
  );
};

export default PurchasesScreen;
