import styles from './styles';
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AccountSettingsItem from './modals/AccountSettingsItem';

const AccountSettingScreen = () => {
  return (
    <>
      <View style={{paddingHorizontal: 12}}>
        <AccountSettingsItem
          modalInputs={[
            {
              name: 'username',
              value: 'John Khan',
            },
          ]}
          text={'John Khan'}
          modalTitle={'Update Full Name'}
          icon={<AntDesign name="user" size={20} color={'#707070'} />}
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: 'phone',
              placeholder: 'Add Your Mobile Number',
            },
          ]}
          text={'Phone'}
          modalTitle={'Phone Verification'}
          icon={<Feather name="phone" size={20} color={'#707070'} />}
          modalSubtitle={
            "Add a phone number to secure your account. We'll text you a code."
          }
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: 'email',
              value: 'softiconic@gmail.com',
            },
          ]}
          text={'softiconic@gmail.com'}
          modalTitle={'Update Email Address'}
          icon={<Fontisto name="email" size={20} color={'#707070'} />}
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: 'facebook-account',
              value: 'softiconic@gmail.com',
            },
          ]}
          text={'Connect Facebook'}
          modalTitle={'Update Facebook Profile'}
          icon={<Feather name="facebook" size={20} color={'#707070'} />}
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: 'old',
              placeholder: 'Old Password',
            },
            {
              name: 'new',
              placeholder: 'New Password',
            },
            {
              name: 'confirm',
              placeholder: 'Confirm Password',
            },
          ]}
          text={'Update Password'}
          modalTitle={'Update Password'}
          icon={<EvilIcons name="lock" size={22} color={'#707070'} />}
        />

        <AccountSettingsItem
          modalInputs={[
            {
              name: 'location',
              placeholder: 'Location',
            },
          ]}
          text={'Location'}
          modalTitle={'Update Location'}
          icon={<Feather name="map-pin" size={20} color={'#707070'} />}
        />
      </View>
    </>
  );
};

export default AccountSettingScreen;
