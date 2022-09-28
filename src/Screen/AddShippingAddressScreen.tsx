import React from "react";
import truncate from "lodash.truncate";
import {numberTransform} from "@utils/form";
import {Overlay} from "react-native-elements";
import {RootStackRoutes} from "@constants/routes";
import {useAppDispatch, useAppSelector} from "@hooks/store";
import {
  Title,
  useTheme,
  HelperText,
  ActivityIndicator,
} from "react-native-paper";
import {ErrorMessage} from "@hookform/error-message";
import {Controller, useForm} from "react-hook-form";
import Feather from "react-native-vector-icons/Feather";
import useDebouncedState from "@hooks/useDebouncedState";
import {addShippingAddress} from "@store/slices/authSlice";
import {SCREEN_PADDING_HORIZONTAL} from "@constants/spacing";
import AppPrimaryButton from "../Component/AppPrimaryButton";
import {
  useGetCitiesQuery,
  useGetCountriesQuery,
  useGetStatesQuery,
} from "@data/laravel/services/country";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  GetCitiesResponse,
  GetCountriesResponse,
  GetStatesResponse,
  RootStackParamList,
} from "@src/types";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  setGlobalStyles,
  FloatingLabelInput,
} from "react-native-floating-label-input";

setGlobalStyles.containerStyles = {
  height: 58,
  borderRadius: 6,
  paddingHorizontal: 10,
  backgroundColor: "#F7F7F7",
};

setGlobalStyles.customLabelStyles = {
  fontSizeFocused: 12,
  fontSizeBlurred: 15,
  colorFocused: "#707070",
  colorBlurred: "#707070",
};

setGlobalStyles.labelStyles = {
  paddingTop: 5,
  paddingHorizontal: 5,
  fontFamily: "Inter-Regular",
};

