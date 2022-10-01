import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

const ContactUsScreen = () => {
  return (
    <WebView source={{ uri: 'https://beta.thescrapapp.com/legal/' }} />
  )
}

export default ContactUsScreen