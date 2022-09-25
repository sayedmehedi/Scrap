import React from "react";
import styles from "../styles";
import AccountSettingsModal from "./AccountSettingsModal";
import {View, Text, TouchableOpacity, TextInputProps} from "react-native";

export default function AccountSettingsItem({
  icon,
  text,
  onSuccess,
  modalTitle,
  modalSubtitle,
  modalInputs = [],
}: {
  text: string;
  modalTitle: string;
  modalSubtitle?: string;
  icon: React.ReactNode;
  onSuccess?: () => void;
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

      <AccountSettingsModal
        open={openModal}
        title={modalTitle}
        onSuccess={onSuccess}
        inputs={modalInputs}
        subtitle={modalSubtitle}
        onClose={() => setOpenModal(false)}
      />
    </React.Fragment>
  );
}
