import React from 'react';
import {Image} from 'react-native-elements';
import {Controller, useForm} from 'react-hook-form';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import {PostItemStackRoutes} from '../../constants/routes';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SelectionModal from '../../Component/SelectionModal';
import {HelperText, Text, useTheme} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppPrimaryButton from '../../Component/AppPrimaryButton';
import {TextInput, View, Alert, ScrollView, Pressable} from 'react-native';
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {FloatingLabelInput} from 'react-native-floating-label-input';

export default function ProductAddDetailsScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const [modalType, setModalType] = React.useState('');

  const {control} = useForm({
    defaultValues: {
      size: null,
      color: null,
      style: null,
      brand: '',
      material: null,
      sizeType: null,
      category: null,
      condition: null,
      subCategory: null,
      description: '',
    },
  });

  const handleNextScreen = () => {
    navigation.navigate(PostItemStackRoutes.ADD_PRICE);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{padding: 15}}>
      <Controller
        control={control}
        name={'category'}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('category')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Category*</Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                initialValue={field.value}
                title={'Select Category'}
                open={modalType === 'category'}
                items={[
                  {
                    id: 1,
                    text: "Clothing, Shoes, & Accessories - Girls' clothing",
                  },
                  {
                    id: 2,
                    text: 'Category 1',
                  },
                  {
                    id: 3,
                    text: 'Category 2',
                  },
                  {
                    id: 4,
                    text: 'Category 3',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />
      <Controller
        control={control}
        name={'subCategory'}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('subcategory')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Subcategory*</Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                initialValue={field.value}
                title={'Select Subcategory'}
                open={modalType === 'subcategory'}
                items={[
                  {
                    id: 1,
                    text: "Clothing, Shoes, & Accessories - Girls' clothing",
                  },
                  {
                    id: 2,
                    text: 'Category 1',
                  },
                  {
                    id: 3,
                    text: 'Category 2',
                  },
                  {
                    id: 4,
                    text: 'Category 3',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />
      <Controller
        control={control}
        name={'condition'}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('condition')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Condition*</Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                initialValue={field.value}
                title={'Select Condition'}
                open={modalType === 'condition'}
                items={[
                  {
                    id: 1,
                    text: 'Old',
                  },
                  {
                    id: 2,
                    text: 'New',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{height: 15}} />

      <View style={{width: '100%', marginBottom: 16}}>
        <Controller
          control={control}
          name={'brand'}
          render={({field}) => {
            return (
              <FloatingLabelInput
                label={'Brand'}
                value={field.value}
                onChangeText={field.onChange}
              />
            );
          }}
        />
      </View>

      <Controller
        control={control}
        name={'sizeType'}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('sizeType')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Size Type</Text>
                    <Text>{field.value?.text}</Text>
                  </View>
                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                title={'Select Size Type'}
                initialValue={field.value}
                open={modalType === 'sizeType'}
                items={[
                  {
                    id: 1,
                    text: 'Regular',
                  },
                  {
                    id: 2,
                    text: 'Large',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />
      <Controller
        name={'size'}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('size')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Size </Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                title={'Select Size'}
                initialValue={field.value}
                open={modalType === 'size'}
                items={[
                  {
                    id: 1,
                    text: 'XL',
                  },
                  {
                    id: 2,
                    text: 'XXL',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />
      <Controller
        name={'color'}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('color')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Color</Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                title={'Select Color'}
                initialValue={field.value}
                open={modalType === 'color'}
                items={[
                  {
                    id: 1,
                    text: 'Red',
                  },
                  {
                    id: 2,
                    text: 'Black',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />
      <Controller
        name={'style'}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('style')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Style</Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                title={'Select Style'}
                initialValue={field.value}
                open={modalType === 'style'}
                items={[
                  {
                    id: 1,
                    text: 'Maxi',
                  },
                  {
                    id: 2,
                    text: 'Mini',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />
      <Controller
        name={'material'}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType('style')}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={{color: '#222222'}}>Material</Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <SelectionModal
                onSave={field.onChange}
                title={'Select Material'}
                initialValue={field.value}
                open={modalType === 'style'}
                items={[
                  {
                    id: 1,
                    text: 'Cotton',
                  },
                  {
                    id: 2,
                    text: 'Iron',
                  },
                ]}
                onClose={() => setModalType('')}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />
      <Controller
        name={'description'}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Text style={{marginBottom: 10, color: '#222222'}}>
                Description
              </Text>
              <TextInput
                placeholder="Product details write here"
                multiline
                numberOfLines={5}
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

      <AppPrimaryButton
        text={'Next'}
        onPress={handleNextScreen}
        containerStyle={{marginVertical: 35}}
      />
    </ScrollView>
  );
}
