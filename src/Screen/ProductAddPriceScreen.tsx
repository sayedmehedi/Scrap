import dayjs from "dayjs";
import React, {useState} from "react";
import {Switch} from "react-native-paper";
import {CheckBox} from "react-native-elements";
import {
  Metal,
  GetMetalsResponse,
  PaginationQueryParams,
  PostItemStackParamList,
  GetDurationsResponse,
} from "@src/types";
import DatePicker from "react-native-date-picker";
import {Text, useTheme} from "react-native-paper";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {ScrollView} from "react-native-gesture-handler";
import {PostItemStackRoutes} from "../constants/routes";
import SelectionModal from "../Component/SelectionModal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {currencyTransform, dayTransform, numberTransform} from "@utils/form";
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  useGetMetalsQuery,
  useLazyGetMetalsQuery,
} from "@data/laravel/services/metal";
import {
  useGetDurationsQuery,
  useLazyGetDurationsQuery,
} from "@data/laravel/services/duration";

type Props = NativeStackScreenProps<
  PostItemStackParamList,
  typeof PostItemStackRoutes.ADD_PRICE
>;

type FormValues = {
  beginDay: Date;
  quantity: number;
  isListNow: boolean;
  buynowprice: string;
  startingPrice: string;
  showMetalPrice: boolean;
  metals: {id: string; value: Metal}[];
  beginHour: {id: number; value: number; label: string} | null;
  beginMinute: {id: number; value: number; label: string} | null;
  duration: {id: number; value: number; label: string} | null;
};

