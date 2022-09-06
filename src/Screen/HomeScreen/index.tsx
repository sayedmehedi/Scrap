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
import CategoryList from './CategoryList';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import EachProductItem from '../../Component/EachProductItem';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HomeStackRoutes, HomeTabRoutes, RootStackRoutes } from '../../constants/routes';
import ProductPreviewList from './ProductPreviewList';


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


const HomeScreen = () => {

  const navigation = useNavigation();

  const handleRedirectToNotificatoins = () => {
    navigation.navigate(RootStackRoutes.NOTIFICATIONS);
  };


  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
        <View style={styles.homeHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
              Scrap Apps
            </Text>
          </View>

          <MaterialIcons
            color={'white'}
            size={22}
            name="notifications-none"
            onPress={handleRedirectToNotificatoins}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 15,
          }}>

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
              onPress={() => navigation.navigate(RootStackRoutes.HOME, {
                screen: HomeTabRoutes.HOME,
                params: {
                  screen: HomeStackRoutes.ALL_CATEGORIES
                }
              })}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
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
            <CategoryList />
          </View>
          <View
            style={{
              marginVertical: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: '#191F2B',
                fontSize: 16,
                fontFamily: 'Inter-Bold',
              }}>
              Local Pickup
            </Text>
            <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate(RootStackRoutes.HOME, {
                  screen: HomeTabRoutes.HOME,
                  params: {
                    screen: HomeStackRoutes.LOCAL_PICKUP
                  }
                })}>
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
            <ProductPreviewList params={{
              is_locale: "1"
            }} />
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

            <Pressable style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate(RootStackRoutes.HOME, {
                screen: HomeTabRoutes.HOME,
                params: {
                  screen: HomeStackRoutes.SHIPPING
                }
              })}>
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
            <ProductPreviewList params={{
              is_shipping: "1"
            }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;
