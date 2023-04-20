import * as React from "react";
import { IconButton } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Animated, StyleSheet, Text } from "react-native";
import CarPartsSelector from "../components/CarPartsSelector";
import { useState, useEffect } from "react";
import GestureRecognizer, { swipeDirections } from "react-native-swipe-detect";
import { Provider } from "@react-native-material/core";
import EstimateOfSelectedPartsToRepair from "../components/EstimateOfSelectedPartsToRepair";
import { calculateTotalSumPerPart } from "../components/PartRepairExpandableItem";
import PartParamsAddDialog from "../components/PartParamsAddDialog";

export const vocabularyTasks = {
  mountingPrice: "снятие / установка",
  assemblingPrice: "разборка / сборка",
  repairPrice: "ремонт / рихтовка",
  paintPrice: "покраска",
  polishingPrice: "полировка",
  orderNewDetailPrice: "заказ новой детали",
};

const selectedPartsToRepairBase = [];

export default function CalculateScreen() {
  const [selectedPartsToRepair, setSelectedPartsToRepair] = useState(
    selectedPartsToRepairBase
  );
  const [carPartsSelectorBaseHeight] = useState(new Animated.Value(0));
  const [isPartsSelectorExpanded, setIsPartsSelectorExpanded] = useState(true);
  const [showSpecificPartsDialog, setShowSpecificPartsDialog] = useState(false);
  const [specificPartToRepair, setSpecificPartToRepair] = useState(null);

  //console.log(specificPartToRepair);

  const carPartTemplate = {
    partName: "",
    workAmount: {
      mountingPrice: 0,
      assemblingPrice: 0,
      repairPrice: 0,
      paintPrice: 0,
      polishingPrice: 0,
      orderNewDetailPrice: 0,
    },
    specific: true,
    note: "",
  };

  useEffect(() => {
    Animated.timing(carPartsSelectorBaseHeight, {
      toValue: isPartsSelectorExpanded ? 510 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isPartsSelectorExpanded, carPartsSelectorBaseHeight]);

  const addPartToSelectedOnes = (partToRepair) => {
    setSelectedPartsToRepair((prevState) => [...prevState, partToRepair]);
  };

  const removePartFromSelectedOnes = (partNameToRemove) => {
    setSelectedPartsToRepair((prevState) => [
      ...prevState.filter((part) => part.partName !== partNameToRemove),
    ]);
  };

  return (
    <Provider>
      <View
        style={{
          height: "100%",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <GestureRecognizer
          onSwipeUp={() => {
            setIsPartsSelectorExpanded(false);
          }}
          onSwipeDown={() => {
            setIsPartsSelectorExpanded(true);
          }}
        >
          <Animated.View
            style={{
              height: carPartsSelectorBaseHeight,
            }}
          >
            {isPartsSelectorExpanded && (
              <CarPartsSelector
                alreadySelectedPartsToRepair={selectedPartsToRepair}
                onAddPart={addPartToSelectedOnes}
              />
            )}
          </Animated.View>
        </GestureRecognizer>

        {selectedPartsToRepair.length > 0 && (
          <>
            <View
              style={
                isPartsSelectorExpanded
                  ? styles.totalPriceContExp
                  : styles.totalPriceCont
              }
            >
              <Text style={styles.totalPrice}>
                {isPartsSelectorExpanded && "Σ"} $
                {selectedPartsToRepair
                  .map((part) => calculateTotalSumPerPart(part.workAmount))
                  .reduce((prev, cur) => prev + cur, 0)}
              </Text>
            </View>
            <EstimateOfSelectedPartsToRepair
              selectedPartsToRepair={selectedPartsToRepair}
              isPartsSelectorExpanded={false}
              onRemoveFromEstimate={removePartFromSelectedOnes}
            />
          </>
        )}

        <View style={styles.addBtn}>
          <IconButton
            backgroundColor="#DB5000"
            icon={(props) => (
              <Ionicons
                name="add-outline"
                {...props}
                onPress={() => {
                  setShowSpecificPartsDialog(true);
                  setSpecificPartToRepair(carPartTemplate);
                }}
              />
            )}
          />
        </View>
        <View style={styles.saveBtn}>
          <IconButton
            backgroundColor="#DB5000"
            icon={(props) => <Ionicons name="save-outline" {...props} />}
          />
        </View>
        {!isPartsSelectorExpanded && (
          <View style={styles.expandBtn}>
            <IconButton
              icon={(props) => <Ionicons name="car-sport-outline" {...props} />}
              onPress={() => setIsPartsSelectorExpanded(true)}
            />
            <Ionicons name="chevron-down-outline" />
          </View>
        )}
      </View>

      {showSpecificPartsDialog && (
        <PartParamsAddDialog
          visible={showSpecificPartsDialog}
          selectedPartToRepair={specificPartToRepair}
          setShowParamsDialog={setShowSpecificPartsDialog}
          setSelectedPartToRepair={setSpecificPartToRepair}
          onAddPart={addPartToSelectedOnes}
          specificDetailAdding={true}
        />
      )}
    </Provider>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    position: "absolute",
    left: 15,
    top: 5,
  },
  saveBtn: {
    position: "absolute",
    right: 15,
    top: 5,
  },
  expandBtn: {
    position: "absolute",
    top: 5,
    alignItems: "center",
  },
  totalPrice: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 24,
    lineHeight: 29,
    color: "#DB5000",
  },
  totalPriceCont: {
    marginTop: 70,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderRadius: 120,
    borderColor: "grey",
    borderWidth: 1.5,
  },
  totalPriceContExp: {},
});
