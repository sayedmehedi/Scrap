import React from "react";
import {useAppSelector} from "@hooks/store";
import {Overlay} from "react-native-elements";
import {Controller, useForm} from "react-hook-form";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {View, TouchableOpacity} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import {useNavigation} from "@react-navigation/native";
import {ListItem, Switch} from "react-native-elements";
import {isJoteyQueryError} from "@utils/error-handling";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {useCreateProductMutation} from "@data/laravel/services/product";
import CircularProgress from "react-native-circular-progress-indicator";
import {Divider, HelperText, Text, Title, useTheme} from "react-native-paper";
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
import {FlatList, ScrollView} from "react-native-gesture-handler";
import {
  useGetPackagesQuery,
  useLazyGetPackagesQuery,
} from "@data/laravel/services/package";
import {useRefreshOnFocus} from "@hooks/useRefreshOnFocus";
import {ErrorMessage} from "@hookform/error-message";

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
  const rootNavigation = useNavigation<RootNavigationProps>();
  const profile = useAppSelector(state => state.auth.profile);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [showFieldErrors, setShowFieldErrors] = React.useState(false);
  const {enqueueSuccessSnackbar, enqueueErrorSnackbar} = useAppSnackbar();
  const [getPackages, {isFetching: isFetchingNextPage}] =
    useLazyGetPackagesQuery();
  const {
    refetch,
    data: getMetalsResponse,
    isLoading: isLoadingCategories,
    isFetching: isFetchingInitial,
  } = useGetPackagesQuery({});

  useRefreshOnFocus(refetch);
  const actionCreaterRef = React.useRef<ReturnType<typeof getPackages> | null>(
    null,
  );
  const [
    createProduct,
    {
      error: createProductError,
      data: createProductResponse,
      isError: isCreateProductError,
      isLoading: isCreatingProduct,
      isSuccess: isProductCreateSuccess,
    },
  ] = useCreateProductMutation();

  React.useEffect(() => {
    if (
      isCreateProductError &&
      isJoteyQueryError(createProductError) &&
      createProductError.status === 422
    ) {
      setShowFieldErrors(true);
    }
  }, [isCreateProductError, createProductError]);

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
    if (
      isProductCreateSuccess &&
      !!createProductResponse &&
      "success" in createProductResponse
    ) {
      enqueueSuccessSnackbar({
        text1: createProductResponse.success,
      });

      navigation.reset({
        index: 0,
        routes: [{name: PostItemStackRoutes.SUCCESS}],
      });

      // navigation.navigate(PostItemStackRoutes.SUCCESS);
    }

    if (
      isProductCreateSuccess &&
      !!createProductResponse &&
      "error" in createProductResponse
    ) {
      enqueueErrorSnackbar({
        text1: "Error",
        text2: createProductResponse.error,
      });
    }
  }, [
    isProductCreateSuccess,
    enqueueSuccessSnackbar,
    createProductResponse,
    enqueueErrorSnackbar,
  ]);

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

  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      location: "",
      package: null,
      isLocale: true,
      isShipping: false,
    },
  });

  const isShipping = watch("isShipping");

  React.useEffect(() => {
    if (profile) {
      setValue("location", profile.location);
    }
  }, [profile, setValue]);

  const handlePostItem = handleSubmit(values => {
    createProduct({
      location: values.location,
      latitude: profile?.latitude,
      longitude: profile?.longitude,
      duration: route.params.duration,
      quantity: route.params.quantity,
      title: route.params.productTitle,
      details: route.params.description,
      package_id: values.package?.id ?? 0,
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
        const progress = Math.round(event.loaded / event.total) * 100;
        setUploadProgress(progress);
      },
    });
  });

  return (
    <ScrollView style={{padding: 15}}>
      <Overlay
        isVisible={
          isCreatingProduct && !isProductCreateSuccess && !isCreateProductError
        }
        overlayStyle={{
          width: "80%",
          elevation: 0,
          height: "50%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "transparent",
        }}>
        <CircularProgress
          radius={50}
          maxValue={100}
          duration={2000}
          titleColor={"black"}
          value={uploadProgress}
          activeStrokeColor={"white"}
          progressValueColor={"white"}
        />
      </Overlay>

      <Overlay
        overlayStyle={{
          width: "80%",
          elevation: 0,
          minHeight: "50%",
        }}
        isVisible={showFieldErrors}
        onRequestClose={() => {
          setShowFieldErrors(false);
        }}>
        <Title style={{paddingBottom: 10}}>Invalid Data</Title>
        <Divider style={{height: 2}} />

        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}>
          {isJoteyQueryError(createProductError) &&
            Object.values(createProductError.data.field_errors).map(
              (error, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "grey",
                    }}>
                    <HelperText type={"error"}>{error}</HelperText>
                  </View>
                );
              },
            )}
        </ScrollView>
      </Overlay>
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
                    rootNavigation.navigate(RootStackRoutes.CHOOSE_LOCATION, {
                      nextScreen: {
                        name: HomeTabRoutes.POST_ITEM,
                        params: {
                          screen: route.name,
                          params: route.params,
                        },
                      },
                    });
                  }}>
                  <ListItem.Content>
                    <ListItem.Title>
                      <Text style={{fontWeight: "700"}}> Location:</Text>{" "}
                      {field.value}
                    </ListItem.Title>
                  </ListItem.Content>

                  <Entypo name={"edit"} size={15} />
                </ListItem>

                <Divider style={{height: 2}} />
              </React.Fragment>
            );
          }}
        />

        <View style={{height: 10}} />

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
                      fontWeight: "700",
                    }}>
                    Local Pickup
                  </Text>
                </View>

                <View>
                  <Switch onValueChange={field.onChange} value={field.value} />
                </View>
              </View>
            );
          }}
        />

        <View style={{height: 5}} />

        <Divider style={{height: 2}} />

        <View style={{height: 5}} />

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
                      marginBottom: 2,
                      fontWeight: "700",
                    }}>
                    Sale & Shipping
                  </Text>
                </View>

                <View>
                  <Switch onValueChange={field.onChange} value={field.value} />
                </View>
              </View>
            );
          }}
        />

        <View style={{height: 10}} />

        <Divider style={{height: 2}} />
      </React.Fragment>

      {isShipping && (
        <Controller
          control={control}
          name={"package"}
          shouldUnregister
          rules={{
            required: "This field is reuired",
          }}
          render={({field}) => {
            return (
              <React.Fragment>
                <View style={{height: 10}} />

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
                        marginBottom: 2,
                        fontWeight: "700",
                      }}>
                      What length package will you use?
                    </Text>

                    <Text style={{fontSize: 12}}>
                      Buyer can pay for delivery label
                    </Text>
                  </View>
                </View>

                <View style={{height: 10}} />

                <FlatList<typeof metals[0]>
                  data={metals}
                  showsVerticalScrollIndicator={false}
                  onEndReached={getNextPackages}
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
                          paddingBottom: 0,
                          alignItems: "flex-start",
                          backgroundColor: "#F7F7F7F",
                        }}>
                        <ListItem.CheckBox
                          iconType={"material"}
                          checkedIcon={"radio-button-checked"}
                          onPress={() => field.onChange(item)}
                          checked={field.value?.id === item.id}
                          uncheckedIcon={"radio-button-unchecked"}
                        />

                        <ListItem.Content>
                          <ListItem.Title
                            style={{
                              color:
                                field.value?.id === item.id
                                  ? theme.colors.primary
                                  : theme.colors.text,
                              fontWeight: "700",
                            }}>
                            {item.name}
                          </ListItem.Title>

                          <View>
                            <Text>Approx: {item.size}</Text>
                            <Text>Weight: {item.weight}</Text>
                            <Text>pounds. Buyer Pays ${item.price}</Text>
                          </View>
                        </ListItem.Content>
                      </ListItem>
                    );
                  }}
                />

                <ErrorMessage
                  errors={errors}
                  name={"package"}
                  render={({message}) => (
                    <HelperText type={"error"}>{message}</HelperText>
                  )}
                />
              </React.Fragment>
            );
          }}
        />
      )}
      <AppPrimaryButton
        text={"Submit"}
        onPress={handlePostItem}
        disabled={isCreatingProduct}
        containerStyle={{marginVertical: 35}}
      />
    </ScrollView>
  );
}
