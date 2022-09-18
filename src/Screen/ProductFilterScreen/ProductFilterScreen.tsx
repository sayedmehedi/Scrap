import React from "react";
// @ts-ignore
import RangeSlider from "rn-range-slider";
import {useTheme, Text} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";
import LocationSelectionModal from "./LocationSelectionModal";
import CategorySelectionModal from "./CategorySelectionModal";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {TouchableOpacity, View, FlatList} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {HomeStackRoutes, RootStackRoutes} from "@constants/routes";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useLazyGetConditionsQuery} from "@data/laravel/services/condition";
import {ListItem, Divider, CheckBox, Button} from "react-native-elements";
import {combinedDefaultTheme} from "../../Providers/PreferencesProvider/theme";
import {
  Condition,
  ConditionResponse,
  PaginationQueryParams,
  RootStackParamList,
} from "@src/types";

const renderLabel = (value: string) => (
  <Text style={{color: "black", marginTop: 5}}>${value}</Text>
);

const renderThumb = () => (
  <View
    style={{
      width: 20,
      height: 20,
      borderRadius: 1000,
      backgroundColor: combinedDefaultTheme.colors.primary,
    }}
  />
);

const renderRail = () => (
  <View
    style={{
      flex: 1,
      height: 5,
      borderRadius: 8,
      backgroundColor: "rgba(0,0,0,0.25)",
    }}
  />
);

const renderRailSelected = () => (
  <View
    style={{
      flex: 1,
      height: 5,
      backgroundColor: combinedDefaultTheme.colors.primary,
    }}
  />
);

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.PRODUCT_FILTER
>;

