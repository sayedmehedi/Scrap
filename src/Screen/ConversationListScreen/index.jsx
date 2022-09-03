import React from 'react';
import EachConversation from './EachConversation';
import {SafeAreaView, View, Text, FlatList} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const categories = [
  {
    id: '1',
    name: 'Electronics & Media',
    uri: '../../assets/Images/electronics.png',
  },
  {
    id: '2',
    name: 'Home & Garden',
    uri: '../../assets/Images/electronics.png',
  },
  {
    id: '3',
    name: 'Clothing Shoes',
    uri: '../../assets/Images/electronics.png',
  },
  {
    id: '4',
    name: 'Vehicles',
    uri: '../../assets/Images/electronics.png',
  },
  {
    id: '5',
    name: 'Electronic',
    uri: '../../assets/Images/electronics.png',
  },
];

const renderAllUser = ({item}) => <EachConversation item={item} />;

const ConversationListScreen = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7F7'}}>
        <View
          style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
          <Text
            style={{
              color: '#51B764',
              fontSize: 14,
              fontFamily: 'Inter-Regular',
            }}>
            You have 2 new message
          </Text>
        </View>

        <View>
          <FlatList
            data={categories}
            renderItem={renderAllUser}
            keyExtractor={item => item.id}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ConversationListScreen;
