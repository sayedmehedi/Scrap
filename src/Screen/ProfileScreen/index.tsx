import React from "react";
import styles from "./styles";
import {Rating} from "react-native-elements";
import auth from "@react-native-firebase/auth";
import {api} from "@data/laravel/services/api";
import {ProfileStackParamList} from "@src/types";
import Entypo from "react-native-vector-icons/Entypo";
import {useNavigation} from "@react-navigation/native";
import ProfileImageUploader from "./ProfileImageUploader";
import {useAppDispatch, useAppSelector} from "@hooks/store";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useLogoutMutation} from "@data/laravel/services/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import {ProfileStackRoutes, RootStackRoutes} from "@constants/routes";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

type Props = NativeStackScreenProps<
  ProfileStackParamList,
  typeof ProfileStackRoutes.PROFILE_SCREEN
>;

const ProfileScreen = ({navigation: profileNavigation}: Props) => {
  const dispatch = useAppDispatch();
  const [logout, {isLoading: isLoggingOut}] = useLogoutMutation();
  const rootNavigation = useNavigation();
  const profile = useAppSelector(state => state.auth.profile);

  const signoutPress = () =>
    Alert.alert("Sign Out!", "Are you sure you want to Signout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await auth().signOut();
          } catch (_error) {
          } finally {
            logout()
              .unwrap()
              .then(() => {
                dispatch(api.util.resetApiState());
              });
          }
        },
      },
    ]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 15,
        backgroundColor: "white",
      }}>
      <View style={{alignSelf: "center", alignItems: "center"}}>
        <ProfileImageUploader />
        <TouchableOpacity
          style={{alignSelf: "center", alignItems: "center"}}
          onPress={() => {
            rootNavigation.navigate(RootStackRoutes.SELLER_REVIEW, {
              sellerId: profile!.id,
            });
          }}>
          <Text style={{fontFamily: "Inter-Bold", fontSize: 20}}>
            {profile?.name}
          </Text>
          <View
            style={{
              marginVertical: 0,
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Rating
              readonly
              imageSize={12}
              showRating={false}
              startingValue={profile?.rating ?? 0}
            />
            <Text style={{marginLeft: 8}}>
              ({profile?.rating?.toFixed(2) ?? 0} rating)
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#667085",
              marginVertical: 5,
            }}>
            {profile?.location}
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Regular",
              fontSize: 12,
              color: "#667085",
              marginBottom: 5,
            }}>
            Joined {profile?.joined_date}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: 12}}>
        <TouchableOpacity
          onPress={() => {
            if (!!profile) {
              profileNavigation.navigate(ProfileStackRoutes.PUBLIC_PROFILE, {
                userId: profile.id,
              });
            }
          }}
          style={styles.buttonContainer}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <SimpleLineIcons
              name="user"
              size={20}
              color={'gray'}
            />

            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>
              Public Profile
            </Text>
          </View>

          <AntDesign name="right" size={12} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            profileNavigation.navigate(ProfileStackRoutes.ACCOUNT_SETTING)
          }
          style={styles.buttonContainer}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <Ionicons
              name="settings-outline"
              size={18}
              color={"#707070"}
            />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>
              Account Setting
            </Text>
          </View>

          <AntDesign name="right" size={12} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            profileNavigation.navigate(ProfileStackRoutes.PURCHASES)
          }
          style={styles.buttonContainer}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <SimpleLineIcons name="handbag" size={16} color={"#707070"} />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>Purchases History</Text>
          </View>

          <AntDesign name="right" size={12} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>
            profileNavigation.navigate(ProfileStackRoutes.TRANSACTION)
          }>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <AntDesign name="retweet" size={22} color={"#707070"} />
            <Text style={{marginLeft: 5, color: "#707070",fontSize:18}}>Transactions</Text>
          </View>

          <AntDesign name="right" size={12} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            profileNavigation.navigate(ProfileStackRoutes.SAVE_PRODUCT)
          }
          style={styles.buttonContainer}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <AntDesign name="hearto" size={18} color={"#707070"} />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>
              Save Products
            </Text>
          </View>

          <AntDesign name="right" size={12} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            profileNavigation.navigate(ProfileStackRoutes.OFFER_N_BID)
          }
          style={styles.buttonContainer}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <MaterialIcons name="local-offer" size={18} color={"#707070"} />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>
              Offers & Bids
            </Text>
          </View>

          <AntDesign name="right" size={12} color={"#707070"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {

          }}
          >
          <View style={{flexDirection: "row", alignItems: "center"}}>
          <AntDesign name="questioncircleo" size={18} color={"#707070"} />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>Help & Support</Text>
          </View>

          <AntDesign name="right" size={12} />
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {

          }}
          >
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <AntDesign name="infocirlceo" size={18} color={"#707070"} />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>Terms & Policy</Text>
          </View>

          <AntDesign name="right" size={12} />
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => profileNavigation.navigate(ProfileStackRoutes.CONTACT)}
          >
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <AntDesign name="questioncircleo" size={18} color={"#707070"} />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>Contact Us</Text>
          </View>

          <AntDesign name="right" size={12} />
        </TouchableOpacity> */}

        <TouchableOpacity
          disabled={isLoggingOut}
          onPress={signoutPress}
          style={styles.buttonContainer}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <AntDesign name="poweroff" size={18} color={"#707070"} />
            <Text style={{marginLeft: 10, color: "#707070",fontSize:18}}>Sign Out</Text>
          </View>

          <AntDesign name="right" size={12} color={"#707070"} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
