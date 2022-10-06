import React from "react";
import {useAppSelector} from "@hooks/store";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {TouchableOpacity, Alert} from "react-native";
import {useUpdateProfileMutation} from "@data/laravel/services/auth";
import {Avatar, BottomSheet, ListItem, Text} from "react-native-elements";
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
} from "react-native-image-picker";

export default function ProfileImageUploader() {
  const {enqueueSuccessSnackbar} = useAppSnackbar();
  const [isVisible, setIsVisible] = React.useState(false);
  const profile = useAppSelector(state => state.auth.profile);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadImage, {isLoading, isSuccess, isError, data}] =
    useUpdateProfileMutation();

  React.useEffect(() => {
    if ((!isLoading && isSuccess) || isError) {
      setUploadProgress(0);
    }
  }, [isSuccess, isLoading, isError]);

  React.useEffect(() => {
    if (isSuccess && !!data && "success" in data) {
      enqueueSuccessSnackbar({
        text1: "Success",
        text2: data.success,
      });
    }

    if (isSuccess && !!data && "error" in data) {
      enqueueSuccessSnackbar({
        text1: "Error",
        text2: data.error,
      });
    }
  }, [isSuccess, data, enqueueSuccessSnackbar]);

  const handleImageResult = (result: ImagePickerResponse) => {
    if (result.errorCode) {
      switch (result.errorCode) {
        case "camera_unavailable":
          Alert.alert("Error", "Your device has no camera");
          break;
        case "permission":
          Alert.alert(
            "Permission Error",
            "Please allow permission to open camera and gallery",
          );
          break;
        default:
          Alert.alert("Error", result.errorMessage);
          break;
      }
    }
    if (!result.didCancel) {
      uploadImage({
        onUploadProgress(sent, total) {
          const progress = Math.round(sent / total) * 100;

          setUploadProgress(progress);
        },
        image: result.assets?.[0],
      });
    }
  };

  const handleSelectImage = async () => {
    setIsVisible(false);
    try {
      // You can also use as a promise without 'callback':
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1,
      });

      handleImageResult(result);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleTakePicture = async () => {
    setIsVisible(false);
    try {
      // You can also use as a promise without 'callback':
      const result = await launchCamera({
        mediaType: "photo",
      });

      handleImageResult(result);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <React.Fragment>
      <TouchableOpacity disabled={isLoading} onPress={() => setIsVisible(true)}>
        <Avatar
          rounded
          size={"large"}
          source={{
            uri: profile?.profile_image,
          }}
        />
      </TouchableOpacity>

      {isLoading && <Text>{uploadProgress}%</Text>}

      {/* @ts-ignore */}
      <BottomSheet
        isVisible={isVisible}
        modalProps={{
          onRequestClose: () => setIsVisible(false),
        }}>
        {/* @ts-ignore */}
        <ListItem onPress={handleTakePicture}>
          <ListItem.Content>
            <ListItem.Title>Take picture</ListItem.Title>
          </ListItem.Content>
        </ListItem>

        {/* @ts-ignore */}
        <ListItem onPress={handleSelectImage}>
          <ListItem.Content>
            <ListItem.Title>Select image</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>
    </React.Fragment>
  );
}
