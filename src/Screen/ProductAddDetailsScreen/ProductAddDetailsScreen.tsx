import React from "react";
import {
  CategoryListResponse,
  ConditionResponse,
  PaginationQueryParams,
  PostItemStackParamList,
} from "@src/types";
import {Controller, useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {PostItemStackRoutes} from "@constants/routes";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import SelectionModal from "../../Component/SelectionModal";
import {HelperText, Text, useTheme} from "react-native-paper";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {TextInput, View, ScrollView, Pressable} from "react-native";
import {FloatingLabelInput} from "react-native-floating-label-input";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  useGetConditionsQuery,
  useLazyGetConditionsQuery,
} from "@data/laravel/services/condition";
import {
  useGetCategoryListQuery,
  useGetAttributesByCatIdQuery,
  useLazyGetCategoryListQuery,
  useGetSubcategoryByCatIdQuery,
} from "@data/laravel/services/category";

type Props = NativeStackScreenProps<
  PostItemStackParamList,
  typeof PostItemStackRoutes.ADD_DETAILS
>;

type FormValues = {
  category: {
    id: number;
    text: string;
  } | null;
  condition: {
    id: number;
    text: string;
  } | null;
  subCategory: {
    id: number;
    text: string;
  } | null;
  description: string;
  attributes: {
    [attrId: number]: {id: number; text: string} | {text: string};
  };
};

