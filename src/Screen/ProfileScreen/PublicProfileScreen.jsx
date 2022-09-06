import {FlatList, View, Text, ImageBackground} from 'react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import Header from '../../Component/Header';
import CustomStatusBar from '../../Component/CustomStatusBar';
import EachProductItem from '../../Component/EachProductItem';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Rating} from 'react-native-elements';
import styles from './styles';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

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
  {
    id: '6',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/test.png'),
  },
  {
    id: '7',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod2.png'),
  },
  {
    id: '8',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod3.png'),
  },
  {
    id: '9',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod4.png'),
  },
  {
    id: '10',
    location: 'Lufkin, TX',
    name: 'Fasion boho chic',
    price: '$15.90',
    uri: require('../../assets/Images/prod5.png'),
  },
];

const renderAllProduct = ({item}) => <EachProductItem item={item} />;

const PublicProfileScreen = () => {
  return (
    <>
      <ScrollView>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 10,
          }}>
          <TouchableOpacity style={{marginTop: 20}}>
            <ImageBackground
              source={require('../../assets/Images/logo.png')}
              style={{height: 100, width: 100, borderRadius: 50}}>
              <View
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AntDesign name="camerao" size={26} color={'#FFFFFF'} />
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <Text style={{fontFamily: 'Inter-Bold', fontSize: 20}}>
            William P. Martinez
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Rating
              showRating={false}
              imageSize={15}
              startingValue={4}
              lock={true}
              readonly={true}
            />
            <Text style={{marginLeft: 8}}>{`(22 rating)`}</Text>
          </View>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 12,
              color: '#667085',
            }}>
            Miami,FL
          </Text>
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 12,
              color: '#667085',
            }}>
            Joined December 17,2021
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <View style={{alignItems: 'center', marginRight: 5}}>
              <Text>43</Text>
              <Text>Sold</Text>
            </View>

            <View style={{alignItems: 'center', marginLeft: 5}}>
              <Text>10</Text>
              <Text>Purchased</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              borderTopWidth: 1,
              borderTopColor: '#E2E2E2',
              borderBottomWidth: 1,
              borderBottomColor: '#E2E2E2',
              paddingVertical: 10,
              width: '100%',
              justifyContent: 'center',
            }}>
            <View style={styles.socialMediaContainer}>
              <Fontisto name="email" size={20} color={'#707070'} />
            </View>

            <View style={styles.socialMediaContainer}>
              <Fontisto name="email" size={20} color={'#707070'} />
            </View>
            <View style={styles.socialMediaContainer}>
              <Feather name="phone" size={20} color={'#707070'} />
            </View>
            <View style={styles.socialMediaContainer}>
              <Feather name="facebook" size={20} color={'#707070'} />
            </View>
          </View>

          <Text
            style={{
              fontFamily: 'Inter-SemiBold',
              fontSize: 14,
              color: '#344054',
              marginVertical: 10,
            }}>
            This Seller Product
          </Text>
        </View>

        <View>
          <FlatList
            data={productData}
            renderItem={renderAllProduct}
            keyExtractor={item => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default PublicProfileScreen;
