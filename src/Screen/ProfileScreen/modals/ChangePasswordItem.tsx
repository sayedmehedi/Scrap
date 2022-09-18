import React from "react";
import styles from "../styles";
import {View, Text, TouchableOpacity, TextInputProps} from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ChangePasswordItem({
  icon,
  text,
  modalTitle,
  modalSubtitle,
  modalInputs = [],
}: {
  text: string;
  modalTitle: string;
  modalSubtitle?: string;
  icon: React.ReactNode;
  modalInputs: Array<TextInputProps & {name: string; error?: string}>;
}) {
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <React.Fragment>
      <View style={styles.buttonContainer}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          {icon}

          <Text style={{marginLeft: 10, color: "#707070"}}>{text}</Text>
        </View>

        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ChangePasswordModal
        open={openModal}
        title={modalTitle}
        inputs={modalInputs}
        subtitle={modalSubtitle}
        onClose={() => setOpenModal(false)}
      />
    </React.Fragment>
  );
}
