import React from "react";
import dayjs from "dayjs";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {RootStackRoutes} from "@constants/routes";
import {FlatList} from "react-native-gesture-handler";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {Avatar, LinearProgress, Rating} from "react-native-elements";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {View, Text, TextInput, ListRenderItem, StyleSheet} from "react-native";
import {
  Card,
  DefaultTheme,
  Paragraph,
  Title,
  useTheme,
} from "react-native-paper";
import {
  GetSellerReviewsResponse,
  PaginationQueryParams,
  RootStackParamList,
} from "@src/types";
import {
  useCreateSellerReviewMutation,
  useGetSellerReviewsQuery,
  useLazyGetSellerReviewsQuery,
} from "@data/laravel/services/seller";

const flatlistHeaderComponentStyles = StyleSheet.create({
  summaryContainerStyle: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingTextContainerStyle: {marginRight: 10},
  progressContainerSyle: {flex: 1, marginRight: 10},
  ratingTitleStyle: {fontWeight: "700"},
  textinputStyle: {
    borderWidth: 1,
    borderColor: "#191F2B",
    paddingHorizontal: 20,
    borderRadius: DefaultTheme.roundness * 5,
  },
  submitbtnStyle: {justifyContent: "center", paddingVertical: 30},
  cardStyle: {marginVertical: 20},
  textinputContainerStyle: {marginTop: 20},
  ratingContainerStyle: {marginRight: 10},
});

const reviewSummaries = new Array(6)
  .fill(1)
  .map((_, rating) => ({
    rating,
    id: rating + 1,
    progress() {
      return this.rating / 5;
    },
    percentage() {
      return this.progress() * 100;
    },
  }))
  .reverse();

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.SELLER_REVIEW
>;

