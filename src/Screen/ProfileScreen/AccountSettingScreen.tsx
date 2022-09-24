import React from "react";
import {View, Text} from "react-native";
import {useAppSelector} from "@hooks/store";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import ChangePasswordItem from "./modals/ChangePasswordItem";
import AccountSettingsItem from "./modals/AccountSettingsItem";
import ChangeLocationItem from "./modals/ChangeLocationItem";
import {useLogoutMutation} from "@data/laravel/services/auth";

const AccountSettingScreen = () => {
  const profile = useAppSelector(state => state.auth.profile);
  const [logout] = useLogoutMutation();

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
          onSuccess={() => {
            logout();
          }}
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
              secureTextEntry: true,
              placeholder: "Old Password",
            },
            {
              name: "password",
              secureTextEntry: true,
              placeholder: "New Password",
            },
            {
              name: "password_confirmation",
              secureTextEntry: true,
              placeholder: "Confirm Password",
            },
          ]}
          text={"Update Password"}
          modalTitle={"Update Password"}
          icon={<EvilIcons name="lock" size={26} color={"#707070"} />}
        />

        <ChangeLocationItem />
      </View>
    </>
  );
};

export default AccountSettingScreen;
