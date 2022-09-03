import React from 'react';
import RangeSlider from 'rn-range-slider';
import {useTheme, Text} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import CategorySelectionModal from './CategorySelectionModal';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppPrimaryButton from '../../Component/AppPrimaryButton';
import {ListItem, Divider, CheckBox, Button} from 'react-native-elements';
import {combinedDefaultTheme} from '../../Providers/PreferencesProvider/theme';

const renderLabel = value => (
  <Text style={{color: combinedDefaultTheme.colors.tertiary, marginTop: 5}}>
    ${value}
  </Text>
);

const renderThumb = () => (
  <View
    style={{
      width: 20,
      height: 20,
      borderRadius: 1000,
      backgroundColor: combinedDefaultTheme.colors.primary,
    }}
  />
);
const renderRail = () => (
  <View
    style={{
      flex: 1,
      height: 5,
      borderRadius: 8,
      backgroundColor: 'rgba(0,0,0,0.25)',
    }}
  />
);
const renderRailSelected = () => (
  <View
    style={{
      flex: 1,
      height: 5,
      backgroundColor: combinedDefaultTheme.colors.primary,
    }}
  />
);

const ProductFilterScreen = ({}) => {
  const navigation = useNavigation();

  const [openCategoryModal, setOpenCategoryModal] = React.useState(false);

  const theme = useTheme();

  const handleValueChange = (low, high) => {};

  return (
    <SafeAreaProvider>
      <ScrollView s tyle={{paddingHorizontal: 15}}>
        <CategorySelectionModal
          open={openCategoryModal}
          onClose={() => setOpenCategoryModal(false)}
        />
        <ListItem
          Component={TouchableOpacity}
          containerStyle={{backgroundColor: '#F7F7F7F'}}
          onPress={() => setOpenCategoryModal(true)}>
          <ListItem.Content>
            <ListItem.Title>Categories</ListItem.Title>
            <ListItem.Subtitle>
              Clothing, Shoes, & Accessories - Girls' clothing
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron size={30} />
        </ListItem>

        <Divider style={{width: '100%', height: 2}} />

        <ListItem
          Component={TouchableOpacity}
          containerStyle={{backgroundColor: '#F7F7F7F'}}
          onPress={() => {}}>
          <ListItem.Content>
            <ListItem.Title>Location</ListItem.Title>
            <ListItem.Subtitle>New Your: 30 miles</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron size={30} />
        </ListItem>

        <Divider style={{width: '100%', height: 2}} />

        <ListItem containerStyle={{backgroundColor: '#F7F7F7F'}}>
          <ListItem.Content>
            <ListItem.Title>Price Range</ListItem.Title>

            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
              }}>
              <RangeSlider
                style={{
                  width: '100%',
                  flexDirection: 'column-reverse',
                }}
                min={0}
                step={1}
                max={100}
                renderRail={renderRail}
                renderThumb={renderThumb}
                renderLabel={renderLabel}
                onValueChanged={handleValueChange}
                renderRailSelected={renderRailSelected}
              />
            </View>
          </ListItem.Content>
        </ListItem>

        <Divider style={{width: '100%', height: 2, marginTop: -10}} />

        <ListItem containerStyle={{backgroundColor: '#F7F7F7F'}}>
          <ListItem.Content>
            <ListItem.Title>Condition</ListItem.Title>

            <View
              style={{
                marginTop: 15,
                flexDirection: 'column',
              }}>
              <CheckBox
                checked
                title={'New'}
                iconType={'material'}
                checkedIcon={'radio-button-checked'}
                uncheckedIcon={'radio-button-unchecked'}
                containerStyle={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  borderWidth: 0,
                }}
              />

              <CheckBox
                iconType={'material'}
                title={'Reconditioned'}
                checkedIcon={'radio-button-checked'}
                uncheckedIcon={'radio-button-unchecked'}
                checked={false}
                containerStyle={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  borderWidth: 0,
                }}
              />

              <CheckBox
                iconType={'material'}
                checkedIcon={'radio-button-checked'}
                uncheckedIcon={'radio-button-unchecked'}
                title={'Open Box (Never used)'}
                checked={false}
                containerStyle={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  borderWidth: 0,
                }}
              />

              <CheckBox
                iconType={'material'}
                checkedIcon={'radio-button-checked'}
                uncheckedIcon={'radio-button-unchecked'}
                title={'Used'}
                checked={false}
                containerStyle={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  borderWidth: 0,
                }}
              />

              <CheckBox
                iconType={'material'}
                checkedIcon={'radio-button-checked'}
                uncheckedIcon={'radio-button-unchecked'}
                title={'Others'}
                checked={false}
                containerStyle={{
                  backgroundColor: 'transparent',
                  padding: 0,
                  borderWidth: 0,
                }}
              />
            </View>
          </ListItem.Content>
        </ListItem>

        <AppPrimaryButton text={'Apply Filter'} />

        <Button
          title={'Clear'}
          type={'clear'}
          containerStyle={{
            width: 270,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginVertical: 15,
            marginBottom: 30,
          }}
        />
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default ProductFilterScreen;
