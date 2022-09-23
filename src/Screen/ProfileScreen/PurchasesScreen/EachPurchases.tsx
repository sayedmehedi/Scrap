import React from "react";
import styles from "../styles";
import {Order} from "@src/types";
import {useTheme} from "react-native-paper";
import {useAppSelector} from "@hooks/store";
import {RootStackRoutes} from "@constants/routes";
import {useNavigation} from "@react-navigation/native";
import {View, Text, Image, TouchableOpacity} from "react-native";

const SellerActions = ({item}: {item: Order}) => {
  const handleOrderShip = () => {};

  return (
    <React.Fragment>
      {item.delivery_status === "Paid" && (
        <TouchableOpacity
          onPress={handleOrderShip}
          style={[styles.offerButton, {backgroundColor: "#E62B56"}]}>
          <Text
            style={{
              fontSize: 12,
              color: "white",
              fontFamily: "Inter-Medium",
            }}>
            Ship Order
          </Text>
        </TouchableOpacity>
      )}

      {item.delivery_status === "Placed" && (
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: "grey",
            }}>
            <Text style={{color: "white"}}>Waiting for payment</Text>
          </View>
        </View>
      )}

      {item.delivery_status === "Shipped" && (
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: "#1FA4DE",
            }}>
            <Text style={{color: "white"}}>Shipment complete</Text>
          </View>
        </View>
      )}
    </React.Fragment>
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
    <React.Fragment>
      {item.delivery_status === "Placed" && (
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity
            onPress={handlePayment}
            style={[styles.offerButton, {backgroundColor: "#E62B56"}]}>
            <Text
              style={{
                fontSize: 12,
                color: "white",
                fontFamily: "Inter-Medium",
              }}>
              Pay Now
            </Text>
          </TouchableOpacity>

          <View
            style={{
              padding: 10,
              marginLeft: 10,
              borderRadius: 10,
              backgroundColor: "#1FA4DE",
            }}>
            <Text style={{color: "white"}}>Placed</Text>
          </View>
        </View>
      )}

      {item.delivery_status === "Shipped" && (
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: theme.colors.success,
            }}>
            <Text style={{color: "white"}}>Shipped</Text>
          </View>
        </View>
      )}
    </React.Fragment>
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
