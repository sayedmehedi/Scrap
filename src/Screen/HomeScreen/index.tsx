import React from 'react';
import styles from './styles';
import CategoryList from './CategoryList';
import Colors from '../../constants/Colors';
import ProductPreviewList from './ProductPreviewList';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HomeStackRoutes, RootStackRoutes } from '../../constants/routes';
import {
  View,
  Image,
  Text,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

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
              onPress={() => navigation.navigate(HomeStackRoutes.ALL_CATEGORIES as never)}
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
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate(HomeStackRoutes.LOCAL_PICKUP)
                }}>
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
              <TouchableOpacity onPress={() => {
                // @ts-ignore
                navigation.navigate(HomeStackRoutes.SHIPPING)
              }}>
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
