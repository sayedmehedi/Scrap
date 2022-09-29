import React from "react";
import {Avatar} from "react-native-elements";
import {
  ChatStackRoutes,
  HomeTabRoutes,
  ProductActionsStackRoutes,
  RootStackRoutes,
} from "@constants/routes";
import useAppSnackbar from "@hooks/useAppSnackbar";
import type {DefaultTheme} from "react-native-paper";
import {ListRenderItem, StyleSheet} from "react-native";
import {Text, Title, useTheme} from "react-native-paper";
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  VirtualizedList,
} from "react-native";
import {
  RootStackParamList,
  GetQuestionsResponse,
  PaginationQueryParams,
  ProductActionsStackParamList,
} from "@src/types";
import {
  useGetQuestionsQuery,
  useLazyGetQuestionsQuery,
  useCreateAskQuestionMutation,
} from "@data/laravel/services/question";
import {useAppSelector} from "@hooks/store";

type Props = NativeStackScreenProps<
  ProductActionsStackParamList,
  typeof ProductActionsStackRoutes.ASK_QUESTION
>;

const renderEachQuestion = ({
  isAskingQuestion,
  handleAskQuestion,
  theme,
}: {
  isAskingQuestion: boolean;
  handleAskQuestion: (question: string) => void;
  theme: typeof DefaultTheme;
}) => {
  const renderer: ListRenderItem<
    | {
        id: number;
        question: string;
        created_at: Date;
        updated_at: Date;
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
  };

  return renderer;
};

const AskQuestionScreen = ({route, navigation}: Props) => {
  const theme = useTheme();
  const rootNavigation = useNavigation();
  const profile = useAppSelector(state => state.auth.profile);
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

  useFocusEffect(
    React.useCallback(() => {
      if (route.params.isInitial) {
        navigation.goBack();
      }
    }, [route.params, navigation]),
  );

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

  const handleAskQuestion = (questionParam: string) => {
    askQuestion({
      message: questionParam,
      product_id: route.params.productId,
      receiver_id: route.params.sellerId,
    })
      .unwrap()
      .then(data => {
        if ("success" in data) {
          rootNavigation.navigate(RootStackRoutes.HOME, {
            screen: HomeTabRoutes.CHAT,
            params: {
              screen: ChatStackRoutes.SINGLE_CONVERSATION,
              params: {
                userName: profile!.name,
                userId: route.params.sellerId,
                userImage: profile!.profile_image,
                productId: route.params.productId,
                productPrice: route.params.productPrice,
                productImage: route.params.productImage,
              },
            },
          });
        }
      });
  };

  const getNextQuestions = React.useCallback(async () => {
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
  }, [questionPages, isFetchingNextPage, isFetchingInitial, getQuestions]);

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

  return (
    <VirtualizedList<typeof questions[0]>
      data={questions}
      getItemCount={(items: typeof questions) => items.length}
      getItem={(items: typeof questions, index) => items[index]}
      renderItem={renderEachQuestion({
        theme,
        isAskingQuestion,
        handleAskQuestion,
      })}
      keyboardDismissMode={"none"}
      onEndReached={getNextQuestions}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      // @ts-ignore
      ItemSeparatorComponent={ItemSeparatorComponent}
      contentContainerStyle={quesFlatlistStyle.contentContainerStyle}
      ListFooterComponentStyle={quesFlatlistStyle.listFooterComponentStyle}
    />
  );
};

const quesFlatlistStyle = StyleSheet.create({
  contentContainerStyle: {
    padding: 15,
  },
  listFooterComponentStyle: {
    marginTop: 15,
  },
});

const ItemSeparatorComponent = () => {
  return <View style={{height: 15}} />;
};

const ListEmptyComponent = () => {
  return (
    <View>
      <Text style={{textAlign: "center"}}>No data</Text>
    </View>
  );
};

function ListHeaderComponent() {
  const theme = useTheme();
  const route =
    useRoute<
      RouteProp<
        ProductActionsStackParamList,
        typeof ProductActionsStackRoutes.ASK_QUESTION
      >
    >();

  return (
    <React.Fragment>
      <View
        style={{
          padding: 15,
          alignItems: "center",
          flexDirection: "row",
          borderRadius: theme.roundness * 2,
          backgroundColor: theme.colors.white,
        }}>
        <View>
          <Image
            source={{uri: route.params.productImage}}
            style={{
              height: 67,
              width: 67,
              borderRadius: theme.roundness,
            }}
          />
        </View>

        <View style={{flex: 1, paddingHorizontal: 15}}>
          <Text style={{fontWeight: "700", fontSize: 18}}>
            {route.params.productName}
          </Text>
        </View>

        <View style={{alignItems:'center'}}>
          <Avatar
            rounded
            size={"large"}
            source={{uri: route.params.sellerImage}}
          />

          <Text style={{fontSize: 13, marginTop: 5}}>
            {route.params.sellerName}
          </Text>
        </View>
      </View>

      <Title
        style={{
          maxWidth: "70%",
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginVertical: 25,
          fontWeight:'700',
          fontSize:22
        }}>
        Click a message to send or write your own question
      </Title>
    </React.Fragment>
  );
}

function ListFooterComponent() {
  const theme = useTheme();
  const rootNavigation = useNavigation();
  const [question, setQuestion] = React.useState("");
  const profile = useAppSelector(state => state.auth.profile);
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const route =
    useRoute<
      RouteProp<
        ProductActionsStackParamList,
        typeof ProductActionsStackRoutes.ASK_QUESTION
      >
    >();

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

  const handleAskQuestion = () => {
    askQuestion({
      message: question,
      product_id: +route.params.productId,
      receiver_id: +route.params.sellerId,
    })
      .unwrap()
      .then(data => {
        setQuestion("");

        if ("success" in data) {
          rootNavigation.navigate(RootStackRoutes.HOME, {
            screen: HomeTabRoutes.CHAT,
            params: {
              screen: ChatStackRoutes.SINGLE_CONVERSATION,
              params: {
                userName: profile!.name,
                userId: route.params.sellerId,
                userImage: profile!.profile_image,
                productId: route.params.productId,
                productPrice: route.params.productPrice,
                productImage: route.params.productImage,
              },
            },
          });
        }
      });
  };

  return (
    <View>
      <TextInput
        multiline
        value={question}
        numberOfLines={6}
        textAlign={"center"}
        textAlignVertical={"top"}
        onChangeText={setQuestion}
        placeholder="Write your message"
        style={{
          borderWidth: 1,
          borderColor: "#191F2B",
          borderRadius: theme.roundness * 3,
        }}
      />

      <View style={{marginTop: 30, marginBottom: 25}}>
        <AppPrimaryButton
          text={"Send Message"}
          onPress={() => handleAskQuestion()}
          disabled={!question || isAskingQuestion}
        />
      </View>
    </View>
  );
}

export default AskQuestionScreen;