const ProductFilterScreen = ({route}: Props) => {
  const navigation = useNavigation();

  const theme = useTheme();
  const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
  const [openLocationModal, setOpenLocationModal] = React.useState(false);

  const [location, setLocation] = React.useState<string | null>(null);
  const [distance, setDistance] = React.useState<number | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [minPrice, setMinPrice] = React.useState<number | null>(null);
  const [condition, setCondition] = React.useState<Condition | null>(null);
  const [categoryTitle, setCategoryTitle] = React.useState<string | null>(null);
  const [categoryId, setCategoryId] = React.useState<string | number | null>(
    null,
  );

  const [fetchConditions, {isFetching, isLoading}] =
    useLazyGetConditionsQuery();
  const [conditionPages, setConditionPages] = React.useState<
    Array<ConditionResponse["items"]>
  >([]);
  const actionCreaterRef = React.useRef<ReturnType<
    typeof fetchConditions
  > | null>(null);

  React.useEffect(() => {
    if (route.params.location) {
      setLocation(route.params.location);
    }

    if (route.params.distance) {
      setDistance(route.params.distance);
    }

    if (route.params.maxPrice) {
      setMaxPrice(route.params.maxPrice);
    }

    if (route.params.minPrice) {
      setMinPrice(route.params.minPrice);
    }

    if (route.params.condition) {
      setCondition(route.params.condition);
    }

    if (route.params.categoryId) {
      setCategoryId(route.params.categoryId);
    }

    if (route.params.categoryTitle) {
      setCategoryTitle(route.params.categoryTitle);
    }
  }, [route]);

  const handleValueChange = (low: number, high: number) => {
    setMaxPrice(high);
    setMinPrice(low);
  };

  const getNextConditions = async () => {
    if (isFetching) {
      return;
    }

    const lastProductPage = conditionPages[conditionPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastProductPage.last_page + 1;

    actionCreaterRef.current = fetchConditions(params, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();

      setConditionPages(prevPages => {
        return prevPages.concat(productResponse.items);
      });
    } finally {
      // setIsFilterProductsLoading(false)
    }
  };

  React.useEffect(() => {
    const actionCreator: ReturnType<typeof fetchConditions> = fetchConditions(
      {},
      true,
    );

    (async () => {
      // setIsFilterProductsLoading(true)
      try {
        const conditionResponse = await actionCreator.unwrap();

        setConditionPages(() => {
          return [conditionResponse.items];
        });
      } finally {
        // setIsFilterProductsLoading(false)
      }
    })();

    return () => {
      actionCreator.abort();
    };
  }, [fetchConditions]);

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {
        actionCreaterRef.current.abort();
      }
    };
  }, []);

  const conditions = React.useMemo(() => {
    if (isLoading) {
      return [
        {
          id: 1,
          type: "skeleton" as const,
        },
        {
          id: 2,
          type: "skeleton" as const,
        },
        {
          id: 3,
          type: "skeleton" as const,
        },
      ];
    }

    return conditionPages.flatMap(conditionPage =>
      conditionPage.data.map(codition => ({
        type: "data" as const,
        ...codition,
      })),
    );
  }, [isLoading, conditionPages]);

  return (
    <SafeAreaProvider>
      <View style={{}}>
        <CategorySelectionModal
          open={openCategoryModal}
          initialValue={categoryId}
          onClose={() => setOpenCategoryModal(false)}
          onSelect={category => {
            setCategoryId(category.id);
            setCategoryTitle(category.title);
          }}
        />

        <LocationSelectionModal
          open={openLocationModal}
          initialValue={{
            distance: distance ?? 0,
            location: location ?? undefined,
          }}
          onClose={() => setOpenLocationModal(false)}
          onSelect={({location, distance}) => {
            setLocation(location);
            setDistance(distance);
          }}
        />

        {/* @ts-ignore */}
        <ListItem
          Component={TouchableOpacity}
          containerStyle={{backgroundColor: "#F7F7F7F"}}
          onPress={() => setOpenCategoryModal(true)}>
          <ListItem.Content>
            <ListItem.Title>Categories</ListItem.Title>
            <ListItem.Subtitle>{categoryTitle}</ListItem.Subtitle>
          </ListItem.Content>
          {/* @ts-ignore */}
          <ListItem.Chevron size={30} />
        </ListItem>

        <Divider style={{width: "100%", height: 2}} />

        {/* @ts-ignore */}
        <ListItem
          Component={TouchableOpacity}
          containerStyle={{backgroundColor: "#F7F7F7F"}}
          onPress={() => {
            setOpenLocationModal(true);
          }}>
          <ListItem.Content>
            <ListItem.Title>Location</ListItem.Title>
            <ListItem.Subtitle>
              {location}: {distance ?? 0} miles
            </ListItem.Subtitle>
          </ListItem.Content>
          {/* @ts-ignore */}
          <ListItem.Chevron size={30} />
        </ListItem>

        <Divider style={{width: "100%", height: 2}} />

        {/* @ts-ignore */}
        <ListItem containerStyle={{backgroundColor: "#F7F7F7F"}}>
          <ListItem.Content>
            <ListItem.Title>
              Price Range (${minPrice} - ${maxPrice})
            </ListItem.Title>

            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
              }}>
              <RangeSlider
                style={{
                  width: "100%",
                  flexDirection: "column-reverse",
                }}
                min={0}
                step={1}
                max={100}
                renderRail={renderRail}
                renderThumb={renderThumb}
                renderLabel={renderLabel}
                onValueChanged={handleValueChange}
                renderRailSelected={renderRailSelected}
              />
            </View>
          </ListItem.Content>
        </ListItem>

        <Divider style={{width: "100%", height: 2, marginTop: -10}} />

        <FlatList<typeof conditions[0]>
          data={conditions}
          ListHeaderComponent={() => (
            <View style={{padding: 15}}>
              <ListItem.Title>Condition</ListItem.Title>
            </View>
          )}
          onEndReached={getNextConditions}
          renderItem={({item: eachCondition}) => {
            if (eachCondition.type === "skeleton") {
              return (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item />
                </SkeletonPlaceholder>
              );
            }

            return (
              <CheckBox
                iconType={"material"}
                title={eachCondition.title}
                checkedIcon={"radio-button-checked"}
                uncheckedIcon={"radio-button-unchecked"}
                onPress={() => setCondition(eachCondition)}
                checked={eachCondition.id === condition?.id}
                containerStyle={{
                  padding: 0,
                  paddingLeft: 1,
                  borderWidth: 0,
                  backgroundColor: "transparent",
                }}
              />
            );
          }}
        />

        <AppPrimaryButton
          containerStyle={{marginTop: 10}}
          text={"Apply Filter"}
          onPress={() => {
            navigation.navigate(
              HomeStackRoutes.PRODUCT_LIST_BY_CRITERIA as any,
              {
                categoryTitle,
                categoryId,
                location,
                distance,
                maxPrice,
                minPrice,
                condition,
              },
            );
          }}
        />

        <Button
          title={"Clear"}
          type={"clear"}
          onPress={() => {
            setLocation(route.params.location ?? null);
            setDistance(route.params.distance ?? null);
            setMaxPrice(route.params.maxPrice ?? null);
            setMinPrice(route.params.minPrice ?? null);
            setCondition(route.params.condition ?? null);
            setCategoryId(route.params.categoryId ?? null);
            setCategoryTitle(route.params.categoryTitle ?? null);
          }}
          containerStyle={{
            width: 270,
            marginLeft: "auto",
            marginRight: "auto",
            marginVertical: 15,
            marginBottom: 30,
          }}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default ProductFilterScreen;
