import React from 'react';
import styles from './styles';
import {
  View,
  Image,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../Constant/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import EachProductItem from '../../Component/EachProductItem';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import EachCateriesItem from '../../Component/EachCateriesItem';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RootStackRoutes} from '../../Constant/routes';

const categories = [
  {
    id: '1',
    name: 'Electronics & Media',
    uri: (
      <Image
        source={require('../../assets/Images/electronics.png')}
        style={{width: 20, height: 35}}
      />
    ),
  },
  {
    id: '2',
    name: 'Home & Garden',
    uri: (
      <Image
        source={require('../../assets/Images/category2.png')}
        style={{height: 31, width: 25}}
      />
    ),
  },
  {
    id: '3',
    name: 'Clothing Shoes',
    uri: (
      <Image
        source={require('../../assets/Images/category3.png')}
        style={{height: 31, width: 36}}
      />
    ),
  },
  {
    id: '4',
    name: 'Vehicles',
    uri: (
      <Image
        source={require('../../assets/Images/category4.png')}
        style={{height: 25, width: 31}}
      />
    ),
  },
  {
    id: '5',
    name: 'Electronic',
    uri: (
      <Image
        source={require('../../assets/Images/electronics.png')}
        style={{width: 20, height: 35}}
      />
    ),
  },
];

const productData = [
  {
    id: '1',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/test.png'),
  },
  {
    id: '2',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod2.png'),
  },
  {
    id: '3',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod3.png'),
  },
  {
    id: '4',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod4.png'),
  },
  {
    id: '5',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod5.png'),
  },
];

const renderAllCategories = ({item}) => <EachCateriesItem item={item} />;
const renderAllProduct = ({item}) => <EachProductItem item={item} />;

const HomeScreen = ({navigation}) => {
  const handleRedirectToNotificatoins = () => {
    navigation.navigate(RootStackRoutes.NOTIFICATIONS);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <View style={styles.homeHeader}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../assets/Images/logo.png')}
              style={{
                height: 40,
                width: 40,
              }}
            />
            <Text
              style={{
                fontFamily: 'Inter-Bold',
                fontSize: 18,
                color: '#FFFFFF',
                marginLeft: 10,
              }}>
              Scrap App
            </Text>
          </View>

          <MaterialIcons
            onPress={handleRedirectToNotificatoins}
            name="notifications-none"
            color={'white'}
            size={22}
          />
        </View>

       <ScrollView
       showsVerticalScrollIndicator={false}
       contentContainerStyle={{
        paddingHorizontal: 10,
        paddingBottom:15
        
      }}
       >
       <Pressable
          style={styles.searchButton}
          onPress={() => navigation.navigate(RootStackRoutes.SEARCH_PRODUCT)}>
          <EvilIcons name="search" size={20} color={'#252522'} />
          <Text
            style={{
              color: '#1D1D1B',
              fontFamily: 'Inter-Regular',
              fontSize: 12,
              marginLeft: 10,
            }}>
            Search
          </Text>
        </Pressable>
       
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 15,
            }}>
            <Text
              style={{
                color: '#191F2B',
                fontSize: 16,
                fontFamily: 'Inter-Bold',
              }}>
              All Categories
            </Text>
            <Pressable
              onPress={() => navigation.navigate('allCategories')}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 12,
                  color: Colors.PRIMARY_COLOR,
                }}>
                View All
              </Text>
              <EvilIcons
                name="chevron-right"
                size={18}
                color={Colors.PRIMARY_COLOR}
              />
            </Pressable>
          </View>
          <View>
            <FlatList
              horizontal
              data={categories}
              keyExtractor={item => item.id}
              renderItem={renderAllCategories}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 15,
            }}>
            <Text
              style={{
                color: '#191F2B',
                fontSize: 16,
                fontFamily: 'Inter-Bold',
              }}>
              Local Pickup
            </Text>
            <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('localPickup')}>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                    color: Colors.PRIMARY_COLOR,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
              <EvilIcons
                name="chevron-right"
                size={18}
                color={Colors.PRIMARY_COLOR}
              />
            </Pressable>
          </View>
          <View>
            <FlatList
              horizontal
              data={productData}
              renderItem={renderAllProduct}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 15,
            }}>
            <Text
              style={{
                color: '#191F2B',
                fontSize: 16,
                fontFamily: 'Inter-Bold',
              }}>
              Shipping
            </Text>

            <Pressable style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => navigation.navigate('shipping')}>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 12,
                    color: Colors.PRIMARY_COLOR,
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
              <EvilIcons
                name="chevron-right"
                size={18}
                color={Colors.PRIMARY_COLOR}
              />
            </Pressable>
          </View>
          <View>
            <FlatList
              horizontal
              data={productData}
              renderItem={renderAllProduct}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
      
       </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;
