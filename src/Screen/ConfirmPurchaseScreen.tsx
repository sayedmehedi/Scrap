import React from "react";
import {useAppSelector} from "@hooks/store";
import {RootStackParamList} from "@src/types";
import {ListItem} from "react-native-elements";
import {RootStackRoutes} from "@constants/routes";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {Controller, useForm} from "react-hook-form";
import {ActivityIndicator, HelperText} from "react-native-paper";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {View, Text, TouchableOpacity, Image} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  useConfirmOrderMutation,
  useGetCartsQuery,
} from "@data/laravel/services/order";
import {ErrorMessage} from "@hookform/error-message";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.CONFIRM_PURCHASE
>;
type FormValues = {
  payment_method: "" | "paypal" | "cryptocurrency" | "credit";
};

const ConfirmPurchaseScreen = ({navigation, route}: Props) => {
  const {enqueueErrorSnackbar, enqueueSuccessSnackbar} = useAppSnackbar();
  const {
    reset,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      payment_method: "",
    },
  });
  const shippingAddress = useAppSelector(state => state.auth.shippingAddress);

  const {data: cartsResponse, isLoading} = useGetCartsQuery();
  const [confirmOrder, {isLoading: isConfirmingPurchase}] =
    useConfirmOrderMutation();

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (!cartsResponse) {
    return (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Text>No cart found</Text>
      </View>
    );
  }

  const handleConfirmPurchase = handleSubmit(values => {
    if (!shippingAddress.city) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: "Please add your city info",
      });
      return;
    }

    if (!shippingAddress.state) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: "Please add your state info",
      });
      return;
    }

    if (!shippingAddress.country) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: "Please add your country info",
      });
      return;
    }

    if (!shippingAddress.postal_code) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: "Please add your postal code",
      });
      return;
    }

    confirmOrder({
      delivery_status: 0,
      name: shippingAddress.name,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      address: shippingAddress.address,
      city_id: shippingAddress.city.id,
      state_id: shippingAddress.state.id,
      payment_method: values.payment_method,
      country_id: shippingAddress.country.id,
      postal_code: shippingAddress.postal_code,
      product_id: cartsResponse.items[0].product,
    })
      .unwrap()
      .then(data => {
        if ("success" in data) {
          enqueueSuccessSnackbar({
            text1: "Success",
            text2: data.success,
          });
          reset();
        }

        if ("error" in data) {
          enqueueErrorSnackbar({
            text1: "Error",
            text2: data.error,
          });
        }
      });
  });

  return (
    <View style={{padding: 10}}>
      {cartsResponse?.items.map(item => (
        <View
          key={item.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 10,
          }}>
          <Image
            source={{uri: item.product_image}}
            style={{height: 80, width: 80, borderRadius: 5}}
          />

          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 14,
              color: "#111111",
              marginLeft: 8,
            }}>
            {item.product_title}
          </Text>
        </View>
      ))}

      <View
        style={{
          borderTopWidth: 1,
          borderColor: "#D6D6D6",
          borderBottomWidth: 1,
          paddingVertical: 15,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter-SemiBold",
              color: "#111111",
            }}>
            Shipping
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(RootStackRoutes.ADD_SHIPPING_ADDRESS)
            }>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#023047",
              }}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {!!shippingAddress.state &&
        !!shippingAddress.city &&
        !!shippingAddress.country ? (
          <React.Fragment>
            <Text
              style={{
                fontSize: 12,
                color: "#667085",
                fontFamily: "Inter-Regular",
              }}>
              {shippingAddress.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#667085",
                fontFamily: "Inter-Regular",
              }}>
              {shippingAddress.address}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#667085",
                fontFamily: "Inter-Regular",
              }}>
              {shippingAddress.phone}
            </Text>
          </React.Fragment>
        ) : (
          <Text
            style={{
              fontSize: 12,
              color: "#667085",
              fontFamily: "Inter-Regular",
            }}>
            Please add your shipping address
          </Text>
        )}
      </View>

      <Text
        style={{
          fontSize: 16,
          marginTop: 10,
          color: "#111111",
          fontFamily: "Inter-SemiBold",
        }}>
        Payment Method
      </Text>

      <Controller
        control={control}
        name={"payment_method"}
        rules={{
          required: "This field is required",
        }}
        render={({field}) => {
          return (
            <ListItem
              hasTVPreferredFocus
              tvParallaxProperties={{}}
              Component={TouchableOpacity}
              onPress={() => field.onChange("cryptocurrency")}
              containerStyle={{
                paddingLeft: 0,
                paddingBottom: 0,
                alignItems: "flex-start",
                backgroundColor: "#F7F7F7F",
              }}>
              <ListItem.CheckBox
                center
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                checked={field.value === "cryptocurrency"}
                containerStyle={{
                  padding: 1,
                  paddingLeft: 0,
                }}
              />
              <ListItem.Content>
                <ListItem.Title>
                  Cryptocurrency(BTC/LTC/BCH/ETH/XRP)
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          );
        }}
      />

      <Controller
        control={control}
        name={"payment_method"}
        rules={{
          required: "This field is required",
        }}
        render={({field}) => {
          return (
            <ListItem
              hasTVPreferredFocus
              tvParallaxProperties={{}}
              Component={TouchableOpacity}
              onPress={() => field.onChange("paypal")}
              containerStyle={{
                paddingLeft: 0,
                paddingBottom: 0,
                alignItems: "flex-start",
                backgroundColor: "#F7F7F7F",
              }}>
              <ListItem.CheckBox
                center
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                checked={field.value === "paypal"}
                containerStyle={{
                  padding: 1,
                  paddingLeft: 0,
                }}
              />
              <ListItem.Content>
                <ListItem.Title>Paypal</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          );
        }}
      />

      <Controller
        control={control}
        name={"payment_method"}
        rules={{
          required: "This field is required",
        }}
        render={({field}) => {
          return (
            <ListItem
              hasTVPreferredFocus
              tvParallaxProperties={{}}
              Component={TouchableOpacity}
              onPress={() => field.onChange("credit")}
              containerStyle={{
                paddingLeft: 0,
                paddingBottom: 0,
                alignItems: "flex-start",
                backgroundColor: "#F7F7F7F",
              }}>
              <ListItem.CheckBox
                center
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                checked={field.value === "credit"}
              />
              <ListItem.Content>
                <ListItem.Title>Credit card (Stripe)</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          );
        }}
      />

      <ErrorMessage
        errors={errors}
        name={"payment_method"}
        render={({message}) => (
          <HelperText type={"error"}>{message}</HelperText>
        )}
      />

      <View
        style={{
          height: 1,
          width: "100%",
          marginVertical: 20,
          backgroundColor: "#D6D6D6",
        }}
      />
      <Text
        style={{
          fontSize: 16,
          color: "#111111",
          fontFamily: "Inter-SemiBold",
        }}>
        Order Info
      </Text>
      <View style={{marginTop: 10}}>
        <View
          style={{
            marginVertical: 5,
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          <Text
            style={{
              fontSize: 12,
              color: "#111111",
              fontFamily: "Inter-Regular",
            }}>
            Product Price
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#111111",
              fontFamily: "Inter-Regular",
            }}>
            ${cartsResponse?.calculations.sub_total}
          </Text>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text
            style={{
              fontSize: 12,
              color: "#111111",
              fontFamily: "Inter-Regular",
            }}>
            Shipping
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            ${cartsResponse?.calculations.shipping_cost}
          </Text>
        </View>

        {cartsResponse?.calculations.discount > 0 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 5,
            }}>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#111111",
              }}>
              Discount
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                fontSize: 12,
                color: "#111111",
              }}>
              ${cartsResponse?.calculations.discount}
            </Text>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            Tax
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            ${cartsResponse?.calculations.vat}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 5,
          }}>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 12,
              color: "#111111",
            }}>
            Total
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 12,
              color: "#111111",
            }}>
            ${cartsResponse?.calculations.total}
          </Text>
        </View>
      </View>

      <AppPrimaryButton
        text={"Confirm Offer"}
        containerStyle={{
          alignSelf: "center",
        }}
        onPress={handleConfirmPurchase}
        disabled={isConfirmingPurchase}
      />
    </View>
  );
};

export default ConfirmPurchaseScreen;
