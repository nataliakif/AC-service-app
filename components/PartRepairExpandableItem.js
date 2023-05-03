import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Animated,
  Text,
  StyleSheet,
  View,
  TextInput,
} from "react-native";
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
}) {
  const [itemBaseHeight] = useState(new Animated.Value(0));
  const [expanded, setExpanded] = useState(isExpanded);
  const [expandedSubItemsCount, setExpandedSubItemsCount] = useState(0);

  let workAmountToDisplay = Object.keys(selectedPartToRepair.workAmount);

  if (!showZeroItems) {
    workAmountToDisplay = workAmountToDisplay.filter(
      (key) => selectedPartToRepair.workAmount[key] > 0
    );
  }
  const subItemHeight = canExpandSubItems ? 28 : 24;
  useEffect(() => {
    Animated.timing(itemBaseHeight, {
      toValue: expanded
        ? 40 +
          subItemHeight * workAmountToDisplay.length +
          expandedSubItemsCount * 40
        : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded, itemBaseHeight, expandedSubItemsCount]);

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
            <Gear style={styles.icon} />
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
          <View style={styles.priceCont}>
            <Text style={styles.priceText}>
              {`${calculateTotalSumPerPart(
                selectedPartToRepair.workAmount
              )} UAH`}
            </Text>
          </View>
          {canBeRemoved && (
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
        <Animated.View style={{ height: itemBaseHeight }}>
          {workAmountToDisplay.map((key, index) => (
            <View key={index}>
              <Divider style={styles.divider} />
              <PartRepairTaskExpandable
                key={index}
                repairTaskName={key}
                repairTaskPrice={selectedPartToRepair.workAmount[key]}
                onPriceChange={onChangeParamsOfSelectedPart}
                onSubitemExpand={setExpandedSubItemsCount}
                canExpand={canExpandSubItems}
                numericInputStep={key.includes("Time") ? 0.1 : 1}
              />
            </View>
          ))}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  partName: {
    fontWeight: "400",
    fontSize: 18,
    marginLeft: 5,
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
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "500",
  },
  priceCont: {
    marginRight: 40,
  },
  divider: {
    marginVertical: 8,
  },
  buttonText: { color: "#DB5000" },

  textInput: {
    flex: 2,
    alignItems: "flex-end",
    marginLeft: 5,
    marginRight: 10,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 5,
  },
});