setGlobalStyles.inputStyles = {
  fontSize: 15,
  marginTop: 15,
  color: "#707070",
  fontWeight: "600",
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof RootStackRoutes.ADD_SHIPPING_ADDRESS
>;

type FormValues = {
  name: string;
  email: string;
  address: string;
  state: {
    id: number;
    label: string;
    value: number;
  } | null;
  city: {
    id: number;
    label: string;
    value: number;
  } | null;
  country: {
    id: number;
    label: string;
    value: number;
  } | null;
  phone: string;
  postal_code: number;
};

const AddShippingAddressScreen = ({navigation}: Props) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const shippingAddress = useAppSelector(state => state.auth.shippingAddress);
  const [modalType, setModalType] = React.useState<
    "state" | "city" | "" | "country"
  >("");
  const {control, handleSubmit, setValue} = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: null,
      state: null,
      country: null,
      address: "",
      postal_code: 0,
    },
  });

  React.useEffect(() => {
    setValue("name", shippingAddress.name);
    setValue("email", shippingAddress.email);
    setValue("phone", shippingAddress.phone);
    setValue("address", shippingAddress.address);

    if (shippingAddress.state) {
      setValue("state", shippingAddress.state);
    }

    if (shippingAddress.city) {
      setValue("city", shippingAddress.city);
    }

    if (shippingAddress.country) {
      setValue("country", shippingAddress.country);
    }

    if (shippingAddress.postal_code) {
      setValue("postal_code", shippingAddress.postal_code);
    }
  }, [setValue, shippingAddress]);

  const handleAddShippingAddress = handleSubmit(values => {
    dispatch(
      addShippingAddress({
        name: values.name,
        city: values.city!,
        phone: values.phone,
        email: values.email,
        state: values.state!,
        country: values.country!,
        address: values.address!,
        postal_code: values.postal_code,
      }),
    );

    navigation.goBack();
  });

  return (
    <View style={{padding: 20}}>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={{width: "100%", marginBottom: 16}}>
            <Controller
              name={"name"}
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <FloatingLabelInput
                      label={"Name*"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />

                    <ErrorMessage
                      name={"name"}
                      errors={errors}
                      render={({message}) => (
                        <Text
                          style={{color: theme.colors.error, marginTop: 10}}>
                          {message}
                        </Text>
                      )}
                    />
                  </React.Fragment>
                );
              }}
            />
          </View>

          <View style={{width: "100%", marginBottom: 16}}>
            <Controller
              name={"email"}
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <FloatingLabelInput
                      label={"Email*"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />

                    <ErrorMessage
                      name={"email"}
                      errors={errors}
                      render={({message}) => (
                        <Text
                          style={{color: theme.colors.error, marginTop: 10}}>
                          {message}
                        </Text>
                      )}
                    />
                  </React.Fragment>
                );
              }}
            />
          </View>

          <View style={{width: "100%", marginBottom: 16}}>
            <Controller
              name={"address"}
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <FloatingLabelInput
                      label={"Address*"}
                      value={field.value}
                      onChangeText={field.onChange}
                    />

                    <ErrorMessage
                      errors={errors}
                      name={"address"}
                      render={({message}) => (
                        <HelperText type={"error"}>{message}</HelperText>
                      )}
                    />
                  </React.Fragment>
                );
              }}
            />
          </View>

          <View
            style={{
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <Controller
              name={"state"}
              rules={{
                required: "This field is required",
              }}
              control={control}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 60,
                        padding: 10,
                        borderRadius: 8,
                        marginRight: 10,
                        backgroundColor: "#F7F7F7",
                      }}
                      onPress={() => setModalType("state")}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#111111",
                          fontFamily: "Inter-Regular",
                        }}>
                        State*
                      </Text>

                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#707070",
                            fontFamily: "Inter-Regular",
                          }}>
                          {truncate(field.value?.label ?? "", {
                            length: 15,
                          })}
                        </Text>
                        <Feather
                          size={25}
                          name="chevron-down"
                          color={"#707070"}
                        />
                      </View>
                    </TouchableOpacity>

                    <ErrorMessage
                      errors={errors}
                      name={"state"}
                      render={({message}) => (
                        <HelperText type={"error"}>{message}</HelperText>
                      )}
                    />

                    <StateSelectionModal
                      initialValue={field.value}
                      open={modalType === "state"}
                      onClose={() => setModalType("")}
                      onSave={item => field.onChange(item)}
                    />
                  </React.Fragment>
                );
              }}
            />

            <Controller
              name={"city"}
              rules={{
                required: "This field is required",
              }}
              control={control}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 60,
                        padding: 10,
                        borderRadius: 8,
                        backgroundColor: "#F7F7F7",
                      }}
                      onPress={() => setModalType("city")}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#111111",
                          fontFamily: "Inter-Regular",
                        }}>
                        City*
                      </Text>

                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#707070",
                            fontFamily: "Inter-Regular",
                          }}>
                          {truncate(field.value?.label ?? "", {
                            length: 15,
                          })}
                        </Text>
                        <Feather
                          size={25}
                          name="chevron-down"
                          color={"#707070"}
                        />
                      </View>
                    </TouchableOpacity>

                    <ErrorMessage
                      errors={errors}
                      name={"city"}
                      render={({message}) => (
                        <HelperText type={"error"}>{message}</HelperText>
                      )}
                    />

                    <CitySelectionModal
                      initialValue={field.value}
                      open={modalType === "city"}
                      onClose={() => setModalType("")}
                      onSave={item => field.onChange(item)}
                    />
                  </React.Fragment>
                );
              }}
            />
          </View>

          <View
            style={{
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <Controller
              name={"country"}
              rules={{
                required: "This field is required",
              }}
              control={control}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        height: 60,
                        padding: 10,
                        borderRadius: 8,
                        marginRight: 10,
                        backgroundColor: "#F7F7F7",
                      }}
                      onPress={() => setModalType("country")}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#111111",
                          fontFamily: "Inter-Regular",
                        }}>
                        Country*
                      </Text>

                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#707070",
                            fontFamily: "Inter-Regular",
                          }}>
                          {truncate(field.value?.label ?? "", {
                            length: 15,
                          })}
                        </Text>
                        <Feather
                          size={25}
                          name="chevron-down"
                          color={"#707070"}
                        />
                      </View>
                    </TouchableOpacity>

                    <ErrorMessage
                      errors={errors}
                      name={"country"}
                      render={({message}) => (
                        <HelperText type={"error"}>{message}</HelperText>
                      )}
                    />

                    <CountrySelectionModal
                      initialValue={field.value}
                      open={modalType === "country"}
                      onClose={() => setModalType("")}
                      onSave={item => field.onChange(item)}
                    />
                  </React.Fragment>
                );
              }}
            />
          </View>

          <View style={{width: "100%", marginBottom: 16}}>
            <Controller
              control={control}
              name={"postal_code"}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <FloatingLabelInput
                      label={"ZipCode*"}
                      value={numberTransform.input(field.value)}
                      onChangeText={value =>
                        field.onChange(numberTransform.output(value))
                      }
                    />

                    <ErrorMessage
                      errors={errors}
                      name={"postal_code"}
                      render={({message}) => (
                        <HelperText type={"error"}>{message}</HelperText>
                      )}
                    />
                  </React.Fragment>
                );
              }}
            />
          </View>

          <View style={{width: "100%", marginBottom: 16}}>
            <Controller
              control={control}
              name={"phone"}
              render={({field, formState: {errors}}) => {
                return (
                  <React.Fragment>
                    <FloatingLabelInput
                      value={field.value}
                      label={"Mobile Number*"}
                      keyboardType={"number-pad"}
                      onChangeText={field.onChange}
                    />

                    <ErrorMessage
                      errors={errors}
                      name={"phone"}
                      render={({message}) => (
                        <HelperText type={"error"}>{message}</HelperText>
                      )}
                    />
                  </React.Fragment>
                );
              }}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <AppPrimaryButton
        text={"Save"}
        containerStyle={{
          alignSelf: "center",
        }}
        onPress={handleAddShippingAddress}
      />
    </View>
  );
};

