import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../Constant/Colors';
import Header from '../../Component/Header';
import CustomStatusBar from '../../Component/CustomStatusBar';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const categories = [
  {
    id: 1,
    name: 'Electronics & Media',
    status: 'medicare',
  },
  {
    id: 2,
    name: 'Home & Garded',
    status: 'food',
  },
  {
    id: 3,
    name: 'Clothing, Shoes, & Accessoris',
    status: 'privatebox',
  },
  {
    id: 4,
    name: 'Baby & Kids',
    status: 'bodycare',
  },
  {
    id: 5,
    name: 'Vehicles',
    status: 'medicare',
  },
  {
    id: 6,
    name: 'Toys, Games & Hobbies',
    status: 'food',
  },
  {
    id: 7,
    name: 'Sports & Outdoors',
    status: 'privatebox',
  },
  {
    id: 8,
    name: 'Collectibles & Art',
    status: 'bodycare',
  },
  {
    id: 9,
    name: 'OTC Medicine',
    status: 'medicare',
  },
  {
    id: 10,
    name: 'Food Box',
    status: 'food',
  },
  {
    id: 11,
    name: 'Private Box',
    status: 'privatebox',
  },
  {
    id: 12,
    name: 'Body Care',
    status: 'bodycare',
  },
];

const AllCategoriesScreen = ({navigation}) => {
  const [active, setActive] = useState(null);

  const productRenderItem = ({item, index}) => {
    // console.log('image', item.icon_image);
    if (item.empty === true) {
      return null;
    }
    return (
      <View style={{paddingLeft:15}}>
        <TouchableOpacity activeOpacity={0.2}></TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('individualCategories')}
          style={{width: '100%', marginVertical: 7}}>
          <Text numberOfLines={2} style={{fontSize:14,fontFamily:'Inter-Light',color:'#403C39'}}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    const onPress = item => {
      console.log(item);
      // console.log('categoriId', item.id);
      //setCAtegoriId(item.id);
      LayoutAnimation.easeInEaseOut();
      setActive(index == active ? null : index);
      //   setSubCategoriDataList([
      //     ...subCategoris.filter(e => e.catagory === item.id),
      //   ]);
    };

    const open = active == index;
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={{padding: 20, borderBottomWidth: 0.3, marginHorizontal: 10}}
          //style={styles.item}
          onPress={() => onPress(item)}
          activeOpacity={1}
          key={item.id}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily:'Inter-Medium',
                fontSize: 14,
                color:'#403C39'
              }}>
              {item.name}
            </Text>
            {open ? (
              <FontAwesome name="sort-up" size={12} color={'black'} />
            ) : (
              <FontAwesome name="sort-down" size={12} color={'black'} />
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            {open && (
              <FlatList data={categories} renderItem={productRenderItem} />
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  };
  const isDarkMode = true;
  return (
    <>
      <CustomStatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.PRIMARY_COLOR}
      />
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <Header from="allCategories" />

        <View
          style={{
            width: '100%',
            //paddingBottom: 84,
            backgroundColor: '#F7F7F7',
          }}>
          <FlatList
            data={categories}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </>
  );
};

export default AllCategoriesScreen;

const styles = StyleSheet.create({});
