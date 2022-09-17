import React from "react";
import {ListItem} from "react-native-elements";
import AppPrimaryButton from "./AppPrimaryButton";
import {Divider, Title, useTheme} from "react-native-paper";
import {Modal, View, FlatList, TouchableOpacity} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default function SelectionModal({
  open,
  title,
  onSave,
  onClose,
  items = [],
  initialValue,
  onEndReached,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  onEndReached?: () => void;
  items: (
    | {id: number; text: string; type: "data"}
    | {id: number; type: "skeleton"}
  )[];
  initialValue?: {id: number; text: string} | null;
  onSave: (item: {id: number; text: string} | null) => void;
}) {
  const theme = useTheme();
  const [selectedData, setSelectedData] = React.useState<{
    id: number;
    text: string;
  } | null>(null);

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
    <Modal visible={open} animationType={"slide"}>
      <View style={{padding: 15}}>
        <Title>{title}</Title>
      </View>

      <FlatList
        data={items}
        onEndReached={onEndReached}
        renderItem={({item}) => {
          if (item.type === "skeleton") {
            return (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item />
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
                    {item.text}
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
    </Modal>
  );
}
