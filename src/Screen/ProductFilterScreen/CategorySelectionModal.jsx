import React from 'react';
import {Modal, View} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Divider, Title} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppPrimaryButton from '../../Component/AppPrimaryButton';

export default function CategorySelectionModal({open, onClose}) {
  return (
    <Modal visible={open} animationType={'slide'}>
      <View style={{padding: 15}}>
        <Title>Select Categories</Title>
      </View>

      <ListItem Component={TouchableOpacity} onPress={() => {}}>
        <ListItem.CheckBox
          checked
          title={"Clothing, Shoes, & Accessories - Girls' clothing"}
          containerStyle={{
            backgroundColor: 'transparent',
            padding: 0,
            borderWidth: 0,
          }}
          //   iconType={'material'}
          //   checkedIcon={'radio-button-checked'}
          //   uncheckedIcon={'radio-button-unchecked'}
        />
      </ListItem>
      <Divider style={{width: '100%', height: 2}} />

      <ListItem Component={TouchableOpacity} onPress={() => {}}>
        <ListItem.CheckBox
          checked={false}
          //   iconType={'material'}
          //   checkedIcon={'radio-button-checked'}
          //   uncheckedIcon={'radio-button-unchecked'}
          title={'Category 2'}
          containerStyle={{
            backgroundColor: 'transparent',
            padding: 0,
            borderWidth: 0,
          }}
        />
      </ListItem>

      <Divider style={{width: '100%', height: 2}} />

      <ListItem Component={TouchableOpacity} onPress={() => {}}>
        <ListItem.CheckBox
          checked={false}
          //   iconType={'material'}
          //   checkedIcon={'radio-button-checked'}
          //   uncheckedIcon={'radio-button-unchecked'}
          title={'Category 3'}
          containerStyle={{
            backgroundColor: 'transparent',
            padding: 0,
            borderWidth: 0,
          }}
        />
      </ListItem>

      <Divider style={{width: '100%', height: 2}} />

      <ListItem Component={TouchableOpacity} onPress={() => {}}>
        <ListItem.CheckBox
          checked={false}
          //   iconType={'material'}
          //   checkedIcon={'radio-button-checked'}
          //   uncheckedIcon={'radio-button-unchecked'}
          title={'Category 4'}
          containerStyle={{
            backgroundColor: 'transparent',
            padding: 0,
            borderWidth: 0,
          }}
        />
      </ListItem>

      <View style={{marginTop: 15}}>
        <AppPrimaryButton onPress={onClose} text={'Save'} />
      </View>
    </Modal>
  );
}
