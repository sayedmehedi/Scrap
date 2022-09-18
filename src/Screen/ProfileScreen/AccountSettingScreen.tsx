import React from "react";
import {View, Text} from "react-native";
import {useAppSelector} from "@hooks/store";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import ChangePasswordItem from "./modals/ChangePasswordItem";
import AccountSettingsItem from "./modals/AccountSettingsItem";

const AccountSettingScreen = () => {
  const profile = useAppSelector(state => state.auth.profile);

  return (
    <>
      <View style={{paddingHorizontal: 12}}>
        <AccountSettingsItem
          modalInputs={[
            {
              name: "name",
              value: profile?.name,
            },
          ]}
          text={profile?.name ?? ""}
          modalTitle={"Update Full Name"}
          icon={<AntDesign name="user" size={20} color={"#707070"} />}
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: "phone",
              value: profile?.phone,
              placeholder: "Add Your Mobile Number",
            },
          ]}
          modalTitle={"Phone Verification"}
          text={profile?.phone ?? "No Phone number provided"}
          icon={<Feather name="phone" size={20} color={"#707070"} />}
          modalSubtitle={
            "Add a phone number to secure your account. We'll text you a code."
          }
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: "email",
              value: profile?.email,
            },
          ]}
          text={profile?.email ?? ""}
          modalTitle={"Update Email Address"}
          icon={<Fontisto name="email" size={20} color={"#707070"} />}
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: "facebook-account",
              value: "softiconic@gmail.com",
            },
          ]}
          text={"Connect Facebook"}
          modalTitle={"Update Facebook Profile"}
          icon={<Feather name="facebook" size={20} color={"#707070"} />}
        />

        <ChangePasswordItem
          modalInputs={[
            {
              name: "old_password",
              placeholder: "Old Password",
            },
            {
              name: "password",
              placeholder: "New Password",
            },
            {
              name: "password_confirmation",
              placeholder: "Confirm Password",
            },
          ]}
          text={"Update Password"}
          modalTitle={"Update Password"}
          icon={<EvilIcons name="lock" size={26} color={"#707070"} />}
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: "location",
              placeholder: "Location",
              value: profile?.location,
            },
          ]}
          modalTitle={"Update Location"}
          text={profile?.location ?? "No location data"}
          icon={<Feather name="map-pin" size={20} color={"#707070"} />}
        />
      </View>
    </>
  );
};

export default AccountSettingScreen;
