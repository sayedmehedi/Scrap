import React,{useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import Entypo from 'react-native-vector-icons/Entypo';
import {PostItemStackRoutes} from '../Constant/routes';
import {useNavigation} from '@react-navigation/native';
import SelectionModal from '../Component/SelectionModal';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AppPrimaryButton from '../Component/AppPrimaryButton';
import {HelperText, Text, useTheme} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {TextInput, View, Alert, ScrollView, Pressable} from 'react-native';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Image, ListItem, CheckBox} from 'react-native-elements';
import DatePicker from 'react-native-date-picker'
import { Switch } from 'react-native-paper';
export default function ProductAddPriceScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [modalType, setModalType] = React.useState('');
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const {control} = useForm({
    defaultValues: {
      duration: 0,
      buynowprice: '0.0',
      startingPrice: '0.0',
      listingOnSubmit: false,

      beginDay: '',
      beginHour: '',
      beginMinute: '',
    },
  });

  const handleNextScreen = () => {
    navigation.navigate(PostItemStackRoutes.ADD_DELIVERY_METHOD);
  };

  return (
    <ScrollView style={{padding: 10}}>
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false)
          setDate(date)
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Controller
        name={'startingPrice'}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Text style={{marginBottom: 10, color:'#222222'}}>
                Starting Price
              </Text>
              <TextInput
                keyboardType="numeric"
                value={field.value}
                onChangeText={field.onChange}
                style={{
                  padding: 10,
                  maxHeight: 110,
                  borderRadius: theme.roundness * 3,
                  backgroundColor: theme.colors.white,
                }}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{height: 15}} />

      <Controller
        name={'buynowprice'}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Text style={{marginBottom: 10, color:'#222222'}}>
                Buy now price
              </Text>
              <TextInput
                keyboardType="numeric"
                value={field.value}
                onChangeText={field.onChange}
                style={{
                  padding: 10,
                  maxHeight: 110,
                  borderRadius: theme.roundness * 3,
                  backgroundColor: theme.colors.white,
                }}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{height: 15}} />

      <Controller
        control={control}
        name={'duration'}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('duration')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                  }}>
                  <Text style={{color:'#222222'}}>
                    Select Duration
                  </Text>
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

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          center
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={true}
          containerStyle={{
            padding:1,
            paddingLeft:0,
            
          }}
        />

        <Text>When I submit then, I'll start my listings</Text>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CheckBox
          center
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checked={true}
          checkedColor='#023047'
          containerStyle={{
            
            padding:1
          }}
        />

        <Text>Expected to begin on</Text>
      </View>

      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
        <TouchableOpacity
        onPressOut={()=>setOpen(true)}
        style={{
          height:40,
          width:100,
          backgroundColor:'white',
          marginHorizontal:5,
          padding:3,
          flexDirection:'row',
          justifyContent:'space-between',
          borderRadius:5
        }}
        >
        <Text>Date</Text>
        <EvilIcons name='chevron-down' size={25}/>

        </TouchableOpacity>

        <TouchableOpacity
        style={{
          height:40,
          width:100,
          backgroundColor:'white',
          marginHorizontal:5,
          padding:3,
          flexDirection:'row',
          justifyContent:'space-between',
          borderRadius:5
        }}
        >
          <Text>Hour</Text>
          <EvilIcons name='chevron-down' size={25}/>

        </TouchableOpacity>

        <TouchableOpacity
        style={{
          height:40,
          width:100,
          backgroundColor:'white',
          marginHorizontal:5,
          padding:3,
          flexDirection:'row',
          justifyContent:'space-between',
          borderRadius:5
        }}
        >
          <Text>minute</Text>
          <EvilIcons name='chevron-down' size={25}/>

        </TouchableOpacity>
      </View>

      <View style={{flexDirection:'row',alignItems:'center',marginVertical:10,justifyContent:'space-between'}}>
        <Text>Do you want to show metals current/live price</Text>
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} color={'green'} />

      </View>

      <View style={{flexDirection:'row',flexWrap:'wrap'}}>
        <TouchableOpacity
        style={{backgroundColor:'#E62B56',height:40,width:100,justifyContent:'center',alignItems:'center',borderRadius:5,margin:5}}
        >
          <Text style={{fontFamily:'Inter-Regular',color:'white'}}>Gold</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{backgroundColor:'#E62B56',height:40,width:100,justifyContent:'center',alignItems:'center',borderRadius:5,margin:5}}
        >
          <Text style={{fontFamily:'Inter-Regular',color:'white'}}>Copper</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{backgroundColor:'#E62B56',height:40,width:100,justifyContent:'center',alignItems:'center',borderRadius:5,margin:5}}
        >
          <Text style={{fontFamily:'Inter-Regular',color:'white'}}>Gold</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{backgroundColor:'#E62B56',height:40,width:100,justifyContent:'center',alignItems:'center',borderRadius:5,margin:5}}
        >
          <Text style={{fontFamily:'Inter-Regular',color:'white'}}>Gold</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={{backgroundColor:'#E62B56',height:40,width:100,justifyContent:'center',alignItems:'center',borderRadius:5,margin:5}}
        >
          <Text style={{fontFamily:'Inter-Regular',color:'white'}}>Gold</Text>
        </TouchableOpacity>
      </View>

      <AppPrimaryButton
        text={'Next'}
        onPress={handleNextScreen}
        containerStyle={{marginVertical: 35}}
      />
    </ScrollView>
  );
}
