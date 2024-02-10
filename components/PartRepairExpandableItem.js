import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import PartPhotosManager from "./PartPhotosManager";
import Gear from "../assets/gear.svg";
import PartRepairTaskExpandable from "./PartRepairTaskExpandable";
import { Divider } from "@react-native-material/core";

const perHourPay = 500;

export const calculateTotalSumPerPart = (workAmount) => {
  let totalSum = 0;
  for (const key in workAmount) {
    if (key.includes("Time")) {
      totalSum += workAmount[key] * perHourPay;
    } else totalSum += workAmount[key];
  }
  return totalSum;
};

export default function PartRepairExpandableItem({
  selectedPartToRepair,
  isExpanded = false,
  onChangeParamsOfSelectedPart,
  canBeRemoved = false,
  canExpandSubItems = true,
  canExpand = true,
  onRemoveFromSelected,
  showZeroItems = true,
  specificDetailAdding = false,
  canAddPhoto = false,
  partIndex,
  removePhotoURLFromSelectedPart,
  changeParamsOfPartFromEstimate,
  setPhotoURLToSelectedPart,
  editable = true,
  hideInfoFromCustomer = false,
}) {
  const [itemBaseHeight] = useState(new Animated.Value(0));
  const [expanded, setExpanded] = useState(isExpanded);
  const [expandedSubItemsCount, setExpandedSubItemsCount] = useState(0);
  const [showPhotoManger, setShowPhotoManager] = useState(false);
  const route = useRoute();
  const { name } = route;

  let workAmountToDisplay = Object.keys(selectedPartToRepair.workAmount);

  if (!showZeroItems) {
    workAmountToDisplay = workAmountToDisplay.filter(
      (key) => selectedPartToRepair.workAmount[key] > 0
    );
  }
  const subItemHeight = 50;
  useEffect(() => {
    Animated.timing(itemBaseHeight, {
      toValue: expanded
        ? subItemHeight * workAmountToDisplay.length +
          expandedSubItemsCount * 30
        : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, itemBaseHeight, expandedSubItemsCount]);

  // console.log(selectedPartToRepair);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (canExpand) {
            setExpanded(!expanded);
          }
        }}
      >
        <View style={styles.titleCont}>
          <View style={styles.partNameTitleCont}>
            {!hideInfoFromCustomer && canAddPhoto && (
              <TouchableOpacity
                onPress={async () => {
                  //show part photo manager
                  setShowPhotoManager(!showPhotoManger);
                }}
              >
                {selectedPartToRepair.photoURL?.length > 0 ? (
                  <Ionicons size={20} name="camera" />
                ) : (
                  <Ionicons size={20} name="camera-outline" />
                )}
              </TouchableOpacity>
            )}

            {!canAddPhoto ||
              (hideInfoFromCustomer && <Gear style={styles.icon} />)}

            {specificDetailAdding ? (
              <TextInput
                style={styles.textInput}
                value={selectedPartToRepair.partName}
                onChangeText={(value) => {
                  onChangeParamsOfSelectedPart((prevState) => {
                    return { ...prevState, partName: value };
                  });
                }}
              />
            ) : (
              <Text style={styles.partName}>
                {selectedPartToRepair.partName}
              </Text>
            )}
          </View>
          {editable && (
            <View
              style={
                canExpandSubItems ? styles.priceContModal : styles.priceCont
              }
            >
              <Text style={styles.priceText}>
                {`${calculateTotalSumPerPart(
                  selectedPartToRepair.workAmount
                )} $`}
              </Text>
            </View>
          )}
          {name !== "В работе" &&
            name !== "Сервис" &&
            canBeRemoved &&
            !hideInfoFromCustomer && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onRemoveFromSelected(selectedPartToRepair.partName);
                }}
              >
                <Text style={styles.buttonText}>Удалить</Text>
              </TouchableOpacity>
            )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <>
          <Animated.View
            style={{
              height: itemBaseHeight,
            }}
          >
            {workAmountToDisplay.map((key, index) => (
              <View key={index}>
                <Divider style={styles.divider} />

                <PartRepairTaskExpandable
                  key={index}
                  repairTaskName={key}
                  repairTaskPrice={selectedPartToRepair.workAmount[key]}
                  onPriceChangeDuringAdd={onChangeParamsOfSelectedPart}
                  onSubitemExpand={setExpandedSubItemsCount}
                  canExpand={canExpandSubItems}
                  numericInputStep={key.includes("Time") ? 0.1 : 1}
                  partIndex={partIndex}
                  changeParamsOfPartFromEstimate={
                    changeParamsOfPartFromEstimate
                  }
                  routeName={name}
                  editable={editable}
                />
              </View>
            ))}
          </Animated.View>
        </>
      )}
      {/* Фото начало */}

      {showPhotoManger && (
        <PartPhotosManager
          photoURL={selectedPartToRepair.photoURL}
          removePhotoURLFromSelectedPart={removePhotoURLFromSelectedPart}
          partIndex={partIndex}
          addPhotoURLToSelectedPart={setPhotoURLToSelectedPart}
        />
      )}

      {/* Фото конец */}
    </>
  );
}

const styles = StyleSheet.create({
  partName: {
    fontWeight: "400",
    fontSize: 18,
    marginLeft: 8,
  },
  partNameTitleCont: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  titleCont: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500",
  },
  priceCont: {
    marginRight: 20,
  },
  priceContModal: { marginLeft: 20 },
  divider: {
    marginVertical: 8,
  },
  buttonText: { marginLeft: 5, color: "#DB5000" },

  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 5,
  },
});
