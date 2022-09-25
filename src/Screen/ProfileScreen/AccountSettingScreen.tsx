import React from "react";
import {View, Text} from "react-native";
import {logout} from "@store/slices/authSlice";
import useAppSnackbar from "@hooks/useAppSnackbar";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import {useAppDispatch, useAppSelector} from "@hooks/store";
import AntDesign from "react-native-vector-icons/AntDesign";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import ChangePasswordItem from "./modals/ChangePasswordItem";
import AccountSettingsItem from "./modals/AccountSettingsItem";
import ChangeLocationItem from "./modals/ChangeLocationItem";
import {useLogoutMutation} from "@data/laravel/services/auth";
import FacebookSettingsItem from "./modals/FacebookSettingsItem";
import EmailSettingsItem from "./modals/EmailSettingsItem";

const AccountSettingScreen = () => {
  const dispatch = useAppDispatch();
  const {enqueueInfoSnackbar} = useAppSnackbar();
  const profile = useAppSelector(state => state.auth.profile);

  return (
    <>
      <View style={{paddingHorizontal: 12}}>
        <AccountSettingsItem
          modalInputs={[
            {
              name: "name",
              defaultValue: profile?.name,
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
              keyboardType: "number-pad",
              placeholder: "Add Your Mobile Number",
              defaultValue: profile?.phone?.toString(),
            },
          ]}
          modalTitle={"Phone Verification"}
          icon={<Feather name="phone" size={20} color={"#707070"} />}
          text={profile?.phone?.toString() ?? "No Phone number provided"}
          modalSubtitle={
            "Add a phone number to secure your account. We'll text you a code."
          }
        />

        <EmailSettingsItem />

        <FacebookSettingsItem />

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
              secureTextEntry: true,
              name: "password_confirmation",
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
