import React from "react";
import styles from "./styles";
import {OfferOrBid} from "@src/types";
import {Text} from "react-native-paper";
import {View, Image} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native-gesture-handler";
import {RootStackRoutes} from "@constants/routes";
import truncate from "lodash.truncate";

const EachItem = ({item}: {item: OfferOrBid}) => {
  const rootNavigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: 0.5,
        padding: 10,
        borderBottomColor: "#C7C7C7",
      }}>
      <View style={{padding: 5}}>
        <Image
          source={require("../../assets/Images/test.png")}
          style={{height: 50, width: 50, borderRadius: 8}}
        />
      </View>

      <View style={{padding: 5}}>
        <Text
          style={{
            color: "#475467",
            fontFamily: "Inter-SemiBold",
            fontSize: 16,
          }}>
          {item.product_title}
        </Text>
        <Text
          style={{color: "#98A2B3", fontFamily: "Inter-Regular", fontSize: 12}}>
          Condition:{item.product_condition}
        </Text>
        <Text
          style={{color: "#98A2B3", fontFamily: "Inter-Regular", fontSize: 12}}>
          Category: {item.product_category}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: "Inter-Medium",
              fontSize: 14,
              color: "#667085",
            }}>
            ${item.price}
          </Text>
          <Text
            style={{
              color: "#667085",
              fontFamily: "Inter-Regular",
              fontSize: 12,
              marginLeft: 10,
            }}>
            {/* TODO: api endpoint needs to add total_offers/total_bids, time_left */}
            {item.total_bids ?? item.total_offers}{" "}
            {item.type === "Bid" ? "Bids" : "Offers"} |{" "}
            {truncate(item.time_left)}
          </Text>
        </View>

        <View style={{flexDirection: "row", alignItems: "center"}}>
          {item.is_bid_out ? (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#F04E26",
              }}>
              <Text style={{color: "#F04E26", fontWeight: "500"}}>Out Bid</Text>
            </View>
          ) : item.status === 0 ? (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: item.type === "Bid" ? "#0C837E" : "#1FA4DE",
              }}>
              <Text
                style={{
                  color: item.type === "Bid" ? "#0C837E" : "#1FA4DE",
                  fontWeight: "500",
                }}>
                {item.type === "offer" ? "Offer Sent" : "Bid Placed"}
              </Text>
            </View>
          ) : item.status === 1 ? (
            <React.Fragment>
              <TouchableOpacity style={styles.offerButton}>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 12,
                    color: "white",
                  }}>
                  {item.type === "offer" ? "Offer Approved" : "Bid Winner"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.offerButton,
                  {backgroundColor: "#E62B56", marginLeft: 5},
                ]}
                onPress={() => {
                  rootNavigation.navigate(RootStackRoutes.CONFIRM_PURCHASE, {
                    productId: item.product_id,
                    productName: item.product_title,
                    productImage: item.product_image,
                    productBuyNowPrice: +item.product_price,
                  });
                }}>
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 12,
                    color: "white",
                  }}>
                  Pay Now
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default EachItem;
