import React from 'react';
import {Modal, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Divider, Title} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppPrimaryButton from '../Component/AppPrimaryButton';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Colors from '../constants/Colors';

export default function LocationSelectionModal({open, onClose, onChange}) {
  return (
    <Modal visible={open} animationType={'slide'}>
      <View style={{padding: 15, backgroundColor: Colors.PRIMARY_COLOR}}>
        <Title style={{color: 'white'}}>Select Location</Title>
      </View>

      <GooglePlacesAutocomplete
        currentLocation
        // textInputHide
        placeholder={'Enter your location'}
        currentLocationLabel="Use Current Location"
        onPress={(data, details = null) => {
          onChange(data);
          // 'details' is provided when fetchDetails = true
          console.log('onPress', data, details);
        }}
        onFail={error => console.error('fail', error)}
        onNotFound={error => console.error('not found', error)}
        query={{
          language: 'en',
          key: 'AIzaSyBS5uptcl-aFEDYs01Ei5wQ47N_JE2ImTU',
        }}
      />

      <View style={{marginVertical: 15}}>
        <AppPrimaryButton onPress={onClose} text={'Cancel'} />
      </View>
    </Modal>
  );
}
