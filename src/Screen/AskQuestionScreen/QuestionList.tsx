import React from "react";
import {useTheme} from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {FlatList} from "react-native-gesture-handler";
import {View, Text, TouchableOpacity} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {GetQuestionsResponse, PaginationQueryParams} from "@src/types";
import {
  useCreateAskQuestionMutation,
  useGetQuestionsQuery,
  useLazyGetQuestionsQuery,
} from "@data/laravel/services/question";

interface Props {
  sellerId: number;
  productId: number;
  ListHeaderComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  ListFooterComponent?:
    | React.ComponentType<any>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

export default function QuestionList({
  productId,
  sellerId,
  ListHeaderComponent,
  ListFooterComponent,
}: Props) {
  const theme = useTheme();
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [getQuestions, {isFetching: isFetchingNextPage}] =
    useLazyGetQuestionsQuery();
  const {
    data: getQuestionsResponse,
    isLoading,
    isFetching: isFetchingInitial,
  } = useGetQuestionsQuery({});
  const actionCreaterRef = React.useRef<ReturnType<typeof getQuestions> | null>(
    null,
  );
  const [questionPages, setQuestionPages] = React.useState<
    Array<GetQuestionsResponse["items"]>
  >([]);
  const [
    askQuestion,
    {
      data: askQuestionData,
      isLoading: isAskingQuestion,
      isSuccess: isAskQuestionSuccess,
    },
  ] = useCreateAskQuestionMutation();

  React.useEffect(() => {
    if (
      isAskQuestionSuccess &&
      !!askQuestionData &&
      "success" in askQuestionData
    ) {
      enqueueSuccessSnackbar({
        text1: "Success",
        text2: askQuestionData.success,
      });
    }

    if (
      isAskQuestionSuccess &&
      !!askQuestionData &&
      "error" in askQuestionData
    ) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: askQuestionData.error,
      });
    }
  }, [
    askQuestionData,
    isAskQuestionSuccess,
    enqueueErrorSnackbar,
    enqueueSuccessSnackbar,
  ]);

  React.useEffect(() => {
    if (!isLoading && !!getQuestionsResponse) {
      setQuestionPages(() => {
        return [getQuestionsResponse.items];
      });
    }
  }, [getQuestionsResponse, isLoading]);

  const getNextQuestions = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = questionPages[questionPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage &&
        lastProductPage.current_page === lastProductPage.last_page)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = getQuestions(params, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();

      setQuestionPages(prevPages => {
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

  const questions = React.useMemo(() => {
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

    return questionPages.flatMap(questionPage =>
      questionPage.data.map(question => ({
        type: "data" as const,
        ...question,
      })),
    );
  }, [isLoading, questionPages]);

  const handleAskQuestion = (question: string) => {
    askQuestion({
      message: question,
      product_id: productId,
      receiver_id: sellerId,
    });
  };

  return (
    <FlatList<typeof questions[0]>
      data={questions}
      keyboardDismissMode={"none"}
      onEndReached={getNextQuestions}
      keyboardShouldPersistTaps={"always"}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding: 15}}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListFooterComponentStyle={{marginTop: 15}}
      ListEmptyComponent={() => (
        <View>
          <Text style={{textAlign: "center"}}>No data</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{height: 15}} />}
      renderItem={({item}) => {
        if (item.type === "skeleton") {
          return (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item paddingBottom={15}>
                <SkeletonPlaceholder.Item height={50} borderRadius={5} />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          );
        }

        return (
          <TouchableOpacity
            disabled={isAskingQuestion}
            onPress={handleAskQuestion.bind(null, item.question)}>
            <View
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: "red",
                borderRadius: theme.roundness * 4,
              }}>
              <Text style={{fontSize: 16, textAlign: "center"}}>
                {item.question}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
}
