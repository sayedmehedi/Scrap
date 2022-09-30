import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

const HelpAndSupportScreen = () => {
  return (
    <WebView source={{ uri: 'https://beta.thescrapapp.com/faq' }} />
  )
}

export default HelpAndSupportScreen