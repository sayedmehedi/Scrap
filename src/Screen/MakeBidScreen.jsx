import React from 'react';
import {TextInput, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {Text, useTheme} from 'react-native-paper';
import {RootStackRoutes} from '../constants/routes';
import {useNavigation} from '@react-navigation/native';
import AppPrimaryButton from '../Component/AppPrimaryButton';

export default function MakeBidScreen() {
  const theme = useTheme();
  const [bidPrice, setBidPrice] = React.useState(0);
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, padding: 15}}>
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          borderRadius: theme.roundness * 3,
          backgroundColor: theme.colors.white,
        }}>
        <View style={{marginRight: 10}}>
          <Avatar
            size={'medium'}
            style={{height: 70, width: 70, borderRadius: theme.roundness * 3}}
            source={require('../assets/Images/test.png')}
          />
        </View>

        <View style={{flex: 1}}>
          <Text style={{fontWeight: '600', fontSize: 16}}>Gents Shoes</Text>
          <Text style={{fontWeight: '600', fontSize: 15}}>
            $22.00 (Approx $25.00)
          </Text>
          <Text style={{fontWeight: '600', fontSize: 15}}>
            Starting bid | 2 bids | 2d 20h 30m
          </Text>
        </View>
      </View>

      <Text
        style={{
          fontSize: 25,
          marginTop: 45,
          fontWeight: '600',
          textAlign: 'center',
        }}>
        We’ll bid for you, up to
      </Text>

      <TextInput
        style={{
          fontSize: 45,
          textAlign: 'center',
          borderBottomWidth: 2,
          borderBottomColor: theme.colors.black,
        }}
        value={bidPrice}
        onChangeText={price => setBidPrice(price)}
      />

      <View style={{marginTop: 45}}>
        <AppPrimaryButton
          text={'Review Offer'}
          onPress={() => navigation.navigate(RootStackRoutes.REVIEW_OFFER)}
        />
      </View>
    </View>
  );
}
