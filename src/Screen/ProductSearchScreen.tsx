import React from 'react';
import useDebouncedState from '@hooks/useDebouncedState';
import { useTheme, Text, Card, Divider } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useGetFullTextSearchQuery } from '@data/laravel/services/api';
import { TextInput, View, SectionList, Dimensions, } from 'react-native';

const { width } = Dimensions.get("window")

const searchedTextWidth = width * 0.30

const Item = ({ title, loading = false }: { title: string, loading?: boolean }) => {
  if (loading) {
    return (
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item padding={10}>
          <SkeletonPlaceholder.Item width={searchedTextWidth} height={15} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    )
  }

  return (
    <Card>
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
              title: "skeleton"
            },
            {
              id: 2,
              title: "skeleton"
            },
            {
              id: 3,
              title: "skeleton"
            }
          ]
        },
        {
          title: "skeleton" as const,
          data: [
            {
              id: 1,
              title: "skeleton"
            },
            {
              id: 2,
              title: "skeleton"
            },
            {
              id: 3,
              title: "skeleton"
            }
          ]
        },
        {
          title: "skeleton" as const,
          data: [
            {
              id: 1,
              title: "skeleton"
            },
            {
              id: 2,
              title: "skeleton"
            },
            {
              id: 3,
              title: "skeleton"
            }
          ]
        },
        {
          title: "skeleton" as const,
          data: [
            {
              id: 1,
              title: "skeleton"
            },
            {
              id: 2,
              title: "skeleton"
            },
            {
              id: 3,
              title: "skeleton"
            }
          ]
        }
      ];
    }

    return Object.entries(data ?? {}).map(([title, data]) => ({
      title,
      data,
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

        <SectionList
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
          renderItem={({ item, section }) => <Item title={item.title} loading={section.title === "skeleton"} />}
          renderSectionHeader={({ section: { title } }) => (
            <View>
              <Text
                style={{
                  fontWeight: '700',
                }}>
                {title.toLocaleUpperCase()}
              </Text>
            </View>
          )}
        />
      </View>
    </>
  );
};

export default ProductSearchScreen;