export default function ProductAddPriceScreen({navigation, route}: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const {enqueueErrorSnackbar} = useAppSnackbar();
  const [modalType, setModalType] = React.useState("");

  const {control, handleSubmit, watch} = useForm<FormValues>({
    defaultValues: {
      metals: [],
      quantity: 0,
      duration: null,
      isListNow: true,
      buynowprice: "",
      startingPrice: "",

      beginHour: null,
      beginMinute: null,
      beginDay: new Date(),
      showMetalPrice: false,
    },
  });

  const buyNowPrice = watch("buynowprice");
  const startingPrice = watch("startingPrice");
  const showMetalPrice = watch("showMetalPrice");

  const {
    fields: selectedMetals,
    append: appendMetal,
    remove: removeMetal,
  } = useFieldArray({
    control,
    name: "metals",
  });

  const handlePostItem = handleSubmit(values => {
    if (!values.startingPrice && !values.buynowprice) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: "Please input either starting price or buy now price",
      });

      return;
    }

    if (!!values.startingPrice && !values.buynowprice && !values.duration) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: "Please input duration",
      });

      return;
    }

    let expectedDateForList = "";

    if (values.beginDay) {
      let d = dayjs(values.beginDay);

      if (values.beginHour?.value) {
        d = d.set("hours", values.beginHour.value);
      }

      if (values.beginMinute?.value) {
        d = d.set("minutes", values.beginMinute.value);
      }

      expectedDateForList = d.toString();
    }

    navigation.navigate(PostItemStackRoutes.ADD_DELIVERY_METHOD, {
      ...route.params,
      expectedDateForList,
      quantity: values.quantity,
      isListNow: values.isListNow,
      duration: values.duration?.value ?? 0,
      showMetalPrice: values.showMetalPrice,
      startingPrice: !!values.startingPrice
        ? parseInt(values.startingPrice)
        : 0,
      metals: values.metals.map(({value}) => value.id),
      buynowprice: !!values.buynowprice ? parseInt(values.buynowprice) : 0,
    });
  });

  const ListHeaderComponent = (
    <React.Fragment>
      {!buyNowPrice && (
        <React.Fragment>
          <Controller
            control={control}
            name={"startingPrice"}
            render={({field}) => {
              return (
                <React.Fragment>
                  <Text
                    style={{
                      marginBottom: 10,
                      color: "#222222",
                      fontSize: 16,
                    }}>
                    Starting Price
                  </Text>

                  <TextInput
                    keyboardType="numeric"
                    value={currencyTransform.inputFloat(field.value)}
                    onChangeText={price =>
                      field.onChange(currencyTransform.outputFloat(price))
                    }
                    style={{
                      padding: 15,
                      fontSize: 25,
                      maxHeight: 110,
                      borderWidth: 1,
                      borderColor: "#C9C9C9",
                      borderRadius: theme.roundness * 4,
                      backgroundColor: theme.colors.white,
                    }}
                  />
                </React.Fragment>
              );
            }}
          />

          <View style={{height: 15}} />
        </React.Fragment>
      )}

      {!startingPrice && (
        <React.Fragment>
          <Controller
            control={control}
            name={"buynowprice"}
            render={({field}) => {
              return (
                <React.Fragment>
                  <Text
                    style={{
                      marginBottom: 10,
                      color: "#222222",
                      fontSize: 16,
                    }}>
                    Buy now price
                  </Text>

                  <TextInput
                    keyboardType="numeric"
                    value={currencyTransform.inputFloat(field.value)}
                    onChangeText={price =>
                      field.onChange(currencyTransform.outputFloat(price))
                    }
                    style={{
                      padding: 15,
                      fontSize: 25,
                      maxHeight: 110,
                      borderWidth: 1,
                      borderColor: "#C9C9C9",
                      borderRadius: theme.roundness * 4,
                      backgroundColor: theme.colors.white,
                    }}
                  />
                </React.Fragment>
              );
            }}
          />
          <View style={{height: 15}} />
        </React.Fragment>
      )}

      <Controller
        name={"quantity"}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Text
                style={{
                  marginBottom: 10,
                  color: "#222222",
                  fontSize: 16,
                }}>
                Quantity
              </Text>

              <TextInput
                keyboardType="numeric"
                value={numberTransform.input(field.value)}
                onChangeText={qntt =>
                  field.onChange(numberTransform.output(qntt))
                }
                style={{
                  padding: 15,
                  fontSize: 25,
                  maxHeight: 110,
                  borderWidth: 1,
                  borderColor: "#C9C9C9",
                  borderRadius: theme.roundness * 4,
                  backgroundColor: theme.colors.white,
                }}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{height: 15}} />

      {!!startingPrice && (
        <Controller
          control={control}
          name={"duration"}
          render={({field}) => {
            return (
              <React.Fragment>
                <Pressable onPress={() => setModalType("duration")}>
                  <View
                    style={{
                      padding: 15,
                      borderRadius: 8,
                      backgroundColor: theme.colors.white,
                      elevation: 2,
                    }}>
                    <Text style={{color: "#222222", fontSize: 14}}>
                      Select Duration
                    </Text>
                    <Text>{field.value?.label}</Text>
                  </View>
                </Pressable>

                <DurationSelectionModal
                  onSave={field.onChange}
                  initialValue={field.value}
                  open={modalType === "duration"}
                  onClose={() => setModalType("")}
                />
              </React.Fragment>
            );
          }}
        />
      )}

      <View
        style={{
          marginTop: 20,
          marginLeft: -10,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Controller
          control={control}
          name={"isListNow"}
          render={({field}) => {
            return (
              <CheckBox
                center
                checked={field.value}
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                containerStyle={{
                  padding: 1,
                  paddingLeft: 0,
                }}
                onPress={() => field.onChange(true)}
              />
            );
          }}
        />

        <Text>When I submit then, I'll start my listings</Text>
      </View>

      <View
        style={{
          marginTop: 5,
          marginLeft: -10,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <Controller
          control={control}
          name={"isListNow"}
          render={({field}) => {
            return (
              <CheckBox
                center
                checked={!field.value}
                uncheckedIcon={"circle-o"}
                checkedIcon={"dot-circle-o"}
                containerStyle={{
                  padding: 1,
                  paddingLeft: 0,
                }}
                onPress={() => field.onChange(false)}
              />
            );
          }}
        />

        <Text>Expected to begin on</Text>
      </View>

      <View
        style={{
          marginTop: 12,
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-around",
        }}>
        <Controller
          control={control}
          name={"beginDay"}
          render={({field}) => {
            return (
              <React.Fragment>
                <TouchableOpacity
                  onPress={() => setOpen(true)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: "white",
                  }}>
                  <View
                    style={{
                      marginBottom: 10,
                    }}>
                    <Text style={{fontWeight: "700", textAlign: "left"}}>
                      Day
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={{fontWeight: "600"}}>
                      {field.value
                        ? dayjs(field.value).format("ddd,MMM DD")
                        : ""}
                    </Text>

                    <EvilIcons name="chevron-down" size={25} />
                  </View>
                </TouchableOpacity>

                <DatePicker
                  modal
                  open={open}
                  mode={"date"}
                  date={field.value}
                  onConfirm={date => {
                    field.onChange(date);
                    setOpen(false);
                  }}
                  onCancel={() => {
                    setOpen(false);
                  }}
                />
              </React.Fragment>
            );
          }}
        />

        <Controller
          control={control}
          name={"beginHour"}
          render={({field}) => {
            return (
              <React.Fragment>
                <TouchableOpacity
                  onPress={() => setModalType("hours")}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginHorizontal: 10,
                    backgroundColor: "white",
                  }}>
                  <View
                    style={{
                      marginBottom: 10,
                    }}>
                    <Text style={{fontWeight: "700", textAlign: "left"}}>
                      Hours
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={{fontWeight: "600"}}>
                      {field.value?.label}
                    </Text>

                    <EvilIcons name="chevron-down" size={25} />
                  </View>
                </TouchableOpacity>

                <SelectionModal
                  title={"Select Hour"}
                  open={modalType === "hours"}
                  onSave={item => field.onChange(item)}
                  items={new Array(24).fill(0).map((_, id) => ({
                    id,
                    type: "data",
                    value: id + 1,
                    label: `${id + 1}:00 hrs`,
                  }))}
                  onClose={() => setModalType("")}
                />
              </React.Fragment>
            );
          }}
        />

        <Controller
          control={control}
          name={"beginMinute"}
          render={({field}) => {
            return (
              <React.Fragment>
                <TouchableOpacity
                  onPress={() => setModalType("minutes")}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: "white",
                  }}>
                  <View
                    style={{
                      marginBottom: 10,
                    }}>
                    <Text style={{fontWeight: "700", textAlign: "left"}}>
                      Minutes
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={{fontWeight: "600"}}>
                      {field.value?.label}
                    </Text>

                    <EvilIcons name="chevron-down" size={25} />
                  </View>
                </TouchableOpacity>

                <SelectionModal
                  title={"Select Minutes"}
                  open={modalType === "minutes"}
                  onSave={item => field.onChange(item)}
                  items={new Array(6).fill(1).map((_, id) => {
                    const minute = (id + 1) * 10;
                    return {
                      id,
                      type: "data",
                      value: minute,
                      label: `00:${minute} min`,
                    };
                  })}
                  onClose={() => setModalType("")}
                />
              </React.Fragment>
            );
          }}
        />
      </View>

      <Controller
        control={control}
        name={"showMetalPrice"}
        render={({field}) => {
          console.log("showMetalPrice", field.value);
          return (
            <View
              style={{
                marginTop: 40,
                marginBottom: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Text>Do you want to show metals current/live price</Text>

              <Switch
                color={"green"}
                value={field.value}
                onValueChange={() => field.onChange(!field.value)}
              />
            </View>
          );
        }}
      />
    </React.Fragment>
  );

  const ListFooterComponent = (
    <AppPrimaryButton
      text={"Next"}
      onPress={handlePostItem}
      containerStyle={{marginVertical: 35}}
    />
  );

  return (
    <View style={{padding: 15}}>
      {showMetalPrice ? (
        <MetalList
          selectedMetals={selectedMetals}
          ListHeaderComponent={() => ListHeaderComponent}
          ListFooterComponent={() => ListFooterComponent}
          onSelect={metal => {
            appendMetal(metal);
          }}
          onRemove={index => {
            removeMetal(index);
          }}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {ListHeaderComponent}
          {ListFooterComponent}
        </ScrollView>
      )}
    </View>
  );
}

