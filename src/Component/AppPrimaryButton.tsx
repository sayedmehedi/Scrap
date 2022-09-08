import React from 'react';
import { useTheme } from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import { View, Text, TouchableOpacity, StyleProp, TextStyle, ViewStyle, GestureResponderEvent } from 'react-native';

export default function AppPrimaryButton({
  text,
  onPress,
  iconProps = {},
  textStyle = {},
  containerStyle = {},
  iconContainerStyle = {},
}: {
  text: string,
  onPress?: (event: GestureResponderEvent) => void,
  textStyle?: StyleProp<TextStyle>,
  containerStyle?: StyleProp<ViewStyle>
  iconContainerStyle?: StyleProp<ViewStyle>
  iconProps?: Omit<React.ComponentProps<typeof Octicons>, "name">,
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          width: 270,
          height: 50,
          borderRadius: 50,
          alignSelf: 'center',
          alignItems: 'center',
          position: 'relative',
          flexDirection: 'row',
          backgroundColor: theme.colors.primary,
        },
        containerStyle,
      ]}
      onPress={(...args) => {
        onPress?.(...args);
      }}>
      <View
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: '600',
              // @ts-ignore
              color: theme.colors.white,
            },
            textStyle,
          ]}>
          {text}
        </Text>
      </View>

      <View
        style={[
          {
            top: 0,
            right: 0,
            width: 50,
            height: 50,
            borderRadius: 50,
            marginLeft: 'auto',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
          iconContainerStyle,
        ]}>
        <Octicons
          size={26}
          name={'arrow-right'}
          // @ts-ignore
          color={theme.colors.white}
          {...iconProps}
        />
      </View>
    </TouchableOpacity>
  );
}
