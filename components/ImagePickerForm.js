import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { useFormikContext } from "formik";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const ImagePickerForm = ({ name, image, setImage }) => {
  const { setFieldValue } = useFormikContext();

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const source = { uri: result.assets[0].uri };
      setImage(source);
      setFieldValue(name, result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity style={styles.imageContainer} onPress={handleChooseImage}>
      {!image ? (
        <View style={styles.iconContainer}>
          <MaterialIcons name="add" size={70} color="#fff" />
        </View>
      ) : (
        <Image source={{ uri: image.uri }} style={styles.image} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 300,
    height: 200,
    backgroundColor: "#BABABA",
    marginHorizontal: 30,

    overflow: "hidden",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    color: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImagePickerForm;