function MetalList({
  onSelect,
  onRemove,
  selectedMetals,
  ListFooterComponent,
  ListHeaderComponent,
}: {
  onRemove: (index: number) => void;
  selectedMetals: {id: string; value: Metal}[];
  ListHeaderComponent: React.ComponentType<any>;
  ListFooterComponent: React.ComponentType<any>;
  onSelect: (item: {id: string; value: Metal}) => void;
}) {
  const theme = useTheme();
  const [getMetals, {isFetching: isFetchingNextPage}] = useLazyGetMetalsQuery();
  const {
    data: getMetalsResponse,
    isLoading: isLoadingCategories,
    isFetching: isFetchingInitial,
  } = useGetMetalsQuery({});
  const actionCreaterRef = React.useRef<ReturnType<typeof getMetals> | null>(
    null,
  );

  const [metalsPages, setMetalPages] = React.useState<
    Array<GetMetalsResponse["items"]>
  >([]);

  React.useEffect(() => {
    if (!isLoadingCategories && !!getMetalsResponse) {
      setMetalPages(() => {
        return [getMetalsResponse.items];
      });
    }
  }, [getMetalsResponse, isLoadingCategories]);

  const getNextMetals = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = metalsPages[metalsPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastProductPage.current_page + 1;

    actionCreaterRef.current = getMetals(params, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();

      setMetalPages(prevPages => {
        return prevPages.concat(productResponse.items);
      });
    } finally {
    }
  };

  React.useEffect(() => {
    return () => {
      if (actionCreaterRef.current) {
        actionCreaterRef.current.abort();
      }
    };
  }, []);

  const metals = React.useMemo(() => {
    if (isLoadingCategories) {
      return new Array(10).fill(1).map((_, id) => ({
        id,
        type: "skeleton" as const,
      }));
    }

    return metalsPages.flatMap(categoryPage =>
      categoryPage.data.map(category => ({
        type: "data" as const,
        id: category.id,
        text: category.title,
      })),
    );
  }, [isLoadingCategories, metalsPages]);

  return (
    <FlatList<typeof metals[0]>
      data={metals}
      numColumns={3}
      onEndReached={getNextMetals}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      renderItem={({item}) => {
        if (item.type === "skeleton") {
          return (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item paddingRight={10} paddingBottom={15}>
                <SkeletonPlaceholder.Item
                  height={40}
                  width={100}
                  borderRadius={5}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          );
        }

        const index = selectedMetals.findIndex(
          selectedMetal => selectedMetal.value?.id === item.id,
        );

        const isSelected = index !== -1;

        return (
          <TouchableOpacity
            onPress={() => {
              if (isSelected) {
                onRemove(index);
              } else {
                onSelect({
                  id: item.id.toString(),
                  value: {
                    id: item.id,
                    title: item.text,
                  },
                });
              }
            }}
            style={{
              height: 40,
              minWidth: 100,
              borderRadius: 5,
              borderWidth: 1,
              marginRight: 10,
              marginBottom: 15,
              alignItems: "center",
              justifyContent: "center",
              borderColor: theme.colors.primary,
              backgroundColor: isSelected ? theme.colors.primary : "white",
            }}>
            <Text
              style={{
                fontFamily: "Inter-Regular",
                color: isSelected ? "white" : theme.colors.primary,
              }}>
              {item.text}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

function DurationSelectionModal({
  open,
  onSave,
  onClose,
  initialValue,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (item: {id: number; value: number; label: string} | null) => void;
  initialValue?: {id: number; value: number; label: string} | null;
}) {
  const [getDurations, {isFetching: isFetchingNextPage}] =
    useLazyGetDurationsQuery();
  const {
    data: categoryListResponse,
    isLoading: isLoadingDuration,
    isFetching: isFetchingInitial,
  } = useGetDurationsQuery({
    limit: 15,
  });
  const categoryActionCreaterRef = React.useRef<ReturnType<
    typeof getDurations
  > | null>(null);

  const [derationPages, setDurationPages] = React.useState<
    Array<GetDurationsResponse["items"]>
  >([]);

  React.useEffect(() => {
    if (!isLoadingDuration && !!categoryListResponse) {
      setDurationPages(() => {
        return [categoryListResponse.items];
      });
    }
  }, [categoryListResponse, isLoadingDuration]);

  const getNextDurations = async () => {
    console.log("getting next durations");

    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = derationPages[derationPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {
      limit: 15,
    };

    params.page = lastProductPage.current_page + 1;

    categoryActionCreaterRef.current = getDurations(params, true);

    try {
      const productResponse = await categoryActionCreaterRef.current.unwrap();

      setDurationPages(prevPages => {
        return prevPages.concat(productResponse.items);
      });
    } finally {
    }
  };

  React.useEffect(() => {
    return () => {
      if (categoryActionCreaterRef.current) {
        categoryActionCreaterRef.current.abort();
      }
    };
  }, []);

  const durations = React.useMemo(() => {
    if (isLoadingDuration) {
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

    return derationPages.flatMap(durationPage =>
      durationPage.data.map(duration => ({
        id: duration.id,
        type: "data" as const,
        label: duration.days,
        value: dayTransform.output(duration.days),
      })),
    );
  }, [isLoadingDuration, derationPages]);

  return (
    <SelectionModal
      open={open}
      onSave={onSave}
      onClose={onClose}
      items={durations}
      title={"Select Duration"}
      initialValue={initialValue}
      loading={isLoadingDuration}
      onEndReached={getNextDurations}
      isFetchingNext={isFetchingNextPage}
    />
  );
}
