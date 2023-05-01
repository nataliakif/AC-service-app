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
import { Divider, IconButton } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";

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

            {/* <Ionicons style={styles.icon} name={"cog-outline"} /> */}
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
              {`${calculateTotalSumPerPart(selectedPartToRepair.workAmount)}`}
            </Text>
            {canBeRemoved && (
              <IconButton
                style={styles.removeBtn}
                icon={(props) => (
                  <Ionicons name="close-circle-outline" {...props} />
                )}
                onPress={() => {
                  onRemoveFromSelected(selectedPartToRepair.partName);
                }}
              />
            )}
          </View>
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
    fontWeight: "500",
    fontSize: 22,
    marginLeft: 5,
  },
  partNameTitleCont: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    //backgroundColor: "yellow",
  },
  icon: {
    marginLeft: 5,
  },
  titleCont: {
    margin: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceText: {
    fontSize: 18,
    lineHeight: 20,
    textAlign: "right",
    paddingRight: 5,
    fontWeight: "500",
  },
  priceCont: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 2,
  },
  removeBtn: {
    height: 25,
    width: 25,
  },
  textInput: {
    flex: 1,
    alignItems: "flex-end",
    marginLeft: 5,
    marginRight: 5,
    paddingLeft: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
