import React from "react";
import AppPrimaryButton from "./AppPrimaryButton";
import {ListItem, Overlay} from "react-native-elements";
import {View, FlatList, TouchableOpacity} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {ActivityIndicator, Divider, Title, useTheme} from "react-native-paper";

type Item<T> = {
  id: number;
  value: T;
  type: "data";
  label: string;
};

export default function SelectionModal<T>({
  open,
  title,
  onSave,
  onClose,
  items = [],
  initialValue,
  onEndReached,
  loading = false,
  isFetchingNext = false,
}: {
  open: boolean;
  title: string;
  loading?: boolean;
  onClose: () => void;
  isFetchingNext?: boolean;
  onEndReached?: () => void;
  initialValue?: Omit<Item<T>, "type"> | null;
  items: (Item<T> | {id: number; type: "skeleton"})[];
  onSave: (item: Omit<Item<T>, "type"> | null) => void;
}) {
  const theme = useTheme();
  const [selectedData, setSelectedData] = React.useState<Omit<
    Item<T>,
    "type"
  > | null>(null);

  const handleSave = () => {
    onSave(selectedData);
    onClose();
  };

  React.useEffect(() => {
    if (initialValue) {
      setSelectedData(initialValue);
    }
  }, [initialValue]);

  return (
    <Overlay fullScreen focusable isVisible={open} animationType={"slide"}>
      <View style={{flex: 1}}>
        <View style={{padding: 15}}>
          <Title>{title}</Title>
        </View>

        {isFetchingNext ? (
          <View
            style={{
              padding: 10,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <ActivityIndicator size={"small"} />
          </View>
        ) : null}

        <FlatList<Item<T> | {id: number; type: "skeleton"}>
          initialNumToRender={4}
          onEndReachedThreshold={0.5}
          data={
            loading
              ? new Array(15).fill(1).map((_, id) => ({id, type: "skeleton"}))
              : items
          }
          onEndReached={onEndReached}
          renderItem={({item}) => {
            if (item.type === "skeleton") {
              return (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item paddingBottom={2}>
                    <SkeletonPlaceholder.Item height={30} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              );
            }

            return (
              <React.Fragment>
                <ListItem
                  hasTVPreferredFocus
                  tvParallaxProperties={{}}
                  Component={TouchableOpacity}
                  containerStyle={{
                    backgroundColor:
                      item.id === selectedData?.id
                        ? theme.colors.primary
                        : theme.colors.white,
                  }}
                  onPress={() => setSelectedData(item)}>
                  <ListItem.Content
                    // @ts-ignore
                    containerStyle={{
                      padding: 0,
                      borderWidth: 0,
                    }}>
                    <ListItem.Title
                      style={{
                        color:
                          item.id === selectedData?.id
                            ? theme.colors.white
                            : theme.colors.text,
                      }}>
                      {item.label}
                    </ListItem.Title>
                  </ListItem.Content>
                </ListItem>
                <Divider style={{width: "100%", height: 2}} />
              </React.Fragment>
            );
          }}
        />

        <View style={{marginTop: 15}}>
          <AppPrimaryButton onPress={handleSave} text={"Save"} />
        </View>

        <View style={{marginVertical: 15}}>
          <AppPrimaryButton
            containerStyle={{
              borderWidth: 1,
              backgroundColor: "transparent",
              borderColor: theme.colors.primary,
            }}
            textStyle={{
              color: theme.colors.primary,
            }}
            onPress={onClose}
            text={"Cancel"}
          />
        </View>
      </View>
    </Overlay>
  );
}
