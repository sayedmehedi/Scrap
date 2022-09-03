import React from 'react';
import styles from './styles';
import {Rating} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  ImageBackground,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {AuthContext} from '../../Providers/AuthProvider';

const ProfileScreen = ({navigation}) => {
  const {logout} = React.useContext(AuthContext);

  const signoutPress = () =>
    Alert.alert('Sign Out!', 'Are you sure you want to Signout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Logout', onPress: () => logout()},
    ]);

  return (
    <ScrollView>
      <View style={{alignSelf: 'center', alignItems: 'center'}}>
       <TouchableOpacity>
       <ImageBackground
          source={require('../../assets/Images/logo.png')}
          style={{height: 100, width: 100, borderRadius: 50,marginTop:20}}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
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
          style={{fontFamily: 'Inter-Regular', fontSize: 12, color: '#667085'}}>
          Miami,FL
        </Text>
        <Text
          style={{fontFamily: 'Inter-Regular', fontSize: 12, color: '#667085'}}>
          Joined December 17,2021
        </Text>
      </View>

      <View style={{paddingHorizontal: 12}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('publicProfile')}
          style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image source={(require('../../assets/Images/users.png'))} style={{height:20,width:25}}/>

            <Text style={{marginLeft: 10, color: '#707070'}}>
              Public Profile
            </Text>
          </View>

          <AntDesign name="right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('accountSetting')}
          style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons
              name="settings-input-component"
              size={20}
              color={'#707070'}
            />
            <Text style={{marginLeft: 10, color: '#707070'}}>
              Account Setting
            </Text>
          </View>

          <AntDesign name="right" size={20} color={'#707070'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('purchases')}
          style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo name="shopping-bag" size={20} color={'#707070'} />
            <Text style={{marginLeft: 10, color: '#707070'}}>Purchases</Text>
          </View>

          <AntDesign name="right" size={20} color={'#707070'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="money" size={20} color={'#707070'} />
            <Text style={{marginLeft: 10, color: '#707070'}}>Transactions</Text>
          </View>

          <AntDesign name="right" size={20} color={'#707070'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('saveProduct')}
          style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="hearto" size={20} color={'#707070'} />
            <Text style={{marginLeft: 10, color: '#707070'}}>
              Save Products
            </Text>
          </View>

          <AntDesign name="right" size={20} color={'#707070'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('offerAndBid')}
          style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="local-offer" size={20} color={'#707070'} />
            <Text style={{marginLeft: 10, color: '#707070'}}>
              Offers & Bids
            </Text>
          </View>

          <AntDesign name="right" size={20} color={'#707070'} />
        </TouchableOpacity>

        <TouchableOpacity
        onPress={()=>navigation.navigate('error')}
        style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="questioncircleo" size={20} color={'#707070'} />
            <Text style={{marginLeft: 10, color: '#707070'}}>
              Help & Support
            </Text>
          </View>

          <AntDesign name="right" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={signoutPress} style={styles.buttonContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo name="login" size={20} color={'#707070'} />
            <Text style={{marginLeft: 10, color: '#707070'}}>Sign Out</Text>
          </View>

          <AntDesign name="right" size={20} color={'#707070'} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
