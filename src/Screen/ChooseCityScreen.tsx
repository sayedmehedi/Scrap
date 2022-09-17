import React from "react";
import CurrentLocationBtn from "./CurrentLocationBtn";
import useDebouncedState from "@hooks/useDebouncedState";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import {useGetCitiesQuery} from "@data/laravel/services/country";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {City, GetCitiesResponse, RootStackParamList} from "@src/types";
import {FlatList, TextInput, TouchableOpacity, View} from "react-native";
import {ActivityIndicator, Text, Title, useTheme} from "react-native-paper";
import {
  HomeStackRoutes,
  HomeTabRoutes,
  RootStackRoutes,
} from "@constants/routes";
import {PostItemStackRoutes} from "../constants/routes";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.CHOOSE_CITY
>;

const ChooseCityScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebouncedState(searchTerm);
  const [selectedResource, setSelectedResource] = React.useState<City | null>(
    null,
  );
  const [resourcePages, setResourcePages] = React.useState<
    Array<GetCitiesResponse["cities"]>
  >([]);
  const [
    updateProfile,
    {
      isLoading: isUpdatingProfile,
      isSuccess: isUpdateProfileSuccess,
      data: updateProfileReponse,
    },
  ] = useUpdateProfileMutation();

  const {
    data: statesResponse,
    isLoading,
    isFetching,
  } = useGetCitiesQuery({
    search_text: debouncedSearchTerm,
  });

  React.useEffect(() => {
    if (!isLoading && !!statesResponse) {
      setResourcePages([statesResponse.cities]);
    }
  }, [statesResponse, isLoading]);

  const resources = React.useMemo(() => {
    if (isLoading) {
      return new Array(20).fill(1).map((_, id) => ({
        id,
        type: "skeleton" as const,
      }));
    }

    return resourcePages.flatMap(resourcePage =>
      resourcePage.data.map(resource => ({
        type: "data" as const,
        ...resource,
      })),
    );
  }, [isLoading, resourcePages]);

  React.useEffect(() => {
    if (isUpdateProfileSuccess && !!updateProfileReponse) {
      if (route.params.nextScreen) {
        // @ts-ignore
        navigation.navigate(
          // @ts-ignore
          route.params.nextScreen.name,
          route.params.nextScreen.params,
        );
      } else {
        navigation.replace(RootStackRoutes.HOME, {
          screen: HomeTabRoutes.HOME,
          params: {
            screen: HomeStackRoutes.HOME,
          },
        });
      }
    }
  }, [isUpdateProfileSuccess, updateProfileReponse, navigation, route]);

  React.useEffect(() => {
    if (!!selectedResource) {
      updateProfile({
        city_id: selectedResource.id.toString(),
      });
    }
  }, [updateProfile, selectedResource]);

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
              placeholder={"Enter your location"}
              style={{
                paddingHorizontal: 50,
                borderRadius: theme.roundness * 3,
                backgroundColor: theme.colors.white,
              }}
            />
          </View>
        </View>
        <View style={{alignSelf: "flex-start"}}>
          <CurrentLocationBtn />
        </View>

        {isUpdatingProfile && (
          <View style={{marginVertical: 10}}>
            <ActivityIndicator size={"small"} />
            <Text style={{textAlign: "center", marginTop: 10}}>
              Updating City
            </Text>
          </View>
        )}

        <FlatList<typeof resources[0]>
          data={resources}
          refreshing={isFetching}
          ListHeaderComponent={() => <Title>Choose City</Title>}
          contentContainerStyle={{padding: SCREEN_PADDING_HORIZONTAL}}
          renderItem={({item}) => {
            if (item.type === "skeleton") {
              return (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item padding={5}>
                    <SkeletonPlaceholder.Item height={40} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              );
            }

            const isSelected = selectedResource?.id === item.id;

            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedResource(prevResource =>
                    prevResource?.id === item.id ? null : item,
                  );
                }}>
                <View
                  style={{
                    paddingVertical: 15,
                    alignItems: "center",
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    borderColor: "#667085",
                    justifyContent: "space-between",
                  }}>
                  <Text
                    style={{
                      color: isSelected
                        ? theme.colors.primary
                        : theme.colors.black,
                    }}>
                    {item.name}
                  </Text>

                  {isSelected && (
                    <MaterialIcons
                      name={"check"}
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={() => (
            <View style={{padding: 15}}>
              <Text style={{textAlign: "center"}}>No data</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};

export default ChooseCityScreen;
