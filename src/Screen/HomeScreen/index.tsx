import React from "react";
import styles from "./styles";
import CategoryList from "./CategoryList";
import Colors from "../../constants/Colors";
import {HomeStackParamList} from "@src/types";
import ProductPreviewList from "./ProductPreviewList";
import {useNavigation} from "@react-navigation/native";
import {ScrollView} from "react-native-gesture-handler";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import {SafeAreaProvider} from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {HomeStackRoutes, RootStackRoutes} from "../../constants/routes";
import {
  View,
  Image,
  Text,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

type Props = NativeStackScreenProps<
  HomeStackParamList,
  typeof HomeStackRoutes.HOME
>;

const HomeScreen = ({navigation}: Props) => {
  const rootNavigation = useNavigation();
  const handleRedirectToNotificatoins = () => {
    rootNavigation.navigate(RootStackRoutes.NOTIFICATIONS);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: "#F7F7F7"}}>
        <View style={styles.homeHeader}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Image
              source={require("../../assets/Images/logo.png")}
              style={{
                height: 40,
                width: 40,
              }}
            />
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 18,
                color: "#FFFFFF",
                marginLeft: 10,
              }}>
              ScrapApp
            </Text>
          </View>

          <MaterialIcons
            color={"white"}
            size={22}
            name="notifications-none"
            onPress={handleRedirectToNotificatoins}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 15,
            // paddingHorizontal: 10,
          }}>
          {/* SEARCH BAR */}
          <View
            style={{
              marginHorizontal: SCREEN_PADDING_HORIZONTAL,
            }}>
            <Pressable
              style={styles.searchButton}
              onPress={() =>
                rootNavigation.navigate(RootStackRoutes.SEARCH_PRODUCT)
              }>
              <EvilIcons name="search" size={20} color={"#252522"} />
              <Text
                style={{
                  fontSize: 12,
                  marginLeft: 10,
                  color: "#1D1D1B",
                  fontFamily: "Inter-Regular",
                }}>
                Search
              </Text>
            </Pressable>
          </View>

          {/* ALL CATEGORY START */}
          <View
            style={{
              marginVertical: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: SCREEN_PADDING_HORIZONTAL,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: "#191F2B",
                fontFamily: "Inter-Bold",
              }}>
              All Categories
            </Text>
            <Pressable
              onPress={() =>
                navigation.navigate(HomeStackRoutes.ALL_CATEGORIES)
              }
              style={{flexDirection: "row", alignItems: "center"}}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Inter-Regular",
                  color: Colors.PRIMARY_COLOR,
                }}>
                View All
              </Text>
              <EvilIcons
                size={18}
                name="chevron-right"
                color={Colors.PRIMARY_COLOR}
              />
            </Pressable>
          </View>

          <View>
            <CategoryList />
          </View>
          {/* ALL CATEGORY END */}

          <View
            style={{
              marginTop: 35,
              marginBottom: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: SCREEN_PADDING_HORIZONTAL,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: "#191F2B",
                fontFamily: "Inter-Bold",
              }}>
              Local Pickup
            </Text>
            <Pressable style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(
                    HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA,
                    {
                      distance: 30,
                      isLocale: true,
                      hideFilterActions: true,
                      screenTitle: "Local Pickup",
                    },
                  );
                }}>
                <Text
                  style={{
                    fontFamily: "Inter-Regular",
                    fontSize: 12,
                    color: Colors.PRIMARY_COLOR,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
              <EvilIcons
                size={18}
                name="chevron-right"
                color={Colors.PRIMARY_COLOR}
              />
            </Pressable>
          </View>
          <View>
            <ProductPreviewList
              params={{
                is_locale: "1",
              }}
            />
          </View>

          <View
            style={{
              marginTop: 35,
              marginBottom: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: SCREEN_PADDING_HORIZONTAL,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: "#191F2B",
                fontFamily: "Inter-Bold",
              }}>
              Shipping
            </Text>

            <Pressable style={{flexDirection: "row", alignItems: "center"}}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(
                    HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA,
                    {
                      isShipping: true,
                      hideFilterActions: true,
                      screenTitle: "Shipping",
                    },
                  );
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: "Inter-Regular",
                    color: Colors.PRIMARY_COLOR,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
              <EvilIcons
                size={18}
                name="chevron-right"
                color={Colors.PRIMARY_COLOR}
              />
            </Pressable>
          </View>
          <View>
            <ProductPreviewList
              params={{
                is_shipping: "1",
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;