export default function SellerReviewScreen({route}: Props) {
  const theme = useTheme();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [myRating, setMyRating] = React.useState("");
  const [myReview, setMyReview] = React.useState("");
  const [getSellerReviews, {isFetching: isFetchingNextPage}] =
    useLazyGetSellerReviewsQuery();
  const {
    data: sellerReviewResponse,
    isLoading,
    isFetching: isFetchingInitial,
  } = useGetSellerReviewsQuery({
    sellerId: +route.params.sellerId,
  });
  const actionCreaterRef = React.useRef<ReturnType<
    typeof getSellerReviews
  > | null>(null);
  const [sellerReviewPages, setSellerReviewPages] = React.useState<
    Array<GetSellerReviewsResponse["reviews"]>
  >([]);

  const [createReview, {isLoading: isCreatingReview, isSuccess, data}] =
    useCreateSellerReviewMutation();

  React.useEffect(() => {
    if (!isLoading && !!sellerReviewResponse) {
      setSellerReviewPages([sellerReviewResponse.reviews]);
    }
  }, [sellerReviewResponse, isLoading]);

  React.useEffect(() => {
    if (isSuccess && !!data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
    }
  }, [isSuccess, data, enqueueSuccessSnackbar]);

  const handleSendReview = React.useCallback(() => {
    if (myRating === "") {
      enqueueErrorSnackbar({
        text1: "Invalid data",
        text2: "Please add your rating",
      });
      return;
    }

    createReview({
      rating: +myRating,
      review: myReview,
      seller_id: +route.params.sellerId,
    })
      .unwrap()
      .then(() => {
        setMyRating("");
        setMyReview("");
      });
  }, [createReview, route.params.sellerId, myRating, myReview]);

  const getNextReviews = React.useCallback(async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = sellerReviewPages[sellerReviewPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams & {sellerId: number} = {
      sellerId: +route.params.sellerId,
    };

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = getSellerReviews(params, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();

      setSellerReviewPages(prevPages => {
        return prevPages.concat(productResponse.reviews);
      });
    } finally {
    }
  }, [
    isFetchingNextPage,
    isFetchingInitial,
    sellerReviewPages,
    getSellerReviews,
  ]);

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {
        actionCreaterRef.current.abort();
      }
    };
  }, []);

  const reviews = React.useMemo(() => {
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

    return sellerReviewPages.flatMap(reviewPage =>
      reviewPage.data.map(review => ({
        type: "data" as const,
        ...review,
        created_at: dayjs(review.created_at, "DD MMMM YYYY").fromNow(),
      })),
    );
  }, [isLoading, sellerReviewPages]);

  const ListHeaderComponent = React.useMemo(() => {
    return (
      <React.Fragment>
        <Title style={{fontWeight: "700"}}>Review Summary</Title>

        <Card style={{marginVertical: 20}}>
          <Card.Content>
            {reviewSummaries.map(summary => (
              <View
                key={summary.id}
                style={flatlistHeaderComponentStyles.summaryContainerStyle}>
                <View
                  style={flatlistHeaderComponentStyles.ratingContainerStyle}>
                  <Rating
                    imageSize={15}
                    readonly={true}
                    showRating={false}
                    startingValue={summary.rating}
                  />
                </View>

                <View
                  style={
                    flatlistHeaderComponentStyles.ratingTextContainerStyle
                  }>
                  <Text>({summary.rating})</Text>
                </View>

                <View
                  style={flatlistHeaderComponentStyles.progressContainerSyle}>
                  <LinearProgress
                    color={"#FFB703"}
                    variant={"determinate"}
                    value={summary.progress()}
                  />
                </View>

                <View>
                  <Text>{summary.percentage()}%</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        <Title style={flatlistHeaderComponentStyles.ratingTitleStyle}>
          Your Rating
        </Title>

        <Card style={flatlistHeaderComponentStyles.cardStyle}>
          <Card.Content>
            <Rating
              showRating={false}
              startingValue={myRating}
              onFinishRating={setMyRating}
            />

            <View style={flatlistHeaderComponentStyles.textinputContainerStyle}>
              <TextInput
                multiline
                value={myReview}
                numberOfLines={4}
                textAlignVertical={"top"}
                onChangeText={setMyReview}
                placeholder="Write review"
                style={flatlistHeaderComponentStyles.textinputStyle}
              />
            </View>
          </Card.Content>
          <Card.Actions style={flatlistHeaderComponentStyles.submitbtnStyle}>
            <AppPrimaryButton
              text="Submit"
              onPress={handleSendReview}
              disabled={!myReview || isCreatingReview}
            />
          </Card.Actions>
        </Card>
      </React.Fragment>
    );
  }, [reviewSummaries, handleSendReview, myReview, isCreatingReview]);

  return (
    <MemoizedReviewList
      reviews={reviews}
      getNextReviews={getNextReviews}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

const renderEachReviewItem: ListRenderItem<
  | {
      id: number;
      rating: number;
      review: string;
      user_name: string;
      created_at: string;
      user_image: string;
      type: "data";
    }
  | {
      id: number;
      type: "skeleton";
    }
> = ({item}) => {
  if (item.type === "skeleton") {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item paddingBottom={15}>
          <SkeletonPlaceholder.Item height={100} borderRadius={5} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  }

  return (
    <Card>
      <Card.Title
        title={item.user_name}
        subtitle={item.created_at}
        left={() => (
          <Avatar rounded size={"small"} source={{uri: item.user_image}} />
        )}
        right={() => (
          <View style={{paddingRight: 10}}>
            <Rating
              imageSize={15}
              readonly={true}
              showRating={false}
              startingValue={item.rating}
            />
          </View>
        )}
      />

      <Card.Content>
        <Paragraph>{item.review}</Paragraph>
      </Card.Content>
    </Card>
  );
};

function ReviewList({
  reviews,
  getNextReviews,
  ListHeaderComponent,
}: {
  reviews: Array<
    | {
        id: number;
        rating: number;
        review: string;
        user_name: string;
        created_at: string;
        user_image: string;
        type: "data";
      }
    | {
        id: number;
        type: "skeleton";
      }
  >;
  getNextReviews: () => void;
  ListHeaderComponent: JSX.Element;
}) {
  return (
    <FlatList<typeof reviews[0]>
      data={reviews}
      onEndReached={getNextReviews}
      renderItem={renderEachReviewItem}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={flatlistStyles.contentContainerStyle}
    />
  );
}

const flatlistStyles = StyleSheet.create({
  contentContainerStyle: {
    padding: 10,
  },
});

const MemoizedReviewList = React.memo(ReviewList);

function ItemSeparatorComponent() {
  return <View style={{height: 15}} />;
}
