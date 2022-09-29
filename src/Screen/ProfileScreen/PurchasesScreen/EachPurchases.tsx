import React from "react";
import styles from "../styles";
import {Order} from "@src/types";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import {RootStackRoutes} from "@constants/routes";
import {useNavigation} from "@react-navigation/native";
import {View, Text, Image, TouchableOpacity} from "react-native";
import {useShipOrderMutation} from "@data/laravel/services/order";

const SellerActions = ({item}: {item: Order}) => {
  const theme = useTheme();

  const [shipOrder, {isLoading}] = useShipOrderMutation();

  const handleOrderShip = () => {
    shipOrder({
      orderId: item.id,
    });
  };

  return (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      {item.delivery_status === "Placed" &&
        item.status === "Payment Completed" && (
          <TouchableOpacity
            disabled={isLoading}
            onPress={handleOrderShip}
            style={[styles.offerButton, {backgroundColor: "#E62B56",marginRight:10}]}>
            <Text
              style={{
                fontSize: 12,
                color: "white",
                marginRight: 0,
                fontFamily: "Inter-Medium",
              }}>
              Make Shipment
            </Text>
          </TouchableOpacity>
        )}

      {item.delivery_status === "Shipped" && (
        <View
          style={{
            padding: 10,
            marginRight: 10,
            borderRadius: 10,
            backgroundColor: "#1FA4DE",
          }}>
          <Text style={{color: "white"}}>Shipped</Text>
        </View>
      )}

      {item.status === "Payment Completed" && (
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: theme.colors.success,
          }}>
          <Text style={{color: "white"}}>Payment Completed</Text>
        </View>
      )}
    </View>
  );
};

const UserActions = ({item}: {item: Order}) => {
  const navigation = useNavigation();

  const handlePayment = () => {
    navigation.navigate(RootStackRoutes.CONFIRM_PURCHASE, {
      productId: item.product.id,
      productImage: item.product.image,
      productName: item.product.title,
      productBuyNowPrice: +item.price,
    });
  };

  const theme = useTheme();

  return (
    <View style={{flexDirection: "row", alignItems: "center"}}>
      {item.delivery_status === "Placed" && item.status !== "Paid" && (
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity
            onPress={handlePayment}
            style={[styles.offerButton, {backgroundColor: "#E62B56",marginRight:10}]}>
            <Text
              style={{
                fontSize: 12,
                color: "white",
                
                fontFamily: "Inter-Medium",
              }}>
              Pay Now
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {item.delivery_status === "Placed" && (
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            marginRight: 10,
            backgroundColor: "#1FA4DE",
          }}>
          <Text style={{color: "white"}}>Placed</Text>
        </View>
      )}

      {item.delivery_status === "Shipped" && (
        <View
          style={{
            padding: 10,
            marginRight: 10,
            borderRadius: 10,
            backgroundColor: "#1FA4DE",
          }}>
          <Text style={{color: "white"}}>Shipped</Text>
        </View>
      )}

      {item.status === "Paid" && (
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: theme.colors.success,

          }}>
          <Text style={{color: "white"}}>Paid</Text>
        </View>
      )}
    </View>
  );
};

const EachPurchases = ({item}: {item: Order & {type: "data"}}) => {
  const authId = useAppSelector(state => state.auth.profile?.id);
  const [hasSellerRole, setHasSellerRole] = React.useState(false);

  React.useEffect(() => {
    setHasSellerRole(item.seller.id === authId);
  }, [item]);

  return (
    <View
      key={item.id}
      style={{
        padding: 10,
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#C7C7C7",
      }}>
      <View style={{padding: 5}}>
        <Image
          source={{uri: item.product.image}}
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
          {item.product.title}
        </Text>
        <Text
          style={{color: "#98A2B3", fontFamily: "Inter-Regular", fontSize: 12}}>
          Condition:{item.product.condition}
        </Text>
        <Text
          style={{color: "#98A2B3", fontFamily: "Inter-Regular", fontSize: 12}}>
          {item.product.category}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: "#667085",
              fontFamily: "Inter-Medium",
            }}>
            ${item.price}
          </Text>
        </View>

        {hasSellerRole ? (
          <SellerActions item={item} />
        ) : (
          <UserActions item={item} />
        )}
      </View>
    </View>
  );
};

export default EachPurchases;
