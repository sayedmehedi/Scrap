import React from 'react';
import EachItem from './EachItem';
import { FlatList } from 'react-native';
import { useLazyGetUserOfferNBidsQuery } from '@data/laravel/services/offerNBids';
import { GetOfferNBidsResponse, PaginationQueryParams } from '@src/types';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const OfferAndBidScreen = () => {
  const [getUserOfferNBids, { isLoading, isFetching }] = useLazyGetUserOfferNBidsQuery()
  const [offerNBidPages, setOfferNBidPages] = React.useState<Array<GetOfferNBidsResponse["items"]>>([]);
  const actionCreaterRef = React.useRef<ReturnType<typeof getUserOfferNBids> | null>(null);

  const getNextOfferNBids = async () => {
    if (isFetching) {
      return;
    }

    const lastProductPage = offerNBidPages[offerNBidPages.length - 1]

    if (lastProductPage && !lastProductPage.has_more_data) {
      return;
    }

    const params: PaginationQueryParams = {}

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

    actionCreaterRef.current = getUserOfferNBids(params, true)

    try {
      const productResponse = await actionCreaterRef.current.unwrap()

      setOfferNBidPages(prevPages => {
        return prevPages.concat(productResponse.items)
      })
    } finally {
    }
  }



  React.useEffect(() => {
    const actionCreator: ReturnType<typeof getUserOfferNBids> = getUserOfferNBids({}, true);

    (async () => {
      try {
        const productResponse = await actionCreator.unwrap()

        setOfferNBidPages(() => {
          return [productResponse.items]
        })
      } finally {
      }
    })()

    return () => {

      actionCreator.abort()
    }
  }, [getUserOfferNBids])

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {

        actionCreaterRef.current.abort()
      }
    }
  }, [])

  const offerNBids = React.useMemo(() => {
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

    return offerNBidPages.flatMap(offerNBidPage => offerNBidPage.data)

  }, [isLoading, offerNBidPages])

  return (
    <FlatList<typeof offerNBids[0]>
      data={offerNBids}
      renderItem={({ item }) => {
        if (item.type === "skeleton") {
          return <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item />
          </SkeletonPlaceholder>
        }


        return <EachItem item={item} />
      }}
      onEndReached={getNextOfferNBids}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default OfferAndBidScreen;