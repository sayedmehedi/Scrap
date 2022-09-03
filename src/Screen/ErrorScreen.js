import { View, Text } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'

const ErrorScreen = () => {
  return (
    <View style={{flex:1,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center'}}>
        <AntDesign name='warning' size={30} color={'#F04E26'}/>
      <Text style={{color:'#E62B56',fontFamily:'Inter-Regular',fontSize:30}}>Error!!!</Text>
    </View>
  )
}

export default ErrorScreen