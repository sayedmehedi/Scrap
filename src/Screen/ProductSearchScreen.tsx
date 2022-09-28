import React from "react";
import {HomeStackParamList} from "@src/types";
import {HomeStackRoutes} from "@constants/routes";
import useDebouncedState from "@hooks/useDebouncedState";
import {useNavigation} from "@react-navigation/native";
import {TextInput, View, SectionList} from "react-native";
import {useTheme, Text, Card, Divider} from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {useGetFullTextSearchQuery} from "@data/laravel/services/api";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {TouchableOpacity} from "react-native-gesture-handler";

type HomeStackNavigatorProps = NativeStackNavigationProp<HomeStackParamList>;

const Item = ({
  data,
}: {
  data:
    | {id: number; type: "term"; title: string; attributeId: number}
    | {
        id: number;
        title: string;
        type: "categories" | "sub_categories" | "conditions";
      };
}) => {
  const homestackNavigation = useNavigation<HomeStackNavigatorProps>();

  return (
    <TouchableOpacity
      onPress={() => {
        switch (data.type) {
          case "term":
            homestackNavigation.navigate(
              HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA,
              {
                attributes: {
                  [data.attributeId]: data.id,
                },
                screenTitle: data.title,
              },
            );
            break;

          case "conditions":
            homestackNavigation.navigate(
              HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA,
              {
                screenTitle: data.title,
                condition: {
                  id: data.id,
                  title: data.title,
                },
              },
            );
            break;

          case "categories":
            homestackNavigation.navigate(
              HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA,
              {
                categoryId: data.id,
                screenTitle: data.title,
              },
            );
            break;

          case "sub_categories":
            homestackNavigation.navigate(
              HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA,
              {
                subcategoryId: data.id,
                screenTitle: data.title,
              },
            );
            break;

          default:
            break;
        }
      }}>
      <Card>
        <Card.Content style={{padding: 10}}>
          <Text>{data.title}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const ProductSearchScreen = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");

  const [debouncedSearchTerm] = useDebouncedState(searchTerm);

  const {data, isLoading} = useGetFullTextSearchQuery(
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
            },
          ],
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
            },
          ],
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
            },
          ],
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
              type: "skeleton" as const,
              title: "skeleton" as const,
            },
          ],
        },
      ];
    }

    return Object.entries(data ?? {}).map(([title, data]) => ({
      title: title.split("_").join(" "),
      data: data.flatMap<
        | {id: number; type: "term"; title: string; attributeId: number}
        | {
            id: number;
            title: string;
            type: "categories" | "sub_categories" | "conditions";
          }
      >(datum => {
        if ("terms" in datum) {
          return datum.terms.map(term => {
            return {
              ...term,
              attributeId: datum.id,
              type: "term" as "term",
            };
          });
        }

        return {
          type: title as "categories" | "sub_categories" | "conditions",
          ...datum,
        };
      }),
    }));
  }, [data, isLoading]);

  return (
    <>
      <View style={{flex: 1}}>
        <View
          style={{
            padding: 15,
            paddingTop: 0,
            backgroundColor: theme.colors.primary,
          }}>
          <View
            style={{
              position: "relative",
              backgroundColor: theme.colors.primary,
            }}>
            <View style={{position: "absolute", zIndex: 1, left: 15, top: 10}}>
              <MaterialIcons name={"search"} size={30} />
            </View>

            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder={"Enter product name"}
              style={{
                paddingHorizontal: 50,
                borderRadius: theme.roundness * 3,
                backgroundColor: theme.colors.white,
              }}
            />
          </View>
        </View>

        <SectionList<typeof searchResult[0]["data"][0]>
          sections={searchResult}
          contentContainerStyle={{
            margin: 15,
            paddingBottom: 60,
          }}
          ListEmptyComponent={() => (
            <View>
              <Text>No data</Text>
            </View>
          )}
          ItemSeparatorComponent={Divider}
          SectionSeparatorComponent={Divider}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({item, section}) => {
            if (item.type === "skeleton") {
              return (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item padding={10}>
                    <SkeletonPlaceholder.Item width={"100%"} height={15} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              );
            }

            return <Item data={item} />;
          }}
        />
      </View>
    </>
  );
};

export default ProductSearchScreen;
