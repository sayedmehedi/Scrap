import React from 'react';
import {View, ScrollView} from 'react-native';
import {Title, Text, useTheme} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function NotificationsScreen() {
  const theme = useTheme();

  return (
    <View style={{padding: 15}}>
      <Title style={{marginBottom: 15}}>Today</Title>

      <ScrollView>
        <View
          style={{
            padding: 15,
            marginBottom: 15,
            flexDirection: 'row',
            borderRadius: theme.roundness * 3,
            backgroundColor: theme.colors.white,
          }}>
          <View
            style={{
              width: 35,
              height: 35,
              //   marginRight: 15,
              borderRadius: 1000,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(81, 183, 100, 0.25)',
            }}>
            <MaterialIcons
              size={22}
              color={'#51B764'}
              name="notifications-none"
            />
          </View>

          <View style={{flex: 1, paddingLeft: 15}}>
            <View
              style={{
                marginBottom: 15,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#F04E26',
                  fontWeight: '700',
                }}>
                Out Bid
              </Text>

              <Text>Just Now</Text>
            </View>

            <Text style={{color: theme.colors.tertiary}}>
              27-29 June on selected Vegetables, Food Grocery and Beverages.
            </Text>
          </View>
        </View>

        <View
          style={{
            padding: 15,
            marginBottom: 15,
            flexDirection: 'row',
            borderRadius: theme.roundness * 3,
            backgroundColor: theme.colors.white,
          }}>
          <View
            style={{
              width: 35,
              height: 35,
              //   marginRight: 15,
              borderRadius: 1000,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(81, 183, 100, 0.25)',
            }}>
            <MaterialIcons
              size={22}
              color={'#51B764'}
              name="notifications-none"
            />
          </View>

          <View style={{flex: 1, paddingLeft: 15}}>
            <View
              style={{
                marginBottom: 15,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#51B764',
                  fontWeight: '700',
                }}>
                Pay now
              </Text>

              <Text>10 mins ago</Text>
            </View>

            <Text style={{color: theme.colors.tertiary}}>
              27-29 June on selected Vegetables, Food Grocery and Beverages.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
