import React from "react";
import {RootStackRoutes} from "@constants/routes";
import CurrentLocationBtn from "./CurrentLocationBtn";
import useDebouncedState from "@hooks/useDebouncedState";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useGetCountriesQuery} from "@data/laravel/services/country";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {FlatList, TextInput, TouchableOpacity, View} from "react-native";
import {Country, GetCountriesResponse, RootStackParamList} from "@src/types";
import {Text, Title, useTheme, ActivityIndicator} from "react-native-paper";

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.CHOOSE_COUNTRY
>;

const ChooseCountryScreen = ({navigation, route}: Props) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebouncedState(searchTerm);
  const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(
    null,
  );
  const [countryPages, setCountryPages] = React.useState<
    Array<GetCountriesResponse["countries"]>
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
    data: countriesResponse,
    isLoading,
    isFetching,
  } = useGetCountriesQuery({
    search_text: debouncedSearchTerm,
  });

  React.useEffect(() => {
    if (!isLoading && !!countriesResponse) {
      setCountryPages([countriesResponse.countries]);
    }
  }, [countriesResponse, isLoading]);

  const countries = React.useMemo(() => {
    if (isLoading) {
      return new Array(20).fill(1).map((_, id) => ({
        id,
        type: "skeleton" as const,
      }));
    }

    return countryPages.flatMap(countryPage =>
      countryPage.data.map(country => ({
        type: "data" as const,
        ...country,
      })),
    );
  }, [isLoading, countryPages]);

  React.useEffect(() => {
    if (isUpdateProfileSuccess && !!updateProfileReponse) {
      navigation.navigate(RootStackRoutes.CHOOSE_STATE, {
        nextScreen: route.params.nextScreen,
      });
    }
  }, [isUpdateProfileSuccess, updateProfileReponse, navigation, route]);

  React.useEffect(() => {
    if (!!selectedCountry) {
      updateProfile({
        country_id: selectedCountry.id.toString(),
      });
    }
  }, [updateProfile, selectedCountry]);

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
              Updating Country
            </Text>
          </View>
        )}

        <FlatList<typeof countries[0]>
          data={countries}
          refreshing={isFetching}
          ListHeaderComponent={() => <Title>Choose Country</Title>}
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

            const isSelected = selectedCountry?.id === item.id;

            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCountry(prevSelectedCountry =>
                    prevSelectedCountry?.id === item.id ? null : item,
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

export default ChooseCountryScreen;
