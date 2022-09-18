import React from "react";
import {View, Text, TouchableOpacity, Image} from "react-native";
import {useAppSelector} from "@hooks/store";
import {RootStackParamList} from "@src/types";
import {RootStackRoutes} from "@constants/routes";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {CheckBox} from "react-native-elements";
import AppPrimaryButton from "../Component/AppPrimaryButton";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.CONFIRM_PURCHASE
>;
type FormValues = {
  buynowprice: "";
  beginDay: Date;
  quantity: number;
  isListNow: boolean;
  startingPrice: "";
  showMetalPrice: boolean;
};

const ConfirmPurchaseScreen = ({navigation, route}: Props) => {
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {},
  });
  const profile = useAppSelector(state => state.auth.profile);
  const productImage = route.params.productImage;
  const productName = route.params.productName;

  return (
    <View style={{padding: 10}}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}>
        <Image
          source={{uri: productImage}}
          style={{height: 80, width: 80, borderRadius: 5}}
        />

        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: 14,
            color: "#111111",
            marginLeft: 8,
          }}>
          {productName}
        </Text>
      </View>

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
        <Text
          style={{
            fontFamily: "Inter-Regular",
            fontSize: 12,
            color: "#667085",
          }}>
          Please add your shipping address
        </Text>
      </View>

      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
          fontFamily: "Inter-SemiBold",
          color: "#111111",
        }}>
        Payment Method
      </Text>
      <View
        style={{
          marginTop: 10,
          marginLeft: -10,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Controller
          control={control}
          name={"isListNow"}
          render={({field}) => {
            return (
              <CheckBox
                center
                checked={field.value}
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                containerStyle={{
                  padding: 1,
                  paddingLeft: 0,
                }}
                onPress={() => field.onChange(true)}
              />
            );
          }}
        />

        <Text>Cryptocurrency(BTC/LTC/BCH/ETH/XRP)</Text>
      </View>

      <View
        style={{
          marginTop: 10,
          marginLeft: -10,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Controller
          control={control}
          name={"isListNow"}
          render={({field}) => {
            return (
              <CheckBox
                center
                checked={field.value}
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                containerStyle={{
                  padding: 1,
                  paddingLeft: 0,
                }}
                onPress={() => field.onChange(true)}
              />
            );
          }}
        />

        <Text>Paypal</Text>
      </View>

      <View
        style={{
          marginTop: 10,
          marginLeft: -10,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Controller
          control={control}
          name={"isListNow"}
          render={({field}) => {
            return (
              <CheckBox
                center
                checked={field.value}
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                containerStyle={{
                  padding: 1,
                  paddingLeft: 0,
                }}
                onPress={() => field.onChange(true)}
              />
            );
          }}
        />

        <Text>Credit card(Stripe)</Text>
      </View>

      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#D6D6D6",
          marginVertical: 20,
        }}
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Inter-SemiBold",
          color: "#111111",
        }}>
        Order Info
      </Text>
      <View style={{marginTop: 10}}>
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
            Product Price
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            $15.00
          </Text>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            Shipping
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#111111",
            }}>
            $7.00
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
            $0.00
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
            $22.99
          </Text>
        </View>
      </View>

      <AppPrimaryButton
        text={"Confirm Offer"}
        containerStyle={{
          alignSelf: "center",
        }}
        onPress={() => {}}
        disabled={false}
      />
    </View>
  );
};

export default ConfirmPurchaseScreen;
