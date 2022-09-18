import React from "react";
import styles from "./styles";
import Colors from "../../constants/Colors";
import {HomeTabParamList} from "@src/types";
import SaleProductList from "./SaleProductList";
import ArchiveProductList from "./ArchiveProductList";
import {useNavigation} from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import {HomeTabRoutes, PostItemStackRoutes} from "@constants/routes";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {View, Text, SafeAreaView, TouchableOpacity} from "react-native";

type HometabNavigation = BottomTabNavigationProp<HomeTabParamList>;

const SellingScreen = () => {
  const hometabNavigation = useNavigation<HometabNavigation>();
  const [productType, setProductType] = React.useState<"sale" | "archived">(
    "sale",
  );
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: "#F7F7F7"}}>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity
            onPress={() => setProductType("sale")}
            style={[
              styles.tabButton,
              {backgroundColor: productType === "sale" ? "#191F2B" : "#E6E6E6"},
            ]}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-SemiBold",
                color: productType === "sale" ? "white" : "#191F2B",
              }}>
              Sale
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setProductType("archived")}
            style={[
              styles.tabButton,
              {
                backgroundColor:
                  productType === "archived" ? "#191F2B" : "#E6E6E6",
              },
            ]}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-SemiBold",
                color: productType === "archived" ? "white" : "#191F2B",
              }}>
              Archived
            </Text>
          </TouchableOpacity>
        </View>

        {productType === "sale" && (
          <View style={{marginVertical: 20, paddingBottom: 60}}>
            <SaleProductList
              ListEmptyComponent={() => {
                return (
                  <TouchableOpacity
                    style={styles.postItemButton}
                    onPress={() =>
                      hometabNavigation.navigate(HomeTabRoutes.POST_ITEM, {
                        screen: PostItemStackRoutes.UPLOAD_PHOTO,
                      })
                    }>
                    <View></View>
                    <Text
                      style={{
                        fontFamily: "Inter-Regular",
                        fontSize: 16,
                        color: Colors.PRIMARY_COLOR,
                      }}>
                      Post New Product
                    </Text>

                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderWidth: 1,
                        borderRadius: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FFFFFF",
                        borderColor: Colors.PRIMARY_COLOR,
                      }}>
                      <Feather
                        name="edit"
                        color={Colors.PRIMARY_COLOR}
                        size={20}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {productType === "archived" && (
          <View style={{marginVertical: 20, paddingBottom: 60}}>
            <ArchiveProductList />
          </View>
        )}
      </SafeAreaView>
    </>
  );
};

export default SellingScreen;
