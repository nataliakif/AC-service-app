import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import ImageView from "react-native-image-viewing";
import { deletePhotoFromStorage } from "./AddCarInfo";
import Ionicons from "react-native-vector-icons/Ionicons";
export const ImagePreview = ({
  imageUrl,
  itemIndex,
  removePhotoURLFromSelectedPart,
  showDeletePhotoBtn = true,
}) => {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  const openFullScreen = () => {
    setIsImageViewVisible(true);
  };

  const closeFullScreen = () => {
    setIsImageViewVisible(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={openFullScreen}>
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: "100%", height: "100%" }}
          />
          {showDeletePhotoBtn && (
            <TouchableOpacity
              onPress={() => {
                deletePhotoFromStorage(imageUrl);
                removePhotoURLFromSelectedPart(imageUrl, itemIndex);
              }}
              style={{ position: "absolute", top: 1, right: 1 }}
            >
              <Ionicons style={{ color: "#DB5000" }} size={20} name="close" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      <ImageView
        images={[{ uri: imageUrl }]}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={closeFullScreen}
      />
    </View>
  );
};

export default ImagePreview;
