import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

const ContactUsScreen = () => {
  return (
    <WebView source={{ uri: 'https://beta.thescrapapp.com/terms-privacy' }} />
  )
}

export default ContactUsScreen