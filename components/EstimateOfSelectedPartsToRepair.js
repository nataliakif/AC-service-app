import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Divider } from "@react-native-material/core";
import ImagePreview from "./ImagePreview";
import PartRepairExpandableItem from "./PartRepairExpandableItem";
import React from "react";
import { Dimensions } from "react-native";

export default function EstimateOfSelectedPartsToRepair({
  selectedPartsToRepair,
  setPhotoURLToSelectedPart,
  removePhotoURLFromSelectedPart,
  onRemoveFromEstimate,
  handleAddCarInfoDialog,
}) {
  const screenWidth = Dimensions.get("window").width;

  // Calculate the width and height of each photo
  const photoWidth = screenWidth * 0.3;
  const photoHeight = (photoWidth / 4) * 3;
  return (
    <ScrollView style={styles.container} alwaysBounceVertical>
      <Text style={styles.title}>Расчет</Text>
      {selectedPartsToRepair.map((part, partIndex) => (
        <View key={partIndex}>
          <PartRepairExpandableItem
            selectedPartToRepair={part}
            isExpanded={false}
            canBeRemoved
            onRemoveFromSelected={onRemoveFromEstimate}
            canExpandSubItems={false}
            showZeroItems={false}
            canAddPhoto={true}
            onChangeParamsOfSelectedPart={setPhotoURLToSelectedPart}
            itemIndex={partIndex}
          />
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {part.photoURL.map((url, index) => (
              <View
                key={index}
                style={{
                  width: photoWidth,
                  height: photoHeight,
                  padding: 5,
                  borderColor: "orange",
                  borderWidth: 1,
                }}
              >
                <ImagePreview
                  removePhotoURLFromSelectedPart={
                    removePhotoURLFromSelectedPart
                  }
                  itemIndex={partIndex}
                  imageUrl={url}
                />
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />
        </View>
      ))}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={() => handleAddCarInfoDialog(true)}
        >
          <Text style={styles.buttonText}>Далее</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  title: {
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 24,
  },
  divider: {
    backgroundColor: "#E8E8E8",
    marginVertical: 5,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 26,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    width: 200,
    backgroundColor: "#DB5000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
