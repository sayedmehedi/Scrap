import React, { useState } from 'react';
import Colors from '../constants/Colors';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthStackRoutes, RootStackRoutes } from '../constants/routes';

const Header = ({ from }: { from: string }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  if (modalVisible) {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          {/* onPress={() => setModalVisible(!modalVisible)} */}
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  alignSelf: 'flex-end',
                  padding: 15,
                }}>
                <Entypo name="cross" size={25} color={'#222222'} />
              </TouchableOpacity>

              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 16 }}>
                  Sort By
                </Text>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={true}
                    containerStyle={{
                      padding: 1,
                      paddingLeft: 0,
                    }}
                  />

                  <Text>Newest</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={true}
                    checkedColor="gray"
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>Price-Low to Hight</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={true}
                    checkedColor="gray"
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>Price-High to low</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={true}
                    checkedColor="gray"
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>Oldest</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    center
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={true}
                    checkedColor="gray"
                    containerStyle={{
                      padding: 1,
                    }}
                  />

                  <Text>Randomly</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (from == 'profile') {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-backspace" color={'white'} size={22} />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: 'white' }}>
          My Account
        </Text>
        <View></View>
      </View>
    );
  }
  if (from == 'accountSetting') {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-backspace" color={'white'} size={22} />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: 'white' }}>
          Account Setting
        </Text>
        <View></View>
      </View>
    );
  }
  if (from == 'offerAndBid') {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-backspace" color={'white'} size={22} />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: 'white' }}>
          Offers/Bids
        </Text>
        <View></View>
      </View>
    );
  }

  if (from == 'purchases') {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-backspace" color={'white'} size={22} />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: 'white' }}>
          Purchases
        </Text>
        <View></View>
      </View>
    );
  }

  if (from == 'saveProduct') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{ padding: 10 }}>
          <MaterialIcons name="keyboard-backspace" color={'white'} size={22} />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            color: 'white',
            marginLeft: 5,
          }}>
          Save Product
        </Text>
        <TouchableOpacity style={{ padding: 5 }}>
          <MaterialIcons name="category" size={25} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  }

  if (from == 'publicProfile') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{ padding: 10 }}>
          <MaterialIcons name="keyboard-backspace" color={'white'} size={22} />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Inter-Bold',
            fontSize: 18,
            color: 'white',
            marginLeft: 5,
          }}>
          Profile
        </Text>

        <TouchableOpacity style={{ padding: 5 }}>
          <MaterialIcons name="category" size={25} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  }
  if (from == 'selling') {
    return (
      <View>
        <Text>Selling Header</Text>
      </View>
    );
  }
  if (from == 'locationPickup') {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 10 }}>
            <MaterialIcons
              name="keyboard-backspace"
              color={'white'}
              size={22}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: 'Inter-Bold',
              fontSize: 18,
              color: 'white',
              marginLeft: 5,
            }}>
            Local Pickup
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(RootStackRoutes.SEARCH_PRODUCT)}
            style={{ padding: 5 }}>
            <AntDesign name="search1" size={25} color={'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{ padding: 5 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
              <Image
                source={require('../assets/Images/Arrow.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(AuthStackRoutes.PRODUCT_FILTER)}
            style={{ padding: 5 }}>
            <Image
              source={require('../assets/Images/filter.png')}
              style={{ height: 20, width: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (from == 'shipping') {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 10 }}>
            <MaterialIcons
              size={22}
              color={'white'}
              name="keyboard-backspace"
            />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: 'Inter-Bold',
              fontSize: 18,
              color: 'white',
              marginLeft: 5,
            }}>
            Shipping
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(RootStackRoutes.SEARCH_PRODUCT)}
            style={{ padding: 5 }}>
            <AntDesign name="search1" size={25} color={'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{ paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row', padding: 5 }}>
              <Image
                source={require('../assets/Images/Arrow.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(AuthStackRoutes.PRODUCT_FILTER)}
            style={{ padding: 5 }}>
            <Image
              source={require('../assets/Images/filter.png')}
              style={{ height: 20, width: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (from == 'allCategories') {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 10 }}>
            <MaterialIcons
              name="keyboard-backspace"
              color={'white'}
              size={22}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: 'Inter-Bold',
              fontSize: 18,
              color: 'white',
              marginLeft: 5,
            }}>
            All Categories
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(RootStackRoutes.SEARCH_PRODUCT)}
            style={{ padding: 5 }}>
            <AntDesign name="search1" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (from == 'productDetails') {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ padding: 10 }}>
            <MaterialIcons
              name="keyboard-backspace"
              color={'white'}
              size={22}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: 'Inter-Bold',
              fontSize: 18,
              color: 'white',
              marginLeft: 5,
            }}>
            Large Cage Free White
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ padding: 5 }}>
            <AntDesign name="sharealt" size={25} color={'white'} />
          </TouchableOpacity>

          <TouchableOpacity style={{ padding: 5 }}>
            <AntDesign name="hearto" size={25} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (from == 'individualCategory') {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 10 }}>
            <MaterialIcons
              size={22}
              color={'white'}
              name="keyboard-backspace"
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              marginLeft: 5,
              color: 'white',
              fontFamily: 'Inter-Bold',
            }}>
            Girls Clothing
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(RootStackRoutes.SEARCH_PRODUCT)}
            style={{ padding: 5 }}>
            <AntDesign name="search1" size={25} color={'white'} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={{ padding: 5 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
              <Image
                source={require('../assets/Images/Arrow.png')}
                style={{
                  height: 20,
                  width: 20,
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(AuthStackRoutes.PRODUCT_FILTER)}
            style={{ padding: 5 }}>
            <Image
              source={require('../assets/Images/filter.png')}
              style={{ height: 20, width: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  if (from == 'askQuestion') {
    return (
      <View style={[styles.container, { height: '9%' }]}>
        <TouchableOpacity>
          <MaterialIcons name="keyboard-backspace" color={'white'} size={22} />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: 'white' }}>
          Ask Question
        </Text>
        <View></View>
      </View>
    );
  }

  return null
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: '10%',
    width: '100%',
    backgroundColor: Colors.PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  centeredView: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalView: {
    backgroundColor: 'white',

    height: 300,
    width: '100%',
  },
});
