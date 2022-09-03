import React,{useState} from 'react';
import styles from './styles';
import Colors from '../../Constant/Colors';
import {Rating} from 'react-native-elements';
import {RootStackRoutes} from '../../Constant/routes';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EachProductItem from '../../Component/EachProductItem';
import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const images = [
  {
    id: 1,
    uri: 'https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg',
  },
  {
    id: 2,
    uri: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  },
  {
    id: 3,
    uri: 'https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },
  {
    id: 4,
    uri: 'https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg',
  },
  {
    id: 5,
    uri: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
  },
  {
    id: 6,
    uri: 'https://images.pexels.com/photos/1172253/pexels-photo-1172253.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
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

 

const renderAllProduct = ({item}) => <EachProductItem item={item} />;

const ProductDetailsScreen = ({navigation}) => {

  const [image,setImage] = useState('https://image.shutterstock.com/image-photo/mountains-under-mist-morning-amazing-260nw-1725825019.jpg')
 

  React.useEffect(() => {
    navigation.setOptions({
      title: 'Large Cage',
      headerRight:()=> {
        return(
          <View style={{flexDirection:'row'}}>
            <AntDesign name='sharealt' size={20} color={'white'}/>
            <View style={{paddingHorizontal:10}}>
            <AntDesign name='hearto' size={20} color={'white'}/>
            </View>
          </View>
        )
      }
    });
  }, [navigation]);
  const handlePlaceBid = () => {
    navigation.navigate(RootStackRoutes.PLACE_BID);
  };
  const handleMakeOffer = () => {
    navigation.navigate(RootStackRoutes.MAKE_BID);
  };

  

  return (
    <>
      <View style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <ScrollView>
          <Image
            source={{
              uri: image,
            }}
            style={{
              height: 240,
              width: '100%',
            }}
          />

          <View style={{padding: 10}}>
            <FlatList
              data={images}
              renderItem={({item}) => {
  
                return (
                  <TouchableOpacity
                  onPress={()=> setImage(item.uri)}
                  key={item.id}>
                    <Image
                      source={{uri: item.uri}}
                      style={{height: 70, width: 70, borderRadius: 35, marginHorizontal: 8}}
                    />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <View style={{padding: 10}}>
            <Text
              style={{
                fontFamily: 'Inter-SemiBold',
                fontSize: 25,
                color: '#252522',
              }}>
              Large Cage Free White
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:15}}>
              <Feather name="map-pin" size={14} color={'#191F2B'} />
              <Text style={{fontFamily: 'Inter-Regular', color: '#667085'}}>
                {' '}
                New Your: 30 Miles
              </Text>
            </View>

            <View style={{marginVertical:10}}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 25,
                  color: '#252522',
                }}>
                $15.00
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                  marginVertical: 5,
                  borderBottomColor: '#CBCBCB',
                }}>
                <Text style={{fontFamily: 'Inter-Regular', color: '#667085'}}>
                  Starting Price | 2 bids | 2d 20h 30m
                </Text>
              </View>
            </View>

            <View style={{marginVertical:5}}>
              <Text
                style={{
                  fontFamily: 'Inter-SemiBold',
                  fontSize: 25,
                  color: '#252522',
                }}>
                $22.00
              </Text>
              <View
                style={{
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                  marginVertical: 5,
                  borderBottomColor: '#CBCBCB',
                }}>
                <Text style={{fontFamily: 'Inter-Regular', color: '#667085'}}>
                  Buy It Now Price
                </Text>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                paddingVertical: 5,
                borderBottomColor: '#CBCBCB',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom:10
              }}>
              <Text style={{fontFamily: 'Inter-Regular', color: '#667085'}}>
                Time Left:
              </Text>
              <View style={{alignItems: 'center', margin: 5}}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      color: '#023047',
                      fontSize: 16,
                      fontFamily: 'Inter-Medium',
                    }}>
                    02
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 10,
                    color: '#023047',
                  }}>
                  Days
                </Text>
              </View>
              <Text>:</Text>

              <View style={{alignItems: 'center', margin: 5}}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      color: '#023047',
                      fontSize: 16,
                      fontFamily: 'Inter-Medium',
                    }}>
                    23
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 10,
                    color: '#023047',
                  }}>
                  Hours
                </Text>
              </View>
              <Text>:</Text>

              <View style={{alignItems: 'center', margin: 5}}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      color: '#023047',
                      fontSize: 16,
                      fontFamily: 'Inter-Medium',
                    }}>
                    30
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 10,
                    color: '#023047',
                  }}>
                  Minutes
                </Text>
              </View>
              <Text>:</Text>

              <View style={{alignItems: 'center', margin: 5}}>
                <View style={styles.timeContainer}>
                  <Text
                    style={{
                      color: '#023047',
                      fontSize: 16,
                      fontFamily: 'Inter-Medium',
                    }}>
                    44
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: 'Inter-Regular',
                    fontSize: 10,
                    color: '#023047',
                  }}>
                  Seconds
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.placeBidButton}
              onPress={handlePlaceBid}>
              <View></View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 16,
                  color: 'white',
                }}>
                Place Bid
              </Text>
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}>
                <Octicons name="arrow-right" color={'white'} size={26} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.makeofferButton, {marginVertical: 10}]}
              onPress={handleMakeOffer}>
              <View></View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 16,
                  color: '#023047',
                }}>
                Make Offer
              </Text>
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#023047',
                }}>
                <Octicons name="arrow-right" color={'#023047'} size={26} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.makeofferButton}>
              <View></View>
              <Text
                style={{
                  fontFamily: 'Inter-Regular',
                  fontSize: 16,
                  color: '#023047',
                }}>
                Buy It Now
              </Text>
              <View
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#023047',
                }}>
                <Octicons name="arrow-right" color={'#023047'} size={26} />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                color: '#252522',
                fontFamily: 'Inter-SemiBold',
                fontSize: 16,
                marginTop: 20,
              }}>
              About this product
            </Text>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#002642',
                marginVertical: 5,
                marginBottom:10
              }}>
              <View
                style={{
                  width: '20%',
                  height: 1,
                  backgroundColor: Colors.PRIMARY_COLOR,
                }}
              />
            </View>

            <Text>Condition: New</Text>
            <Text>
              Category: Clothing, Shoes, & Accessories - Girls' clothing
            </Text>
            <Text>Brand: Staci</Text>
            <Text>Model: Xl1</Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 28,
                
              }}>
              <Image
                source={require('../../assets/Images/test.png')}
                style={{height: 75, width: 75, borderRadius: 40}}
              />
              <View style={{marginLeft: 10}}>
                <Text>Carson</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 10,
                  }}>
                  <Rating
                    showRating={false}
                    imageSize={15}
                    startingValue={4}
                    lock={true}
                    readonly={true}
                  />
                  <Text>(22 rating)</Text>
                </View>

                <Text>Member Since May 2021</Text>
              </View>
            </View>

            <Text style={{
              color: '#252522',
              fontFamily: 'Inter-SemiBold',
              fontSize: 16,
              
            }}
            >Descriptions</Text>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#002642',
                marginVertical: 5,
              }}>
              <View
                style={{
                  width: '20%',
                  height: 1,
                  backgroundColor: Colors.PRIMARY_COLOR,
                }}
              />
            </View>
            <View>
              <Text style={{textAlign:'left'}} >
               Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. 
                
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </Text>
            </View>

            <View style={{padding: 10,marginVertical:10}}>
              <Image
                source={require('../../assets/Images/map.jpeg')}
                style={{height: 200, width: '100%'}}
              />
            </View>

            <Text style={{
               color: '#252522',
               fontFamily: 'Inter-SemiBold',
               fontSize: 16,
               marginTop:10
            }}>More like this</Text>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#002642',
                marginVertical: 5,
              }}>
              <View
                style={{
                  width: '20%',
                  height: 1,
                  backgroundColor: Colors.PRIMARY_COLOR,
                }}
              />
            </View>

            <View style={{paddingVertical: 10}}>
              <FlatList
                data={productData}
                renderItem={renderAllProduct}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                horizontal
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('askQuestion')}
            style={styles.askButton}>
            <AntDesign name="questioncircleo" size={25} color={'#FFFFFF'} />
            <Text
              style={{
                fontFamily: 'Inter-Medium',
                color: '#FFFFFF',
                fontSize: 16,
                marginLeft: 10,
              }}>
              Ask Question
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

export default ProductDetailsScreen;
