import React from "react";
import {useAppSelector} from "@hooks/store";
import {LinearProgress, Overlay} from "react-native-elements";
import {Controller, useForm} from "react-hook-form";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {View, TouchableOpacity} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import {useNavigation} from "@react-navigation/native";
import {ListItem, Switch} from "react-native-elements";
import {Divider, Text, useTheme} from "react-native-paper";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {useCreateProductMutation} from "@data/laravel/services/product";
import {
  GetPackagesResponse,
  Package,
  PaginationQueryParams,
  PostItemStackParamList,
  RootStackParamList,
} from "@src/types";
import {
  HomeTabRoutes,
  PostItemStackRoutes,
  RootStackRoutes,
} from "../constants/routes";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {FlatList} from "react-native-gesture-handler";
import {
  useGetPackagesQuery,
  useLazyGetPackagesQuery,
} from "@data/laravel/services/package";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";

type Props = NativeStackScreenProps<
  PostItemStackParamList,
  typeof PostItemStackRoutes.ADD_DELIVERY_METHOD
>;

type RootNavigationProps = NativeStackNavigationProp<RootStackParamList>;

type FormValues = {
  location: string;
  isLocale: boolean;
  isShipping: boolean;
  package: null | Package;
};

export default function ProductAddDeliveryMethodScreen({
  route,
  navigation,
}: Props) {
  const theme = useTheme();
  const {enqueueSuccessSnackbar} = useAppSnackbar();
  const rootNavigation = useNavigation<RootNavigationProps>();
  const profile = useAppSelector(state => state.auth.profile);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [getPackages, {isFetching: isFetchingNextPage}] =
    useLazyGetPackagesQuery();
  const {
    data: getMetalsResponse,
    isLoading: isLoadingCategories,
    isFetching: isFetchingInitial,
  } = useGetPackagesQuery({});
  const actionCreaterRef = React.useRef<ReturnType<typeof getPackages> | null>(
    null,
  );
  const [
    createProduct,
    {
      data: createProductResponse,
      isError: isCreateProductError,
      isLoading: isCreatingProduct,
      isSuccess: isProductCreateSuccess,
    },
  ] = useCreateProductMutation();

  React.useEffect(() => {
    if (
      (!isCreatingProduct && isProductCreateSuccess) ||
      isCreateProductError
    ) {
      setUploadProgress(0);
    }
  }, [isProductCreateSuccess, isCreatingProduct, isCreateProductError]);

  const [packagePages, setPackagePages] = React.useState<
    Array<GetPackagesResponse["items"]>
  >([]);

  React.useEffect(() => {
    if (!isLoadingCategories && !!getMetalsResponse) {
      setPackagePages(() => {
        return [getMetalsResponse.items];
      });
    }
  }, [getMetalsResponse, isLoadingCategories]);

  const getNextPackages = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastPage = packagePages[packagePages.length - 1];

    if (!lastPage || (lastPage && !lastPage.has_more_data)) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastPage.current_page + 1;

    actionCreaterRef.current = getPackages(params, true);

    try {
      const productResponse = await actionCreaterRef.current.unwrap();

      setPackagePages(prevPages => {
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

  React.useEffect(() => {
    if (isProductCreateSuccess && !!createProductResponse) {
      enqueueSuccessSnackbar({
        text1: createProductResponse.success,
      });
      navigation.navigate(PostItemStackRoutes.SUCCESS);
    }
  }, [isProductCreateSuccess, enqueueSuccessSnackbar, createProductResponse]);

  const metals = React.useMemo(() => {
    if (isLoadingCategories) {
      return new Array(10).fill(1).map((_, id) => ({
        id,
        type: "skeleton" as const,
      }));
    }

    return packagePages.flatMap(packagePage =>
      packagePage.data.map(pkg => ({
        type: "data" as const,
        ...pkg,
      })),
    );
  }, [isLoadingCategories, packagePages]);

  const {control, setValue, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      location: "",
      package: null,
      isLocale: false,
      isShipping: false,
    },
  });

  React.useEffect(() => {
    if (profile) {
      setValue("location", `${profile.city.name}, ${profile.country.name}`);
    }
  }, [profile, setValue]);

  const handlePostItem = handleSubmit(values => {
    createProduct({
      location: values.location,
      latitude: profile?.latitude,
      longitude: profile?.longitude,
      package_id: values.package!.id,
      duration: route.params.duration,
      quantity: route.params.quantity,
      title: route.params.productTitle,
      details: route.params.description,
      buy_price: route.params.buynowprice,
      attributes: route.params.attributes,
      selected_metals: route.params.metals,
      category_id: route.params.categoryId,
      is_locale: values.isLocale ? "1" : "0",
      condition_id: route.params.conditionId,
      starting_price: route.params.startingPrice,
      is_shipping: values.isShipping ? "1" : "0",
      sub_category_id: route.params.subCategoryId,
      is_list_now: route.params.isListNow ? "1" : "0",
      show_metal_price: route.params.showMetalPrice ? "1" : "0",
      expected_date_for_list: route.params.expectedDateForList,
      images: [
        route.params.productCoverImage,
        ...route.params.productGalleryImages,
      ],
      onUploadProgress(event) {
        const progress = Math.round(event.loaded / event.total);
        setUploadProgress(progress);
      },
    });
  });

  return (
    <View style={{padding: 15}}>
      <Overlay
        isVisible={isCreatingProduct}
        overlayStyle={{
          width: "80%",
          height: "50%",
        }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: SCREEN_PADDING_HORIZONTAL,
          }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Text style={{marginTop: 10, fontSize: 16, fontWeight: "600"}}>
            Creating Product...
          </Text>
        </View>
      </Overlay>

      <Controller
        control={control}
        name={"package"}
        render={({field}) => {
          return (
            <React.Fragment>
              <FlatList<typeof metals[0]>
                data={metals}
                onEndReached={getNextPackages}
                ListHeaderComponent={() => (
                  <React.Fragment>
                    <Controller
                      name={"location"}
                      control={control}
                      render={({field}) => {
                        return (
                          <React.Fragment>
                            <ListItem
                              hasTVPreferredFocus
                              tvParallaxProperties={{}}
                              Component={TouchableOpacity}
                              containerStyle={{
                                paddingHorizontal: 0,
                                backgroundColor: "transparent",
                              }}
                              onPress={() => {
                                rootNavigation.navigate(
                                  RootStackRoutes.CHOOSE_COUNTRY,
                                  {
                                    nextScreen: {
                                      name: HomeTabRoutes.POST_ITEM,
                                      params: {
                                        screen: route.name,
                                        params: route.params,
                                      },
                                    },
                                  },
                                );
                              }}>
                              <ListItem.Content>
                                <ListItem.Title>
                                  Location: {field.value}
                                </ListItem.Title>
                              </ListItem.Content>

                              <Entypo name={"edit"} size={15} />
                            </ListItem>

                            <Divider style={{height: 2}} />
                          </React.Fragment>
                        );
                      }}
                    />

                    <View style={{height: 15}} />

                    <Controller
                      name={"isShipping"}
                      control={control}
                      render={({field}) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}>
                            <View>
                              <Text
                                style={{
                                  fontSize: 17,
                                  color: "#222222",
                                  marginBottom: 10,
                                }}>
                                Sell & Ship International
                              </Text>

                              <Text>15% Services fee applies</Text>
                            </View>

                            <View>
                              <Switch
                                onValueChange={field.onChange}
                                value={field.value}
                              />
                            </View>
                          </View>
                        );
                      }}
                    />

                    <View style={{height: 15}} />

                    <Divider style={{height: 2}} />

                    <View style={{height: 15}} />
                    <Controller
                      name={"isLocale"}
                      control={control}
                      render={({field}) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}>
                            <View>
                              <Text
                                style={{
                                  fontSize: 17,
                                  marginBottom: 10,
                                  color: "#222222",
                                }}>
                                Local Pickup
                              </Text>
                            </View>

                            <View>
                              <Switch
                                onValueChange={field.onChange}
                                value={field.value}
                              />
                            </View>
                          </View>
                        );
                      }}
                    />

                    <View style={{height: 15}} />
                  </React.Fragment>
                )}
                ListFooterComponent={() => (
                  <AppPrimaryButton
                    text={"Submit"}
                    onPress={handlePostItem}
                    disabled={isCreatingProduct}
                    containerStyle={{marginVertical: 35}}
                  />
                )}
                renderItem={({item}) => {
                  if (item.type === "skeleton") {
                    return (
                      <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item paddingBottom={15}>
                          <SkeletonPlaceholder.Item
                            height={100}
                            borderRadius={5}
                          />
                        </SkeletonPlaceholder.Item>
                      </SkeletonPlaceholder>
                    );
                  }

                  return (
                    <ListItem
                      hasTVPreferredFocus
                      tvParallaxProperties={{}}
                      Component={TouchableOpacity}
                      onPress={() => field.onChange(item)}
                      containerStyle={{
                        paddingLeft: 0,
                        alignItems: "flex-start",
                        backgroundColor: "#F7F7F7F",
                      }}>
                      <ListItem.CheckBox
                        iconType={"material"}
                        checkedIcon={"radio-button-checked"}
                        checked={field.value?.id === item.id}
                        onPress={() => field.onChange(item)}
                        uncheckedIcon={"radio-button-unchecked"}
                      />

                      <ListItem.Content>
                        <ListItem.Title
                          style={{
                            color:
                              field.value?.id === item.id
                                ? theme.colors.primary
                                : theme.colors.text,
                          }}>
                          {item.name}
                        </ListItem.Title>

                        <View
                          style={{
                            marginTop: 10,
                          }}>
                          <Text>Approx: {item.size}</Text>
                          <Text>Weight: {item.weight}</Text>
                          <Text>pounds. Buyer Pays ${item.price}</Text>
                        </View>
                      </ListItem.Content>
                    </ListItem>
                  );
                }}
              />
            </React.Fragment>
          );
        }}
      />
    </View>
  );
}
