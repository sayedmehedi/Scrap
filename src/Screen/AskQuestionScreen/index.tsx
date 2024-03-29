import React from "react";
import QuestionList from "./QuestionList";
import {Avatar} from "react-native-elements";
import {RootStackParamList} from "@src/types";
import {RootStackRoutes} from "@constants/routes";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Text, Title, useTheme} from "react-native-paper";
import {View, Image, TextInput, FlatList} from "react-native";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useCreateAskQuestionMutation} from "@data/laravel/services/question";
import {ScrollView} from "react-native-gesture-handler";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.ASK_QUESTION
>;

const AskQuestionScreen = ({route}: Props) => {
  const theme = useTheme();
  const [question, setQuestion] = React.useState("");
  const {enqueueSuccessSnackbar} = useAppSnackbar();
  const [
    askQuestion,
    {
      isLoading: isAskingQuestion,
      isSuccess: isAskQuestionSuccess,
      data: askQuestionData,
    },
  ] = useCreateAskQuestionMutation();

  React.useEffect(() => {
    if (isAskQuestionSuccess && !!askQuestionData) {
      enqueueSuccessSnackbar({
        text1: askQuestionData.success,
      });
      setQuestion("");
    }
  }, [isAskQuestionSuccess, askQuestionData, enqueueSuccessSnackbar]);

  const handleAskQuestion = React.useCallback(() => {
    askQuestion({
      question,
      product_id: +route.params.productId,
      seller_id: +route.params.sellerId,
    });
  }, [route.params.productId, route.params.sellerId, question]);

  const ListHeaderComponent = React.useMemo(() => {
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
              style={{height: 67, width: 67, borderRadius: theme.roundness}}
            />
          </View>

          <View style={{flex: 1, paddingHorizontal: 15}}>
            <Text style={{fontWeight: "700", fontSize: 18}}>
              {route.params.productName}
            </Text>
          </View>

          <View>
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
          }}>
          Click a message to send or write your own question
        </Title>
      </React.Fragment>
    );
  }, [
    route.params.productImage,
    route.params.productName,
    route.params.sellerImage,
    route.params.sellerName,
  ]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <QuestionList
          sellerId={+route.params.sellerId}
          productId={+route.params.productId}
          ListHeaderComponent={ListHeaderComponent}
        />
      </View>

      <View style={{padding: 15, paddingTop: 0}}>
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
            onPress={handleAskQuestion}
            disabled={!question || isAskingQuestion}
          />
        </View>
      </View>
    </View>
  );
};

export default AskQuestionScreen;
