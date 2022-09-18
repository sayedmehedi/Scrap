import React from "react";
import {OfferOrBid} from "@src/types";
import {View, Text, Image} from "react-native";
import {Button, Card, Paragraph, Title, useTheme} from "react-native-paper";
import {useMakeBidWinnerOrAcceptOfferMutation} from "@data/laravel/services/offerNBids";
import useAppSnackbar from "@hooks/useAppSnackbar";
import truncate from "lodash.truncate";

export default function EachSellerOfferNBids({item}: {item: OfferOrBid}) {
  const theme = useTheme();
  const {enqueueSuccessSnackbar} = useAppSnackbar();
  const [makeWinnerOrAccept, {isSuccess, data}] =
    useMakeBidWinnerOrAcceptOfferMutation();

  React.useEffect(() => {
    if (isSuccess && data) {
      enqueueSuccessSnackbar({
        text1: data.success,
      });
    }
  }, [isSuccess, enqueueSuccessSnackbar, data]);

  const noStatusButton =
    item.type === "Bid" ? (
      <Button
        labelStyle={{fontWeight: "700"}}
        onPress={() =>
          makeWinnerOrAccept({
            offerOrBidId: item.id,
          })
        }>
        Award
      </Button>
    ) : (
      // @ts-ignore
      <Button
        labelStyle={{color: theme.colors.black, fontWeight: "700"}}
        onPress={() =>
          makeWinnerOrAccept({
            offerOrBidId: item.id,
          })
        }>
        Accept Offer
      </Button>
    );

  // @ts-ignore
  const statusFeedback = (
    <Text
      style={{fontWeight: "700", fontSize: 18, color: theme.colors.success}}>
      {item.type === "Bid" ? "WINNER" : "ACCEPTED"}
    </Text>
  );

  return (
    <Card>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View>
          <Card.Title
            title={truncate(item.product_title, {
              length: 20,
            })}
            titleStyle={{
              fontSize: 12,
            }}
          />
          <Card.Content>
            <Title>{item.user_name}</Title>
            <Paragraph>
              {truncate(item.product_location, {
                length: 19,
              })}
            </Paragraph>
          </Card.Content>
        </View>

        <View style={{padding: 15}}>
          <Image
            style={{height: 50, width: 50, borderRadius: 1000}}
            source={{uri: item.user_image}}
          />
        </View>
      </View>
      <Card.Actions style={{justifyContent: "space-between"}}>
        <Text>
          {item.type === "offer" ? "Offer Price" : "Bid"}: {item.price}
        </Text>

        {item.status === 0 ? noStatusButton : statusFeedback}
      </Card.Actions>
    </Card>
  );
}
