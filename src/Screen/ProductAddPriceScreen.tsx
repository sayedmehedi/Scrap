import React, { useState } from 'react';
import { Switch } from 'react-native-paper';
import { currencyTransform } from '@utils/form';
import DatePicker from 'react-native-date-picker';
import { Controller, useForm } from 'react-hook-form';
import Entypo from 'react-native-vector-icons/Entypo';
import { Text, useTheme } from 'react-native-paper';
import { PostItemStackRoutes } from '../constants/routes';
import { useNavigation } from '@react-navigation/native';
import SelectionModal from '../Component/SelectionModal';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AppPrimaryButton from '../Component/AppPrimaryButton';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Image, ListItem, CheckBox } from 'react-native-elements';
import { TextInput, View, Alert, ScrollView, Pressable } from 'react-native';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


export default function ProductAddPriceScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [modalType, setModalType] = React.useState('');
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const { control } = useForm({
    defaultValues: {
      duration: 0,
      buynowprice: 0,
      startingPrice: 0,
      listingOnSubmit: false,

      beginDay: '',
      beginHour: '',
      beginMinute: '',
    },
  });

  const handleNextScreen = () => {
    navigation.navigate(PostItemStackRoutes.ADD_DELIVERY_METHOD, {

    });
  };

  return (
    <ScrollView style={{ padding: 15 }}>
      <DatePicker
        modal
        open={open}
        date={date}
        mode={"date"}
        onConfirm={date => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <SelectionModal
        onSave={() => { }}
        initialValue={0}
        title={'Select Hour'}
        open={modalType === 'hours'}
        items={new Array(24).fill(0).map((_, id) => ({
          id,
          text: id + 1
        }))}
        onClose={() => setModalType('')}
      />

      <SelectionModal
        onSave={() => { }}
        initialValue={0}
        title={'Select Minutes'}
        open={modalType === 'minutes'}
        items={new Array(60).fill(0).map((_, id) => ({
          id,
          text: id + 1
        }))}
        onClose={() => setModalType('')}
      />

      <Controller
        name={'startingPrice'}
        control={control}
        render={({ field }) => {
          return (
            <React.Fragment>
              <Text style={{ marginBottom: 10, color: '#222222', fontSize: 16 }}>
                Starting Price
              </Text>

              <TextInput
                keyboardType="numeric"
                value={currencyTransform.inputFloat(field.value)}
                onChangeText={(price) => field.onChange(currencyTransform.outputFloat(price))}
                style={{
                  padding: 15,
                  fontSize: 25,
                  maxHeight: 110,
                  borderWidth: 1,
                  borderColor: "#C9C9C9",
                  borderRadius: theme.roundness * 4,
                  backgroundColor: theme.colors.white,
                }}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{ height: 15 }} />

      <Controller
        name={'buynowprice'}
        control={control}
        render={({ field }) => {
          return (
            <React.Fragment>
              <Text style={{ marginBottom: 10, color: '#222222', fontSize: 16 }}>
                Buy now price
              </Text>

              <TextInput
                keyboardType="numeric"
                value={currencyTransform.inputFloat(field.value)}
                onChangeText={(price) => field.onChange(currencyTransform.outputFloat(price))}
                style={{
                  padding: 15,
                  fontSize: 25,
                  maxHeight: 110,
                  borderWidth: 1,
                  borderColor: "#C9C9C9",
                  borderRadius: theme.roundness * 4,
                  backgroundColor: theme.colors.white,
                }}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{ height: 15 }} />

      <Controller
        control={control}
        name={'duration'}
        render={({ field }) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('duration')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    elevation: 2
                  }}>
                  <Text style={{ color: '#222222', fontSize: 14 }}>Select Duration</Text>
                  <Text>{field.value?.text}</Text>
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                initialValue={field.value}
                title={'Select Duration'}
                open={modalType === 'duration'}
                items={[
                  {
                    id: 1,
                    text: '2',
                  },
                  {
                    id: 2,
                    text: '3',
                  },
                  {
                    id: 3,
                    text: '4',
                  },
                  {
                    id: 4,
                    text: '5',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginLeft: -10 }}>
        <CheckBox
          center
          checked={true}
          uncheckedIcon="circle-o"
          checkedIcon="dot-circle-o"
          containerStyle={{
            padding: 1,
            paddingLeft: 0,
          }}
        />

        <Text>When I submit then, I'll start my listings</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: -10 }}>
        <CheckBox
          center
          checked={true}
          checkedColor="#023047"
          uncheckedIcon="circle-o"
          checkedIcon="dot-circle-o"
          containerStyle={{
            padding: 0,
          }}
        />

        <Text>Expected to begin on</Text>
      </View>

      <View
        style={{
          marginTop: 12,
          flexWrap: "wrap",
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>

        <TouchableOpacity
          onPress={() => setOpen(true)}
          containerStyle={{
            flex: 1,
            marginRight: 10
          }}
          style={{
            padding: 10,
            borderRadius: 5,
            backgroundColor: "white",
          }}>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text style={{ fontWeight: "700", textAlign: "center" }}>Day</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontWeight: "600" }}>Day</Text>

            <EvilIcons name="chevron-down" size={25} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModalType("hours")}
          containerStyle={{
            flex: 1,
            marginRight: 10
          }}
          style={{
            padding: 10,
            borderRadius: 5,
            backgroundColor: "white",
          }}>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text style={{ fontWeight: "700", textAlign: "center" }}>Hours</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontWeight: "600" }}>Hours</Text>

            <EvilIcons name="chevron-down" size={25} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModalType("minutes")}
          containerStyle={{
            flex: 1,
          }}
          style={{
            padding: 10,
            borderRadius: 5,
            backgroundColor: "white",
          }}>
          <View
            style={{
              marginBottom: 10,
            }}>
            <Text style={{ fontWeight: "700", textAlign: "center" }}>Minutes</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontWeight: "600", }}>Minutes</Text>

            <EvilIcons name="chevron-down" size={25} />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 40,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text>Do you want to show metals current/live price</Text>
        <Switch
          value={isSwitchOn}
          onValueChange={onToggleSwitch}
          color={'green'}
        />
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
        <TouchableOpacity
          containerStyle={{
            flex: 1
          }}
          style={{
            height: 40,
            minWidth: 100,
            marginRight: 15,
            borderRadius: 5,
            marginBottom: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E62B56',
          }}>
          <Text style={{ fontFamily: 'Inter-Regular', color: 'white' }}>
            Gold
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          containerStyle={{
            flex: 1
          }}
          style={{
            height: 40,
            minWidth: 100,
            marginRight: 15,
            borderRadius: 5,
            marginBottom: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E62B56',
          }}>
          <Text style={{ fontFamily: 'Inter-Regular', color: 'white' }}>
            Copper
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          containerStyle={{
            flex: 1
          }}
          style={{
            height: 40,
            minWidth: 100,
            marginRight: 0,
            borderRadius: 5,
            marginBottom: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E62B56',
          }}>
          <Text style={{ fontFamily: 'Inter-Regular', color: 'white' }}>
            Gold
          </Text>
        </TouchableOpacity>
      </View>

      <AppPrimaryButton
        text={'Next'}
        onPress={handleNextScreen}
        containerStyle={{ marginVertical: 35 }}
      />
    </ScrollView>
  );
}