export default AddShippingAddressScreen;

function CountrySelectionModal({
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
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebouncedState(searchTerm);
  const [resourcePages, setResourcePages] = React.useState<
    Array<GetCountriesResponse["countries"]>
  >([]);

  const {
    isLoading,
    isFetching,
    data: citiesResponse,
  } = useGetCountriesQuery({
    search_text: debouncedSearchTerm,
  });

  React.useEffect(() => {
    if (!isLoading && !!citiesResponse) {
      setResourcePages([citiesResponse.countries]);
    }
  }, [citiesResponse, isLoading]);

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

  return (
    <Overlay
      focusable
      fullScreen
      isVisible={open}
      animationType={"slide"}
      overlayStyle={{
        padding: 0,
      }}
      onRequestClose={onClose}>
      <View style={{flex: 1}}>
        <View
          style={{
            padding: 15,
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

        {isFetching && (
          <View style={{marginVertical: 10}}>
            <ActivityIndicator size={"small"} />
          </View>
        )}

        <FlatList<typeof resources[0]>
          data={resources}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
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

            const isSelected = initialValue?.id === item.id;

            return (
              <TouchableOpacity
                onPress={() => {
                  onSave({
                    id: item.id,
                    value: item.id,
                    label: item.name,
                  });
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
        />
      </View>
    </Overlay>
  );
}

function CitySelectionModal({
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
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebouncedState(searchTerm);
  const [resourcePages, setResourcePages] = React.useState<
    Array<GetCitiesResponse["cities"]>
  >([]);

  const {
    isLoading,
    isFetching,
    data: citiesResponse,
  } = useGetCitiesQuery({
    search_text: debouncedSearchTerm,
  });

  React.useEffect(() => {
    if (!isLoading && !!citiesResponse) {
      setResourcePages([citiesResponse.cities]);
    }
  }, [citiesResponse, isLoading]);

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

  return (
    <Overlay
      focusable
      fullScreen
      isVisible={open}
      animationType={"slide"}
      overlayStyle={{
        padding: 0,
      }}
      onRequestClose={onClose}>
      <View style={{flex: 1}}>
        <View
          style={{
            padding: 15,
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

        {isFetching && (
          <View style={{marginVertical: 10}}>
            <ActivityIndicator size={"small"} />
          </View>
        )}

        <FlatList<typeof resources[0]>
          data={resources}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
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

            const isSelected = initialValue?.id === item.id;

            return (
              <TouchableOpacity
                onPress={() => {
                  onSave({
                    id: item.id,
                    value: item.id,
                    label: item.name,
                  });
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
        />
      </View>
    </Overlay>
  );
}

function StateSelectionModal({
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
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm] = useDebouncedState(searchTerm);
  const [resourcePages, setResourcePages] = React.useState<
    Array<GetStatesResponse["states"]>
  >([]);

  const {
    isLoading,
    isFetching,
    data: statesResponse,
  } = useGetStatesQuery({
    search_text: debouncedSearchTerm,
  });

  React.useEffect(() => {
    if (!isLoading && !!statesResponse) {
      setResourcePages([statesResponse.states]);
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

  return (
    <Overlay
      focusable
      fullScreen
      isVisible={open}
      animationType={"slide"}
      overlayStyle={{
        padding: 0,
      }}
      onRequestClose={onClose}>
      <View style={{flex: 1}}>
        <View
          style={{
            padding: 15,
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

        {isFetching && (
          <View style={{marginVertical: 10}}>
            <ActivityIndicator size={"small"} />
          </View>
        )}

        <FlatList<typeof resources[0]>
          data={resources}
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <Title>Choose State</Title>}
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

            const isSelected = initialValue?.id === item.id;

            return (
              <TouchableOpacity
                onPress={() => {
                  onSave({
                    id: item.id,
                    value: item.id,
                    label: item.name,
                  });
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
        />
      </View>
    </Overlay>
  );
}
