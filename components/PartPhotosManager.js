import { View, StyleSheet } from "react-native";
import ImagePreview from "./ImagePreview";
import { Dimensions, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "./AddCarInfo";

const screenWidth = Dimensions.get("window").width;
// Calculate the width and height of each photo
const photoWidth = screenWidth * 0.28;
const photoHeight = (photoWidth / 4) * 3;

export default function PartPhotosManager({
  photoURL /*массив фоток*/,
  removePhotoURLFromSelectedPart,
  addPhotoURLToSelectedPart,
  showAddPhotoBtn = true,
  showDeletePhotoBtn = true,
  partIndex,
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 10,
      }}
    >
      {showAddPhotoBtn && (
        <TouchableOpacity
          onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              const photoURL = await uploadImage(result.assets[0].uri);
              addPhotoURLToSelectedPart(photoURL, partIndex);
            }
          }}
        >
          <View
            style={{
              ...styles.photoContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              style={{ color: "#DB5000" }}
              size={40}
              name="add-circle-outline"
            />
          </View>
        </TouchableOpacity>
      )}
      {photoURL?.map((url, index) => (
        <View key={index} style={styles.photoContainer}>
          <ImagePreview
            removePhotoURLFromSelectedPart={removePhotoURLFromSelectedPart}
            itemIndex={partIndex}
            imageUrl={url}
            showDeletePhotoBtn={showDeletePhotoBtn}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    width: photoWidth,
    height: photoHeight,
    marginRight: 6,
    padding: 5,
    borderColor: "orange",
    borderWidth: 1,
  },
});
