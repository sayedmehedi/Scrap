import React from 'react';
import styles from '../styles';
import {useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import Entypo from 'react-native-vector-icons/Entypo';
import {View, Text, Modal, TextInput, TouchableOpacity} from 'react-native';
import AppPrimaryButton from '../../../Component/AppPrimaryButton';

export default function AccountSettingsModal({
  open,
  title,
  subtitle,
  onClose,
  inputs = [],
}) {
  const theme = useTheme();
  const {setValue, control, handleSubmit, setError} = useForm();

  React.useEffect(() => {
    inputs.forEach(input => {
      if (input.value) {
        setValue(input.name, input.value);
      }

      if (input.error) {
        setError(input.name, input.error);
      }
    });
  }, [inputs]);

  const handleUpdate = handleSubmit(() => {});

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType={'slide'}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity style={{alignSelf: 'flex-end',marginRight:20,marginBottom:20}} onPress={onClose}>
            <Entypo name="cross" size={30} color={'#023047'} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 16,
              color: theme.colors.text,
              fontFamily: 'Inter-Regular',
            }}>
            {title}
          </Text>

          {!!subtitle && (
            <Text
              style={{
                fontSize: 13,
                marginTop: 15,
                maxWidth: '70%',
                textAlign: 'center',
                color: theme.colors.text,
                fontFamily: 'Inter-Regular',
              }}>
              {subtitle}
            </Text>
          )}

          {inputs.map((input, i) => (
            <Controller
              key={i}
              control={control}
              name={input.name}
              render={({field}) => {
                return (
                  <TextInput
                    value={field.value}
                    style={styles.modalInput}
                    onChangeText={field.onChange}
                    placeholder={input.placeholder ?? ''}
                  />
                );
              }}
            />
          ))}

          <AppPrimaryButton text={'Update'} onPress={handleUpdate} />
        </View>
      </View>
    </Modal>
  );
}
