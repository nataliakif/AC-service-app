import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Divider } from "@react-native-material/core";

import PartRepairExpandableItem from "./PartRepairExpandableItem";
import React from "react";

import { calculateTotalSumPerPart } from "../components/PartRepairExpandableItem";

export default function EstimateOfSelectedPartsToRepair({
  selectedPartsToRepair,
  setPhotoURLToSelectedPart,
  removePhotoURLFromSelectedPart,
  onRemoveFromEstimate,
  isPartsSelectorExpanded = false,
  canAddPhoto = false,
  carModel = "",
}) {
  return (
    <View style={{ display: "flex", alignItems: "center", paddingTop: 15 }}>
      <View
        style={
          isPartsSelectorExpanded
            ? styles.totalPriceContExp
            : styles.totalPriceCont
        }
      >
        {!isPartsSelectorExpanded && (
          <>
            <Text style={styles.totalPrice}>
              {selectedPartsToRepair
                .map((part) => calculateTotalSumPerPart(part.workAmount))
                .reduce((prev, cur) => prev + cur, 0) + ` UAH`}
            </Text>
            <Text style={styles.priceText}>Стоимость</Text>
          </>
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Расчет {carModel}</Text>
        {selectedPartsToRepair.map((part, partIndex) => (
          <View key={partIndex}>
            <PartRepairExpandableItem
              selectedPartToRepair={part}
              isExpanded={false}
              canBeRemoved
              onRemoveFromSelected={onRemoveFromEstimate}
              canExpandSubItems={false}
              showZeroItems={false}
              canAddPhoto={canAddPhoto}
              onChangeParamsOfSelectedPart={setPhotoURLToSelectedPart}
              removePhotoURLFromSelectedPart={removePhotoURLFromSelectedPart}
              partIndex={partIndex}
            />

            <Divider style={styles.divider} />
          </View>
        ))}
      </View>
    </View>
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
  totalPriceCont: {
    marginTop: 45,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    borderRadius: 120,
    borderColor: "#DB5000",
    borderWidth: 2,
  },
  totalPriceContExp: {},
  totalPrice: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 29,
    color: "#DB5000",
  },
});
