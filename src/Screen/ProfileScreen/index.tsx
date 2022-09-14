import React from "react";
import styles from "./styles";
import { Rating } from "react-native-elements";
import { useAppSelector } from "@hooks/store";
import { AuthStackParamList, ProfileStackParamList } from "@src/types";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useLogoutMutation } from "@data/laravel/services/auth";
import { selectIsAuthenticated } from "@store/slices/authSlice";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackRoutes, ProfileStackRoutes, RootStackRoutes } from "@constants/routes";
import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import ProfileImageUploader from "./ProfileImageUploader";

type Props = NativeStackScreenProps<ProfileStackParamList, typeof ProfileStackRoutes.PROFILE_SCREEN>

type AuthNavigationProps = NativeStackNavigationProp<AuthStackParamList>

const ProfileScreen = ({ navigation: profileNavigation }: Props) => {
  const [logout] = useLogoutMutation();
  const authNavigation = useNavigation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const profile = useAppSelector(state => state.auth.profile)


  const signoutPress = () =>
    Alert.alert("Sign Out!", "Are you sure you want to Signout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Logout", onPress: () => logout() },
    ]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      authNavigation.navigate(RootStackRoutes.AUTH, {
        screen: AuthStackRoutes.LOGIN,
        params: {}
      })
    }
  }, [isAuthenticated, authNavigation])


  return (
    <ScrollView>
      <View style={{ alignSelf: "center", alignItems: "center" }}>
        <ProfileImageUploader />
        <Text style={{ fontFamily: "Inter-Bold", fontSize: 20 }}>
          {profile?.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Rating
            lock={true}
            imageSize={15}
            readonly={true}
            showRating={false}
            startingValue={profile?.rating ?? 0}
          />
          <Text style={{ marginLeft: 8 }}>({profile?.rating ?? 0} rating)</Text>
        </View>
        <Text
          style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#667085" }}>
          {profile?.location}
        </Text>
        <Text
          style={{ fontFamily: "Inter-Regular", fontSize: 12, color: "#667085" }}>
          Joined {profile?.joined_date}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 12 }}>
        <TouchableOpacity
          onPress={() => profileNavigation.navigate("publicProfile")}
          style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={require("../../assets/Images/users.png")}
              style={{ height: 20, width: 25 }}
            />

            <Text style={{ marginLeft: 10, color: "#707070" }}>
              Public Profile
            </Text>
          </View>

          <AntDesign name="right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => profileNavigation.navigate("accountSetting")}
          style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="settings-input-component"
              size={20}
              color={"#707070"}
            />
            <Text style={{ marginLeft: 10, color: "#707070" }}>
              Account Setting
            </Text>
          </View>

          <AntDesign name="right" size={20} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => profileNavigation.navigate("purchases")}
          style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="shopping-bag" size={20} color={"#707070"} />
            <Text style={{ marginLeft: 10, color: "#707070" }}>Purchases</Text>
          </View>

          <AntDesign name="right" size={20} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => profileNavigation.navigate(ProfileStackRoutes.TRANSACTION)}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="money" size={20} color={"#707070"} />
            <Text style={{ marginLeft: 10, color: "#707070" }}>Transactions</Text>
          </View>

          <AntDesign name="right" size={20} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => profileNavigation.navigate("saveProduct")}
          style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="hearto" size={20} color={"#707070"} />
            <Text style={{ marginLeft: 10, color: "#707070" }}>
              Save Products
            </Text>
          </View>

          <AntDesign name="right" size={20} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => profileNavigation.navigate("offerAndBid")}
          style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="local-offer" size={20} color={"#707070"} />
            <Text style={{ marginLeft: 10, color: "#707070" }}>
              Offers & Bids
            </Text>
          </View>

          <AntDesign name="right" size={20} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => profileNavigation.navigate("error")}
          style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="questioncircleo" size={20} color={"#707070"} />
            <Text style={{ marginLeft: 10, color: "#707070" }}>
              Help & Support
            </Text>
          </View>

          <AntDesign name="right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={signoutPress} style={styles.buttonContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="login" size={20} color={"#707070"} />
            <Text style={{ marginLeft: 10, color: "#707070" }}>Sign Out</Text>
          </View>

          <AntDesign name="right" size={20} color={"#707070"} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
