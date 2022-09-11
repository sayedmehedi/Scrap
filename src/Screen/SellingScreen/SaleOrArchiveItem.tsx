import React from 'react';
import { FilterProduct } from '@src/types';
import { RootStackRoutes } from '@constants/routes';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View, Text, Image, Dimensions, Pressable } from 'react-native';

const { width } = Dimensions.get('window');
const itemWidth = width / 3;

const SaleOrArchiveItem = ({ item, }: { item: FilterProduct & { type: "data" } | { id: number; type: "skeleton" } }) => {
    const navigation = useNavigation();

    if (item.type === "skeleton") {
        return <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={itemWidth - 6}>
                <SkeletonPlaceholder.Item width={110} height={120} />
                <SkeletonPlaceholder.Item width={50} height={4} marginTop={5} />
                <SkeletonPlaceholder.Item width={80} height={7} marginTop={5} />
                <SkeletonPlaceholder.Item width={30} height={7} marginTop={5} />
            </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
    }

    return (
        <Pressable
            style={{
                margin: 3,
            }}
            onPress={() => navigation.navigate(RootStackRoutes.PRODUCT_DETAILS, {
                productId: item.id,
            })}>
            <View
                style={{
                    height: 130,
                    position: "relative",
                    width: itemWidth - 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                }}>
                <Image
                    source={{ uri: item.image }}
                    style={{
                        width: 110,
                        height: 120,
                    }}
                />
                <View style={{ position: "absolute", bottom: 0, width: "100%", padding: 5, alignItems: "center", backgroundColor: "#191F2B" }}>
                    <Text style={{ fontSize: 10, color: "white" }}>{item.total_bids} Bids | {item.total_offers} Offers</Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                    justifyContent: 'space-between',
                }}>
                <Text style={{ fontSize: 10, fontFamily: 'Inter-Regular', color: '#023047' }}>
                    {item.location}
                </Text>
                <Image source={require('@assets/Images/map1.png')}
                    style={{ height: 8, width: 6 }}
                />
            </View>
            <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#023047' }}>{item.title}</Text>
            <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#023047' }}>{item.price}</Text>
        </Pressable>
    );
};

export default SaleOrArchiveItem;