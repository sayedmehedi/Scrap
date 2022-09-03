import React from 'react';
import styles from './styles';
import {Avatar} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {Text, Title, useTheme} from 'react-native-paper';
import {
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function AppBar({navigation, route, back}) {
  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {back && (
          <TouchableOpacity style={{padding: 0}} onPress={navigation.goBack}>
            <MaterialIcons
              name="keyboard-backspace"
              color={'white'}
              size={22}
            />
          </TouchableOpacity>
        )}

        <View style={{marginHorizontal: 10}}>
          <Avatar
            rounded
            size={'medium'}
            source={require('../../assets/Images/test.png')}
          />
        </View>

        <View>
          <Title style={{color: 'white'}}>Rahim Uddin</Title>
          <Text style={{color: 'white'}}>New York, NY</Text>
        </View>
      </View>

      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../assets/Images/test.png')}
          style={{height: 50, width: 50, borderRadius: 8}}
        />

        <Text
          style={{
            fontSize: 10,
            marginTop: 5,
            color: 'white',
          }}>
          $20
        </Text>
      </View>
    </View>
  );
}

const SingleConversationScreen = () => {
  const theme = useTheme();

  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      header: AppBar,
      headerShown: true,
    });
  }, [navigation]);

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <View
          style={{
            padding: 10,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome5 name="shuttle-van" size={18} color={'#111111'} />
            <Text
              style={{
                fontSize: 12,
                marginLeft: 8,
                color: '#023047',
                fontFamily: 'Inter-Medium',
              }}>
              Offer price: $7.99
            </Text>
          </View>
          <TouchableOpacity
            style={{
              height: 31,
              width: 110,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#191F2B',
            }}>
            <Text
              style={{
                fontSize: 12,
                color: theme.colors.white,
                fontFamily: 'Inter-Regular',
              }}>
              Make Offer
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{flex: 1, paddingHorizontal: 15}}>
          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'flex-end',
              alignSelf: 'flex-start',
            }}>
            <View style={{marginRight: 10, marginBottom: 20}}>
              <Avatar
                rounded
                size={'small'}
                source={require('../../assets/Images/test.png')}
              />
            </View>

            <View>
              <View
                style={{
                  padding: 20,
                  maxWidth: '90%',
                  backgroundColor: '#EAECF2',
                  borderRadius: theme.roundness * 3,
                }}>
                <Text>
                  Hi Cassie! Would you be available for a coffee next week? 😁
                </Text>
              </View>

              <View style={{marginTop: 5}}>
                <Text>8:07</Text>
              </View>
            </View>
          </View>

          <View style={{alignItems: 'flex-end', alignSelf: 'flex-end'}}>
            <View
              style={{
                padding: 20,
                maxWidth: '90%',
                backgroundColor: '#667085',
                borderRadius: theme.roundness * 3,
              }}>
              <Text style={{color: theme.colors.white}}>
                Hi Cassie! Would you be available for a coffee next week? 😁
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View>
                <Text>8:07</Text>
              </View>

              <View style={{marginLeft: 10}}>
                <Avatar
                  rounded
                  size={'small'}
                  style={{height: 20, width: 20}}
                  source={require('../../assets/Images/test.png')}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'flex-end',
              alignSelf: 'flex-start',
            }}>
            <View style={{marginRight: 10, marginBottom: 20}}>
              <Avatar
                rounded
                size={'small'}
                source={require('../../assets/Images/test.png')}
              />
            </View>

            <View>
              <View
                style={{
                  padding: 20,
                  maxWidth: '90%',
                  backgroundColor: '#EAECF2',
                  borderRadius: theme.roundness * 3,
                }}>
                <Text>
                  Hi Cassie! Would you be available for a coffee next week? 😁
                </Text>
              </View>

              <View style={{marginTop: 5}}>
                <Text>8:07</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            paddingVertical: 15,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10,
            backgroundColor: theme.colors.white,
          }}>
          <View style={{flex: 1}}>
            <TextInput
              multiline
              numberOfLines={3}
             // value={''}
              placeholder={'Type here..'}
            />
          </View>

          <View>
            <TouchableOpacity
            // disabled={!textMessage}
            >
              <MaterialIcons name={'send'} size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default SingleConversationScreen;
