import React from "react";
import {PostItemStackParamList} from "@src/types";
import {Controller, useForm} from "react-hook-form";
import Entypo from "react-native-vector-icons/Entypo";
import {useNavigation} from "@react-navigation/native";
import SelectionModal from "../Component/SelectionModal";
import {ListItem, Switch} from "react-native-elements";
import {PostItemStackRoutes} from "../constants/routes";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {Divider, Text, useTheme} from "react-native-paper";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import LocationSelectionModal from "./LocationSelectionModal";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {View, ScrollView, TouchableOpacity} from "react-native";

type Props = NativeStackScreenProps<
  PostItemStackParamList,
  typeof PostItemStackRoutes.ADD_DELIVERY_METHOD
>;

export default function ProductAddDeliveryMethodScreen({navigation}: Props) {
  const theme = useTheme();
  const [modalType, setModalType] = React.useState("");

  const {control} = useForm({
    defaultValues: {
      location: "",
      package: "small",
      sellNShipIntl: false,
    },
  });

  const handleNextScreen = () => {
    navigation.navigate(PostItemStackRoutes.SUCCESS);
  };

  return (
    <ScrollView style={{padding: 15}}>
      <Controller
        name={"location"}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <ListItem
                hasTVPreferredFocus
                tvParallaxProperties={{}}
                Component={TouchableOpacity}
                containerStyle={{
                  paddingHorizontal: 0,
                  backgroundColor: "transparent",
                }}
                onPress={() => setModalType("location")}>
                <ListItem.Content>
                  <ListItem.Title>Location: {field.value}</ListItem.Title>
                </ListItem.Content>

                <Entypo name={"edit"} size={15} />
              </ListItem>

              <LocationSelectionModal
                onChange={field.onChange}
                open={modalType === "location"}
                onClose={() => setModalType("")}
              />

              <Divider style={{height: 2}} />
            </React.Fragment>
          );
        }}
      />

      <View style={{height: 15}} />

      <Controller
        name={"sellNShipIntl"}
        control={control}
        render={({field}) => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <View>
                <Text
                  style={{
                    marginBottom: 10,
                    fontSize: 17,
                    color: "#222222",
                  }}>
                  Sell & Ship International
                </Text>

                <Text>15% Services fee applies</Text>
              </View>

              <View>
                <Switch onValueChange={field.onChange} value={field.value} />
              </View>
            </View>
          );
        }}
      />

      <View style={{height: 15}} />

      <Controller
        control={control}
        name={"package"}
        render={({field}) => {
          return (
            <React.Fragment>
              <ListItem
                hasTVPreferredFocus
                tvParallaxProperties={{}}
                Component={TouchableOpacity}
                onPress={() => field.onChange("small")}
                containerStyle={{
                  paddingLeft: 0,
                  alignItems: "flex-start",
                  backgroundColor: "#F7F7F7F",
                }}>
                <ListItem.CheckBox
                  iconType={"material"}
                  checked={field.value === "small"}
                  checkedIcon={"radio-button-checked"}
                  uncheckedIcon={"radio-button-unchecked"}
                  onPress={() => field.onChange("small")}
                />

                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      color:
                        field.value === "small"
                          ? theme.colors.primary
                          : theme.colors.text,
                    }}>
                    Small Pckage
                  </ListItem.Title>

                  <View
                    style={{
                      marginTop: 10,
                    }}>
                    <Text>Approx: 9” x 6” x 3”</Text>
                    <Text>No side over 18” or weight over 20</Text>
                    <Text>pounds. Buyer Pays $7.99</Text>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                hasTVPreferredFocus
                tvParallaxProperties={{}}
                Component={TouchableOpacity}
                onPress={() => field.onChange("medium")}
                containerStyle={{
                  paddingLeft: 0,
                  alignItems: "flex-start",
                  backgroundColor: "#F7F7F7F",
                }}>
                <ListItem.CheckBox
                  iconType={"material"}
                  checked={field.value === "medium"}
                  checkedIcon={"radio-button-checked"}
                  uncheckedIcon={"radio-button-unchecked"}
                  onPress={() => field.onChange("medium")}
                />

                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      color:
                        field.value === "medium"
                          ? theme.colors.primary
                          : theme.colors.text,
                    }}>
                    Medium Pckage
                  </ListItem.Title>

                  <View
                    style={{
                      marginTop: 10,
                    }}>
                    <Text>Approx: 12” x 9” x 6”</Text>
                    <Text>No side over 18” or weight over 20 pounds.</Text>
                    <Text>Buyer Pays $11.99</Text>
                  </View>
                </ListItem.Content>
              </ListItem>

              <ListItem
                hasTVPreferredFocus
                tvParallaxProperties={{}}
                Component={TouchableOpacity}
                onPress={() => field.onChange("large")}
                containerStyle={{
                  paddingLeft: 0,
                  alignItems: "flex-start",
                  backgroundColor: "#F7F7F7F",
                }}>
                <ListItem.CheckBox
                  iconType={"material"}
                  checked={field.value === "large"}
                  checkedIcon={"radio-button-checked"}
                  uncheckedIcon={"radio-button-unchecked"}
                  onPress={() => field.onChange("large")}
                />

                <ListItem.Content>
                  <ListItem.Title
                    style={{
                      color:
                        field.value === "large"
                          ? theme.colors.primary
                          : theme.colors.text,
                    }}>
                    Large Pckage
                  </ListItem.Title>

                  <View
                    style={{
                      marginTop: 10,
                    }}>
                    <Text>Approx: 14” x 10” x 6”</Text>
                    <Text>No side over 18” or weight over 20</Text>
                    <Text>pounds. Buyer Pays $14.99</Text>
                  </View>
                </ListItem.Content>
              </ListItem>
            </React.Fragment>
          );
        }}
      />

      <AppPrimaryButton
        text={"Submit"}
        onPress={handleNextScreen}
        containerStyle={{marginVertical: 35}}
      />
    </ScrollView>
  );
}
