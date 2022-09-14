import React from 'react';
import { Avatar } from 'react-native-elements';
import { Text, Title, useTheme } from 'react-native-paper';
import { View, ScrollView, Image, TextInput } from 'react-native';
import AppPrimaryButton from '../../Component/AppPrimaryButton';

const AskQuestionScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={{ padding: 15, flex: 1 }}>
      <View
        style={{
          padding: 15,
          alignItems: 'center',
          flexDirection: 'row',
          borderRadius: theme.roundness * 2,
          backgroundColor: theme.colors.white,
        }}>
        <View>
          <Image
            source={require('../../assets/Images/prod4.png')}
            style={{ height: 67, width: 67, borderRadius: theme.roundness }}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>Ladies bag</Text>
        </View>

        <View>
          <Avatar
            rounded
            source={require('../../assets/Images/test.png')}
            size={'large'}
          />

          <Text style={{ fontSize: 13, marginTop: 5 }}>Seller Name</Text>
        </View>
      </View>

      <Title
        style={{
          maxWidth: '70%',
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginVertical: 25,
        }}>
        Click a message to send or write your own question
      </Title>

      <View
        style={{
          padding: 18,
          borderWidth: 1,
          marginBottom: 15,
          borderColor: '#191F2B',
          borderRadius: theme.roundness * 4,
        }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Hi, is this still avilable?
        </Text>
      </View>

      <View
        style={{
          padding: 18,
          borderWidth: 1,
          marginBottom: 15,
          borderColor: '#191F2B',
          borderRadius: theme.roundness * 4,
        }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Hi, I’d like to buy this
        </Text>
      </View>

      <View
        style={{
          padding: 18,
          borderWidth: 1,
          marginBottom: 15,
          borderColor: '#191F2B',
          borderRadius: theme.roundness * 4,
        }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Hi, can you meet today?
        </Text>
      </View>

      <View
        style={{
          padding: 18,
          borderWidth: 1,
          marginBottom: 15,
          borderColor: '#191F2B',
          borderRadius: theme.roundness * 4,
        }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>
          Will you ship through us?
        </Text>
      </View>

      <TextInput
        multiline
        numberOfLines={7}
        textAlign={'center'}
        textAlignVertical={'top'}
        placeholder="Write your message"
        style={{
          borderWidth: 1,
          borderColor: '#191F2B',
          borderRadius: theme.roundness * 3,
        }}
      />

      <View style={{ marginTop: 45, marginBottom: 25 }}>
        <AppPrimaryButton text={'Send Message'} />
      </View>
    </ScrollView>
  );
};

export default AskQuestionScreen;
