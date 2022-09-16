import React from 'react';
import { HomeStackParamList } from '@src/types';
import useDebouncedState from '@hooks/useDebouncedState';
import { useNavigation } from '@react-navigation/native';
import { TextInput, View, SectionList, } from 'react-native';
import { useTheme, Text, Card, Divider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useGetFullTextSearchQuery } from '@data/laravel/services/api';
import { HomeStackRoutes, RootStackRoutes } from '@constants/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type SearchItemType = "categories" | "sub_categories" | "conditions" | "attributes"


type HomeStackNavigatorProps = NativeStackNavigationProp<HomeStackParamList>

const Item = ({ title, type, id }: { title: string, type: SearchItemType, id: number }) => {
  const homestackNavigation = useNavigation<HomeStackNavigatorProps>()

  return (
    <Card onPress={() => {
      switch (type) {
        case "attributes":
          homestackNavigation.navigate(HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA, {
            attributeId: id,
            categoryTitle: title,
          });
          break;

        case "conditions":
          homestackNavigation.navigate(HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA, {
            categoryTitle: title,
            condition: {
              id,
              title
            }
          });
          break;

        case "categories":
          homestackNavigation.navigate(HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA, {
            categoryTitle: title,
            categoryId: id,
          });
          break;

        case "sub_categories":
          homestackNavigation.navigate(HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA, {
            categoryTitle: title,
            categoryId: id,
          });
          break;

        default:
          break;
      }
    }}>
      <Card.Content style={{ padding: 10 }}>
        <Text>{title}</Text>
      </Card.Content>
    </Card>
  )
};

const ProductSearchScreen = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState('');

  const [debouncedSearchTerm] = useDebouncedState(searchTerm);

  const { data, isLoading } = useGetFullTextSearchQuery(
    {
      q: debouncedSearchTerm,
    },
    {
      skip: debouncedSearchTerm.length === 0,
    },
  );

  const searchResult = React.useMemo(() => {
    if (isLoading) {
      return [
        {
          title: "skeleton" as const,
          data: [
            {
              id: 1,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 2,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 3,
              title: "skeleton" as const,
              type: "skeleton" as const,
            }
          ]
        },
        {
          title: "skeleton" as const,
          data: [
            {
              id: 1,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 2,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 3,
              title: "skeleton" as const,
              type: "skeleton" as const,
            }
          ]
        },
        {
          title: "skeleton" as const,
          data: [
            {
              id: 1,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 2,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 3,
              title: "skeleton" as const,
              type: "skeleton" as const,
            }
          ]
        },
        {
          title: "skeleton" as const,
          data: [
            {
              id: 1,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 2,
              title: "skeleton" as const,
              type: "skeleton" as const,
            },
            {
              id: 3,
              title: "skeleton" as const,
              type: "skeleton" as const,
            }
          ]
        }
      ];
    }

    return Object.entries(data ?? {}).map(([title, data]) => ({
      title: title.split("_").join(" "),
      data: data.map(datum => ({
        type: title as SearchItemType,
        ...datum
      })),
    }));
  }, [data, isLoading]);

  return (
    <>
      <View style={{ flex: 1 }}>
        <View
          style={{
            padding: 15,
            paddingTop: 0,
            backgroundColor: theme.colors.primary,
          }}>
          <View
            style={{
              position: 'relative',
              backgroundColor: theme.colors.primary,
            }}>
            <View style={{ position: 'absolute', zIndex: 1, left: 15, top: 10 }}>
              <MaterialIcons name={'search'} size={30} />
            </View>

            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder={'Enter product name'}
              style={{
                paddingHorizontal: 50,
                borderRadius: theme.roundness * 3,
                // @ts-ignore
                backgroundColor: theme.colors.white,
              }}
            />
          </View>
        </View>

        <SectionList<typeof searchResult[0]["data"][0]>
          sections={searchResult}
          contentContainerStyle={{
            margin: 15,
          }}
          ListEmptyComponent={() => (
            <View>
              <Text>No data</Text>
            </View>
          )}
          ItemSeparatorComponent={Divider}
          keyExtractor={(item, index) => item.title + index}
          SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item, section }) => {
            if (item.type === "skeleton") {
              return (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item padding={10}>
                    <SkeletonPlaceholder.Item width={"100%"} height={15} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              )
            }

            return <Item type={item.type} id={item.id} title={item.title} />
          }}

        />
      </View>
    </>
  );
};

export default ProductSearchScreen;
