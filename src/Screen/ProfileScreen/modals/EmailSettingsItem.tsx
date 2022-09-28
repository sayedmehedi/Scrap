import React from "react";
import styles from "../styles";
import {useAppSelector} from "@hooks/store";
import EmailSettingsModal from "./EmailSettingsModal";
import {View, Text, TouchableOpacity} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";

export default function EmailSettingsItem({}: {}) {
  const [openModal, setOpenModal] = React.useState(false);
  const profile = useAppSelector(state => state.auth.profile);

  return (
    <React.Fragment>
      <View style={styles.buttonContainer}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Fontisto name="email" size={20} color={"#707070"} />

          <Text style={{marginLeft: 10, color: "#707070"}}>
            {profile?.email ?? "Update Email Address"}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <EmailSettingsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </React.Fragment>
  );
}
