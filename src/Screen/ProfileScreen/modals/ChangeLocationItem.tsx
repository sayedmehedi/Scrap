import React from "react";
import styles from "../styles";
import {View, Text, TouchableOpacity} from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";
import Feather from "react-native-vector-icons/Feather";
import ChangeLocationModal from "./ChangeLocationModal";
import {useAppSelector} from "@hooks/store";

export default function ChangeLocationItem({}: {}) {
  const [openModal, setOpenModal] = React.useState(false);
  const profile = useAppSelector(state => state.auth.profile);

  return (
    <React.Fragment>
      <View style={styles.buttonContainer}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Feather name="map-pin" size={20} color={"#707070"} />

          <Text style={{marginLeft: 10, color: "#707070"}}>
            {profile?.location ?? "Update Location"}
          </Text>
        </View>

        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ChangeLocationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </React.Fragment>
  );
}
