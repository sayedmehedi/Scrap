import React from "react";
import axios from "axios";
import {View, Image} from "react-native";
import {useAppSelector} from "@hooks/store";
import {Asset} from "react-native-image-picker";
import {ProductUploadedImage} from "@src/types";
import {LinearProgress} from "react-native-elements";
import {useUploadProductImageMutation} from "@data/laravel/services/product";

interface Props {
  image: Asset;
  onUploadSuccess: (res?: ProductUploadedImage) => void;
}

export default function ProductImageUploader({image, onUploadSuccess}: Props) {
  const [progress, setProgress] = React.useState(0);
  const authToken = useAppSelector(state => state.auth.token);

  const [uploadProductImage] = useUploadProductImageMutation();

  React.useEffect(() => {
    if (!!image) {
      uploadProductImage({
        image: {
          uri: image.uri!,
          type: image.type!,
          name: image.fileName!,
        },
        onUploadProgress(sent, total) {
          setProgress(sent / total);
        },
      })
        .unwrap()
        .then(res => {
          console.log("uploaded product image", res);
          onUploadSuccess("error" in res ? undefined : res.images);
        })
        .catch(err => {
          console.log("error hoise upload e", err);
          onUploadSuccess();
        });
    }
  }, [uploadProductImage, image, onUploadSuccess, authToken]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
      <View style={{marginRight: 5, height: 50, width: 50}}>
        <Image
          source={{
            width: 50,
            height: 50,
            uri: image.uri,
          }}
        />
      </View>
      <View style={{flex: 1}}>
        <LinearProgress variant="determinate" value={progress} />
      </View>
    </View>
  );
}
