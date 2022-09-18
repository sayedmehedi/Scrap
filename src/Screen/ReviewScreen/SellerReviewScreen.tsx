import React from "react";
import dayjs from "dayjs";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {RootStackRoutes} from "@constants/routes";
import {View, Text, TextInput} from "react-native";
import {FlatList} from "react-native-gesture-handler";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {Card, Paragraph, Title, useTheme} from "react-native-paper";
import {Avatar, LinearProgress, Rating} from "react-native-elements";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  GetSellerReviewsResponse,
  PaginationQueryParams,
  RootStackParamList,
  SellerReview,
} from "@src/types";
import {
  useCreateSellerReviewMutation,
  useGetSellerReviewsQuery,
  useLazyGetSellerReviewsQuery,
} from "@data/laravel/services/seller";

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
  const {enqueueSuccessSnackbar} = useAppSnackbar();
  const [myRating, setMyRating] = React.useState(0);
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

  const handleSendReview = () => {
    createReview({
      rating: myRating,
      review: myReview,
      seller_id: +route.params.sellerId,
    })
      .unwrap()
      .then(() => {
        setMyRating(0);
        setMyReview("");
      });
  };

  const getNextReviews = async () => {
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
  };

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
      })),
    );
  }, [isLoading, sellerReviewPages]);

  return (
    <FlatList<typeof reviews[0]>
      contentContainerStyle={{
        padding: 10,
      }}
      onEndReached={getNextReviews}
      ListHeaderComponent={() => (
        <React.Fragment>
          <Title style={{fontWeight: "700"}}>Review Summary</Title>

          <Card style={{marginVertical: 20}}>
            <Card.Content>
              {reviewSummaries.map(summary => (
                <View
                  key={summary.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 15,
                  }}>
                  <View style={{marginRight: 10}}>
                    <Rating
                      imageSize={15}
                      readonly={true}
                      showRating={false}
                      startingValue={summary.rating}
                    />
                  </View>

                  <View style={{marginRight: 10}}>
                    <Text>({summary.rating})</Text>
                  </View>

                  <View style={{flex: 1, marginRight: 10}}>
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

          <Title style={{fontWeight: "700"}}>Your Rating</Title>

          <Card style={{marginVertical: 20}}>
            <Card.Content>
              <Rating
                showRating={false}
                startingValue={myRating}
                onFinishRating={setMyRating}
              />

              <View style={{marginTop: 20}}>
                <TextInput
                  multiline
                  value={myReview}
                  numberOfLines={4}
                  textAlignVertical={"top"}
                  onChangeText={setMyReview}
                  placeholder="Write review"
                  style={{
                    borderWidth: 1,
                    borderColor: "#191F2B",
                    paddingHorizontal: 20,
                    borderRadius: theme.roundness * 5,
                  }}
                />
              </View>
            </Card.Content>
            <Card.Actions
              style={{justifyContent: "center", paddingVertical: 30}}>
              <AppPrimaryButton
                onPress={handleSendReview}
                disabled={!myReview || isCreatingReview}
                text="Submit"
              />
            </Card.Actions>
          </Card>
        </React.Fragment>
      )}
      data={reviews}
      ItemSeparatorComponent={() => <View style={{height: 15}} />}
      renderItem={({item}) => {
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
              subtitle={dayjs(item.created_at, "DD MMMM YYYY").fromNow()}
              left={() => (
                <Avatar
                  rounded
                  size={"small"}
                  source={{uri: item.user_image}}
                />
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
      }}
    />
  );
}
