import React from 'react';
import styles from '../styles';
import {View, Text, TouchableOpacity} from 'react-native';
import AccountSettingsModal from './AccountSettingsModal';

export default function AccountSettingsItem({
  icon,
  text,
  modalTitle,
  modalSubtitle,
  modalInputs = [],
}) {
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <React.Fragment>
      <View style={styles.buttonContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {icon}

          <Text style={{marginLeft: 10, color: '#707070'}}>{text}</Text>
        </View>

        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <AccountSettingsModal
        open={openModal}
        title={modalTitle}
        inputs={modalInputs}
        subtitle={modalSubtitle}
        onClose={() => setOpenModal(false)}
      />
    </React.Fragment>
  );
}
