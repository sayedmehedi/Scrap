import React from "react";
import useAppSnackbar from "@hooks/useAppSnackbar";
import {PostItemStackParamList} from "@src/types";
import Entypo from "react-native-vector-icons/Entypo";
import {PostItemStackRoutes} from "../../constants/routes";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {HelperText, Text, useTheme} from "react-native-paper";
import {TouchableOpacity} from "react-native-gesture-handler";
import AppPrimaryButton from "../../Component/AppPrimaryButton";
import {TextInput, View, Alert, ScrollView, Image} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";

type Props = NativeStackScreenProps<
  PostItemStackParamList,
  typeof PostItemStackRoutes.UPLOAD_PHOTO
>;

export default function ProductImageUploadScreen({navigation}: Props) {
  const theme = useTheme();
  const {enqueueErrorSnackbar} = useAppSnackbar();
  const [productTitle, setProductTitle] = React.useState("");
  const [galleryImages, setGalleryImages] = React.useState<Asset[]>([]);
  const [coverImage, setCoverImage] = React.useState<Asset | null>(null);

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
      if (!coverImage) {
        setCoverImage(result.assets?.[0] ?? null);
      } else {
        if (galleryImages.length + (result.assets?.length ?? 0) > 8) {
          Alert.alert("Error", "Image limit reached");
          return;
        }

        setGalleryImages(prevImages => [
          ...prevImages,
          ...(result.assets ?? []),
        ]);
      }
    }
  };

  const handleSelectImage = async () => {
    try {
      // You can also use as a promise without 'callback':
      const result = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: !!coverImage ? 0 : 8,
      });

      handleImageResult(result);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  const handleTakePicture = async () => {
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

  const handleRemoveCoverImage = () => {
    setCoverImage(null);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleNextScreen = () => {
    if (!coverImage) {
      enqueueErrorSnackbar({
        text1: "Please add a cover image",
      });
      return;
    }

    if (galleryImages.length === 0) {
      enqueueErrorSnackbar({
        text1: "Please add at least one gallery image",
      });
      return;
    }

    if (!productTitle) {
      enqueueErrorSnackbar({
        text1: "Please add product title",
      });
      return;
    }

    navigation.navigate(PostItemStackRoutes.ADD_DETAILS, {
      productTitle,
      productCoverImage: coverImage,
      productGalleryImages: galleryImages,
    });
  };

  return (
    <ScrollView style={{paddingHorizontal: 15}}>
      <View
        style={{
          paddingTop: 30,
          flexDirection: "row",
          justifyContent: "center",
        }}>
        <TouchableOpacity
          onPress={handleTakePicture}
          style={{
            width: 115,
            height: 115,
            borderRadius: 1000,
            alignItems: "center",
            marginHorizontal: 20,
            justifyContent: "center",
            backgroundColor: theme.colors.primary05,
          }}>
          <EvilIcons name={"camera"} size={45} />
          <Text style={{marginTop: 2}}>Take Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSelectImage}
          style={{
            width: 115,
            height: 115,
            borderRadius: 1000,
            alignItems: "center",
            marginHorizontal: 20,
            justifyContent: "center",
            backgroundColor: theme.colors.accent05,
          }}>
          <EvilIcons name={"image"} size={45} />
          <Text style={{marginTop: 2}}>Select Image</Text>
        </TouchableOpacity>
      </View>

      {!coverImage ? (
        <TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              marginTop: 40,
              marginBottom: 50,
              textAlign: "center",
              textDecorationLine: "underline",
            }}>
            First add your cover image
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={{marginVertical: 15, position: "relative", zIndex: 0}}>
          <View
            style={{
              top: 10,
              right: 10,
              zIndex: 3,
              position: "absolute",
            }}>
            <TouchableOpacity
              style={{
                width: 25,
                height: 25,
                borderRadius: 1000,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.white,
              }}
              onPress={handleRemoveCoverImage}>
              <EvilIcons name={"close"} size={20} />
            </TouchableOpacity>
          </View>

          <View>
            <Image
              source={{
                uri: coverImage.uri ?? "",
              }}
              style={{
                zIndex: 0,
                height: 153,
                width: "100%",
                borderRadius: theme.roundness * 3,
              }}
            />
          </View>
        </View>
      )}

      {galleryImages.length > 0 && (
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
          {galleryImages.map((image, i) => (
            <View
              key={i}
              style={{
                width: "25%",
                marginBottom: 15,
                position: "relative",
                paddingLeft: i % 4 === 0 ? 0 : 15,
              }}>
              <View
                style={{
                  top: 5,
                  right: 5,
                  zIndex: 3,
                  position: "absolute",
                }}>
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 1000,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.colors.white,
                  }}
                  onPress={handleRemoveGalleryImage.bind(null, i)}>
                  <EvilIcons name={"close"} size={20} />
                </TouchableOpacity>
              </View>

              <View>
                <Image
                  source={{
                    uri: image.uri,
                  }}
                  style={{
                    zIndex: 0,
                    height: 50,
                    borderRadius: theme.roundness * 3,
                  }}
                />
              </View>
            </View>
          ))}

          <View
            style={{
              width: "25%",
              marginBottom: 15,
              paddingLeft: galleryImages.length % 4 === 0 ? 0 : 15,
            }}>
            <TouchableOpacity
              style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: theme.roundness * 3,
                backgroundColor: theme.colors.primary05,
              }}
              onPress={handleSelectImage}>
              <Entypo name={"plus"} size={30} />
            </TouchableOpacity>
          </View>

          <View style={{flexGrow: 1, width: "100%", marginBottom: 40}}>
            <Text>Using {galleryImages.length}/8 images</Text>
          </View>
        </View>
      )}

      <View>
        <TextInput
          value={productTitle}
          placeholder="Product Title"
          onChangeText={setProductTitle}
          placeholderTextColor={theme.colors.text}
          style={{
            height: 45,
            borderWidth: 1,
            borderRadius: 100,
            textAlign: "center",
            paddingHorizontal: 15,
            borderColor: theme.colors.accent05,
            backgroundColor: theme.colors.white,
          }}
        />
        <HelperText type="info" style={{textAlign: "center", marginTop: 5}}>
          Example: Brand, Model, Color, Size etc.
        </HelperText>
      </View>

      <AppPrimaryButton
        text={"Next"}
        onPress={handleNextScreen}
        containerStyle={{marginVertical: 35}}
      />
    </ScrollView>
  );
}