export default function ProductAddDetailsScreen({navigation, route}: Props) {
  const theme = useTheme();
  const [modalType, setModalType] = React.useState("");

  const {
    control,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    defaultValues: {
      category: null,
      condition: null,
      description: "",
      subCategory: null,
      attributes: {},
    },
  });

  const selectedCategory = watch("category");

  const {data: subcategoriesResponse, isLoading: isSubcategoriesLoading} =
    useGetSubcategoryByCatIdQuery(
      {
        categoryId: selectedCategory?.id ?? 0,
      },
      {
        skip: selectedCategory === null,
      },
    );

  const {data: attributesResponse, isLoading: isAttributesLoading} =
    useGetAttributesByCatIdQuery(
      {
        categoryId: selectedCategory?.id ?? 0,
      },
      {
        skip: selectedCategory === null,
      },
    );

  const attributes = React.useMemo(() => {
    if (isAttributesLoading) {
      return new Array(5).fill(1).map((_, id) => ({
        id,
        type: "skeleton" as const,
      }));
    }

    return (
      attributesResponse?.attributes.map(attr => ({
        type: "data" as const,
        ...attr,
      })) ?? []
    );
  }, [isAttributesLoading, attributesResponse]);

  const subcategories = React.useMemo(() => {
    if (isSubcategoriesLoading) {
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

    return (
      subcategoriesResponse?.sub_categories.map(category => ({
        type: "data" as const,
        id: category.id,
        text: category.title,
      })) ?? []
    );
  }, [isSubcategoriesLoading, subcategoriesResponse]);

  const handleNextScreen = handleSubmit(values => {
    navigation.navigate(PostItemStackRoutes.ADD_PRICE, {
      ...route.params,
      attributes: Object.entries(values.attributes).reduce(
        (acc, [attrId, value]) => {
          acc[parseInt(attrId)] = "id" in value ? value.id : value.text;
          return acc;
        },
        {} as Record<number, string | number>,
      ),
      description: values.description,
      categoryId: values.category!.id,
      conditionId: values.condition!.id,
      subCategoryId: values.subCategory!.id,
    });
  });

  return (
    <ScrollView style={{padding: 15}} showsVerticalScrollIndicator={false}>
      <Controller
        control={control}
        name={"category"}
        rules={{
          required: "This field is required",
        }}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType("category")}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: theme.colors.white,
                  }}>
                  <View>
                    <Text style={{color: "grey", marginBottom: 7}}>
                      Category*
                    </Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <ErrorMessage
                errors={errors}
                name={"category"}
                render={({message}) => (
                  <HelperText type={"error"}> {message}</HelperText>
                )}
              />

              <CategorySelectionModal
                onSave={field.onChange}
                initialValue={field.value}
                open={modalType === "category"}
                onClose={() => setModalType("")}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />

      <Controller
        control={control}
        rules={{
          required: "This field is required",
        }}
        name={"subCategory"}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType("subcategory")}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}>
                  <View>
                    <Text style={{color: "grey", marginBottom: 7}}>
                      Subcategory*
                    </Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <ErrorMessage
                errors={errors}
                name={"subCategory"}
                render={({message}) => (
                  <HelperText type={"error"}> {message}</HelperText>
                )}
              />

              <SelectionModal
                items={subcategories}
                onSave={field.onChange}
                initialValue={field.value}
                title={"Select Subcategory"}
                onClose={() => setModalType("")}
                open={modalType === "subcategory"}
              />
            </React.Fragment>
          );
        }}
      />

      <View style={{height: 15}} />

      <Controller
        control={control}
        rules={{
          required: "This field is required",
        }}
        name={"condition"}
        render={({field}) => {
          return (
            <React.Fragment>
              <Pressable onPress={() => setModalType("condition")}>
                <View
                  style={{
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: theme.colors.white,
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}>
                  <View>
                    <Text style={{color: "grey", marginBottom: 7}}>
                      Condition*
                    </Text>
                    <Text>{field.value?.text}</Text>
                  </View>

                  <EvilIcons name="chevron-down" size={25} />
                </View>
              </Pressable>

              <ErrorMessage
                errors={errors}
                name={"condition"}
                render={({message}) => (
                  <HelperText type={"error"}> {message}</HelperText>
                )}
              />

              <ConditionSelectionModal
                onSave={field.onChange}
                initialValue={field.value}
                onClose={() => setModalType("")}
                open={modalType === "condition"}
              />
            </React.Fragment>
          );
        }}
      />
      <View style={{height: 15}} />

      {attributes.map(item => {
        if (item.type === "skeleton") {
          return (
            <React.Fragment key={item.id}>
              <View style={{height: 15}} />

              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item height={30} />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder>
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={item.id}>
            <View style={{width: "100%", marginBottom: 16}}>
              <Controller
                control={control}
                rules={{
                  required: "This field is required",
                }}
                // @ts-ignore
                name={`attributes.${item.id}.text` as const}
                render={({field}) => {
                  if (item.terms.length === 0) {
                    return (
                      <FloatingLabelInput
                        label={item.title}
                        value={field.value as string}
                        onChangeText={field.onChange}
                      />
                    );
                  }

                  return (
                    <React.Fragment>
                      <Pressable
                        onPress={() => setModalType(`attr-id-${item.id}`)}>
                        <View
                          style={{
                            padding: 15,
                            borderRadius: 8,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: theme.colors.white,
                          }}>
                          <View>
                            <Text style={{color: "grey", marginBottom: 7}}>
                              {item.title}
                            </Text>
                            <Text>
                              {
                                (
                                  field.value as
                                    | {id: number; text: string}
                                    | undefined
                                )?.text
                              }
                            </Text>
                          </View>

                          <EvilIcons name="chevron-down" size={25} />
                        </View>
                      </Pressable>

                      <SelectionModal
                        onSave={field.onChange}
                        title={`Select ${item.title}`}
                        onClose={() => setModalType("")}
                        open={modalType === `attr-id-${item.id}`}
                        items={item.terms.map(term => ({
                          id: term.id,
                          type: "data",
                          text: term.title,
                        }))}
                        initialValue={
                          field.value as {id: number; text: string} | undefined
                        }
                      />
                    </React.Fragment>
                  );
                }}
              />

              <ErrorMessage
                errors={errors}
                name={`attributes.${item.id}.text` as const}
                render={({message}) => (
                  <HelperText type={"error"}> {message}</HelperText>
                )}
              />
            </View>
          </React.Fragment>
        );
      })}

      <View style={{height: 15}} />

      <Controller
        name={"description"}
        control={control}
        render={({field}) => {
          return (
            <React.Fragment>
              <Text style={{marginBottom: 10, color: "grey"}}>Description</Text>
              <TextInput
                multiline
                numberOfLines={5}
                textAlignVertical={"top"}
                placeholder="Product details write here"
                value={field.value}
                onChangeText={field.onChange}
                style={{
                  padding: 10,
                  maxHeight: 110,
                  borderRadius: theme.roundness * 3,
                  backgroundColor: theme.colors.white,
                }}
              />
            </React.Fragment>
          );
        }}
      />

      <AppPrimaryButton
        text={"Next"}
        onPress={handleNextScreen}
        containerStyle={{marginVertical: 35}}
      />
    </ScrollView>
  );
}

