import dayjs from "dayjs";
import React, {useState} from "react";
import {Switch} from "react-native-paper";
import {CheckBox} from "react-native-elements";
import {
  Metal,
  GetMetalsResponse,
  PaginationQueryParams,
  PostItemStackParamList,
} from "@src/types";
import DatePicker from "react-native-date-picker";
import {Text, useTheme} from "react-native-paper";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {PostItemStackRoutes} from "../constants/routes";
import SelectionModal from "../Component/SelectionModal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {currencyTransform, numberTransform} from "@utils/form";
import {ScrollView, FlatList} from "react-native-gesture-handler";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {TextInput, View, Pressable, TouchableOpacity} from "react-native";
import {
  useGetMetalsQuery,
  useLazyGetMetalsQuery,
} from "@data/laravel/services/metal";

type Props = NativeStackScreenProps<
  PostItemStackParamList,
  typeof PostItemStackRoutes.ADD_PRICE
>;

type FormValues = {
  buynowprice: "";
  beginDay: Date;
  quantity: number;
  isListNow: boolean;
  startingPrice: "";
  showMetalPrice: boolean;
  metals: {id: string; value: Metal}[];
  duration: {id: number; text: string} | null;
  beginHour: {id: number; text: string} | null;
  beginMinute: {id: number; text: string} | null;
};

export default function ProductAddPriceScreen({navigation, route}: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = React.useState("");

  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      metals: [],
      quantity: 0,
      duration: null,
      buynowprice: "",
      startingPrice: "",
      isListNow: false,

      beginHour: null,
      beginMinute: null,
      beginDay: new Date(),
      showMetalPrice: true,
    },
  });

  const {
    fields: selectedMetals,
    append: appendMetal,
    remove: removeMetal,
  } = useFieldArray({
    control,
    name: "metals",
  });

  const handlePostItem = handleSubmit(values => {
    let expectedDateForList = "";

    if (values.beginDay) {
      let d = dayjs(values.beginDay);

      if (values.beginHour?.text) {
        d = d.set("hours", parseInt(values.beginHour.text));
      }

      if (values.beginMinute?.text) {
        d = d.set("minutes", parseInt(values.beginMinute.text));
      }

      expectedDateForList = d.toString();
    }

    navigation.navigate(PostItemStackRoutes.ADD_DELIVERY_METHOD, {
      ...route.params,
      expectedDateForList,
      quantity: values.quantity,
      isListNow: values.isListNow,
      startingPrice: !!values.startingPrice
        ? parseInt(values.startingPrice)
        : 0,
      showMetalPrice: values.showMetalPrice,
      metals: values.metals.map(({value}) => value.id),
      buynowprice: !!values.buynowprice ? parseInt(values.buynowprice) : 0,
      duration: !!values.duration?.text ? parseInt(values.duration.text) : 0,
    });
  });

  return (
    <View style={{padding: 15}}>
      <MetalList
        selectedMetals={selectedMetals}
        ListHeaderComponent={() => (
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
                        <Text>{field.value?.text}</Text>
                      </View>
                    </Pressable>

                    <SelectionModal
                      onSave={field.onChange}
                      title={"Select Duration"}
                      initialValue={field.value}
                      open={modalType === "duration"}
                      items={[
                        {
                          id: 1,
                          text: "2",
                          type: "data",
                        },
                        {
                          id: 2,
                          text: "3",
                          type: "data",
                        },
                        {
                          id: 3,
                          text: "4",
                          type: "data",
                        },
                        {
                          id: 4,
                          text: "5",
                          type: "data",
                        },
                      ]}
                      onClose={() => setModalType("")}
                    />
                  </React.Fragment>
                );
              }}
            />

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
                          <Text
                            style={{fontWeight: "700", textAlign: "center"}}>
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
                              ? dayjs(field.value).format("YYYY-MM-DD")
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
                          <Text
                            style={{fontWeight: "700", textAlign: "center"}}>
                            Hours
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}>
                          <Text style={{fontWeight: "600"}}>
                            {field.value?.text}
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
                          text: (id + 1).toString(),
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
                          <Text
                            style={{fontWeight: "700", textAlign: "center"}}>
                            Minutes
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}>
                          <Text style={{fontWeight: "600"}}>
                            {field.value?.text}
                          </Text>

                          <EvilIcons name="chevron-down" size={25} />
                        </View>
                      </TouchableOpacity>

                      <SelectionModal
                        title={"Select Minutes"}
                        open={modalType === "minutes"}
                        onSave={item => field.onChange(item)}
                        items={new Array(60).fill(0).map((_, id) => ({
                          id,
                          type: "data",
                          text: (id + 1).toString(),
                        }))}
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
                      onValueChange={field.onChange}
                    />
                  </View>
                );
              }}
            />
          </React.Fragment>
        )}
        ListFooterComponent={() => (
          <AppPrimaryButton
            text={"Next"}
            onPress={handlePostItem}
            containerStyle={{marginVertical: 35}}
          />
        )}
        onSelect={metal => {
          appendMetal(metal);
        }}
        onRemove={index => {
          removeMetal(index);
        }}
      />
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
  const [getMetals, {isFetching}] = useLazyGetMetalsQuery();
  const {data: getMetalsResponse, isLoading: isLoadingCategories} =
    useGetMetalsQuery({});
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
    if (isFetching) {
      return;
    }

    const lastProductPage = metalsPages[metalsPages.length - 1];

    if (lastProductPage && !lastProductPage.has_more_data) {
      return;
    }

    const params: PaginationQueryParams = {};

    if (lastProductPage) {
      params.page = lastProductPage.current_page + 1;
    }

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
