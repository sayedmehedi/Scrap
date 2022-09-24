import React from "react";
import {Title} from "react-native-paper";
import {View, Image} from "react-native";
import {PostItemStackParamList} from "@src/types";
import {PostItemStackRoutes} from "../constants/routes";
import AppPrimaryButton from "@src/Component/AppPrimaryButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<
  PostItemStackParamList,
  typeof PostItemStackRoutes.SUCCESS
>;

export default function ProductAddSuccessScreen({navigation}: Props) {
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 50,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
        <Image
          source={require("../assets/Images/success.png")}
          style={{height: 85, width: 85, marginBottom: 15}}
        />
        <Title style={{maxWidth: "50%", textAlign: "center"}}>
          Product items successfully post!
        </Title>
      </View>
      <AppPrimaryButton
        text={"Add More"}
        onPress={() => {
          navigation.navigate(PostItemStackRoutes.UPLOAD_PHOTO);
        }}
      />
    </View>
  );
}