function ConditionSelectionModal({
  open,
  onSave,
  onClose,
  initialValue,
}: {
  open: boolean;
  onClose: () => void;
  initialValue?: {id: number; text: string} | null;
  onSave: (item: {id: number; text: string} | null) => void;
}) {
  const [getConditions, {isFetching: isFetchingNextPage}] =
    useLazyGetConditionsQuery();
  const {
    data: categoryListResponse,
    isLoading: isLoadingCategories,
    isFetching: isFetchingInitial,
  } = useGetConditionsQuery({});
  const conditionActionCreaterRef = React.useRef<ReturnType<
    typeof getConditions
  > | null>(null);

  const [conditionPages, setConditionPages] = React.useState<
    Array<ConditionResponse["items"]>
  >([]);

  React.useEffect(() => {
    if (!isLoadingCategories && !!categoryListResponse) {
      setConditionPages(() => {
        return [categoryListResponse.items];
      });
    }
  }, [categoryListResponse, isLoadingCategories]);

  const getNextConditions = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastConditionPage = conditionPages[conditionPages.length - 1];

    if (
      !lastConditionPage ||
      (lastConditionPage && !lastConditionPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastConditionPage.current_page + 1;

    conditionActionCreaterRef.current = getConditions(params, true);

    try {
      const productResponse = await conditionActionCreaterRef.current.unwrap();

      setConditionPages(prevPages => {
        return prevPages.concat(productResponse.items);
      });
    } finally {
    }
  };

  React.useEffect(() => {
    return () => {
      if (conditionActionCreaterRef.current) {
        conditionActionCreaterRef.current.abort();
      }
    };
  }, []);

  const conditions = React.useMemo(() => {
    if (isLoadingCategories) {
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
      conditionPage.data.map(condition => ({
        type: "data" as const,
        id: condition.id,
        text: condition.title,
      })),
    );
  }, [isLoadingCategories, conditionPages]);

  return (
    <SelectionModal
      open={open}
      onSave={onSave}
      items={conditions}
      onClose={onClose}
      title={"Select Condition"}
      initialValue={initialValue}
      onEndReached={getNextConditions}
    />
  );
}

function CategorySelectionModal({
  open,
  onSave,
  onClose,
  initialValue,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (item: {id: number; text: string} | null) => void;
  initialValue?: {id: number; text: string} | null;
}) {
  const [getCategories, {isFetching: isFetchingNextPage}] =
    useLazyGetCategoryListQuery();
  const {
    data: categoryListResponse,
    isLoading: isLoadingCategories,
    isFetching: isFetchingInitial,
  } = useGetCategoryListQuery({});
  const categoryActionCreaterRef = React.useRef<ReturnType<
    typeof getCategories
  > | null>(null);

  const [categoryPages, setCategoryPages] = React.useState<
    Array<CategoryListResponse["items"]>
  >([]);

  React.useEffect(() => {
    if (!isLoadingCategories && !!categoryListResponse) {
      setCategoryPages(() => {
        return [categoryListResponse.items];
      });
    }
  }, [categoryListResponse, isLoadingCategories]);

  const getNextCategories = async () => {
    if (isFetchingNextPage || isFetchingInitial) {
      return;
    }

    const lastProductPage = categoryPages[categoryPages.length - 1];

    if (
      !lastProductPage ||
      (lastProductPage && !lastProductPage.has_more_data)
    ) {
      return;
    }

    const params: PaginationQueryParams = {};

    params.page = lastProductPage.current_page + 1;

    categoryActionCreaterRef.current = getCategories(params, true);

    try {
      const productResponse = await categoryActionCreaterRef.current.unwrap();

      setCategoryPages(prevPages => {
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

  const categories = React.useMemo(() => {
    if (isLoadingCategories) {
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

    return categoryPages.flatMap(categoryPage =>
      categoryPage.data.map(category => ({
        type: "data" as const,
        id: category.id,
        text: category.title,
      })),
    );
  }, [isLoadingCategories, categoryPages]);

  return (
    <SelectionModal
      open={open}
      onSave={onSave}
      items={categories}
      onClose={onClose}
      title={"Select Category"}
      initialValue={initialValue}
      onEndReached={getNextCategories}
    />
  );
}
