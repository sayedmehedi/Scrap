import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Avatar, Button} from 'react-native-elements';
import {Divider, Text, Title, useTheme} from 'react-native-paper';
import AppPrimaryButton from '../Component/AppPrimaryButton';

export default function ReviewOfferScreen() {
  const theme = useTheme();

  return (
    <View style={{flex: 1, padding: 15}}>
      <Text style={{textAlign: 'center'}}>Your Offer: $21.00</Text>
      <Text style={{textAlign: 'center'}}>Shopping cost: $5.00</Text>

      <Divider style={{marginVertical: 25, height: 2}} />

      <Title
        style={{
          fontSize: 25,
          fontWeight: '700',
          textAlign: 'center',
        }}>
        Total: $26.00
      </Title>

      <Text
        style={{
          textAlign: 'center',
          color: theme.colors.tertiary,
        }}>
        Taxes me be applied at checkout.
      </Text>

      <View style={{marginTop: 25}}>
        <AppPrimaryButton text={'Send Offer'} />
      </View>

      <Button
        type="clear"
        style={{
          marginTop: 15,
        }}
        title={'Edit offer'}
        TouchableComponent={TouchableOpacity}
        titleStyle={{
          textDecorationColor: '#000',
          textDecorationLine: 'underline',
          textDecorationStyle: 'solid',
          color: theme.colors.black,
        }}
      />
    </View>
  );
}
