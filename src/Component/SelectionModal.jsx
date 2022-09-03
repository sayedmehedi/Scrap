import React from 'react';
import {ListItem} from 'react-native-elements';
import AppPrimaryButton from './AppPrimaryButton';
import {Divider, Title, useTheme} from 'react-native-paper';
import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';

export default function SelectionModal({
  open,
  title,
  onSave,
  onClose,
  items = [],
  initialValue,
}) {
  const theme = useTheme();
  const [selectedData, setSelectedData] = React.useState(null);

  const handleSave = () => {
    onSave(selectedData);
    onClose();
  };

  React.useEffect(() => {
    if (initialValue) {
      setSelectedData(initialValue);
    }
  }, [initialValue]);

  return (
    <Modal visible={open} animationType={'slide'}>
      <View style={{padding: 15}}>
        <Title>{title}</Title>
      </View>

      <ScrollView style={{flex: 1}}>
        {items.map(item => {
          return (
            <React.Fragment key={item.id}>
              <ListItem
                Component={TouchableOpacity}
                containerStyle={{
                  backgroundColor:
                    item.id === selectedData?.id
                      ? theme.colors.primary
                      : theme.colors.white,
                }}
                onPress={() => setSelectedData(item)}>
                <ListItem.Content
                  containerStyle={{
                    padding: 0,
                    borderWidth: 0,
                  }}>
                  <ListItem.Title
                    style={{
                      color:
                        item.id === selectedData?.id
                          ? theme.colors.white
                          : theme.colors.text,
                    }}>
                    {item.text}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <Divider style={{width: '100%', height: 2}} />
            </React.Fragment>
          );
        })}
      </ScrollView>

      <View style={{marginTop: 15}}>
        <AppPrimaryButton onPress={handleSave} text={'Save'} />
      </View>

      <View style={{marginVertical: 15}}>
        <AppPrimaryButton
          containerStyle={{
            borderWidth: 1,
            backgroundColor: 'transparent',
            borderColor: theme.colors.primary,
          }}
          textStyle={{
            color: theme.colors.primary,
          }}
          onPress={onClose}
          text={'Cancel'}
        />
      </View>
    </Modal>
  );
}
