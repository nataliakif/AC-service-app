import * as React from "react";
import { IconButton } from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  View,
  Animated,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CarPartsSelector from "../components/CarPartsSelector";
import { useState, useEffect } from "react";
import GestureRecognizer from "react-native-swipe-detect";
import {
  Provider,
  DialogActions,
  Dialog,
  Button,
  ListItem,
  DialogHeader,
} from "@react-native-material/core";
import EstimateOfSelectedPartsToRepair from "../components/EstimateOfSelectedPartsToRepair";
import { calculateTotalSumPerPart } from "../components/PartRepairExpandableItem";
import PartParamsAddDialog from "../components/PartParamsAddDialog";
import ParamsSwitcher from "../components/ParamsSwitcher";

const partListData = require("../config/price.json");

export const vocabularyTasks = {
  mountingTime: "снятие / установка",
  assemblingTime: "разборка / сборка",
  repairTime: "ремонт / рихтовка",
  paintPrice: "покраска",
  //polishingPrice: "полировка",
  orderNewDetailPrice: "заказ новой детали",
};

export default function CalculateScreen() {
  const [carCategory, setCarCategory] = useState(1);
  const [paintCategory, setPaintCategory] = useState(1);
  const [selectedPartsToRepair, setSelectedPartsToRepair] = useState([]);
  const [carPartsSelectorBaseHeight] = useState(new Animated.Value(0));
  const [isPartsSelectorExpanded, setIsPartsSelectorExpanded] = useState(true);
  const [showSpecificPartsDialog, setShowSpecificPartsDialog] = useState(false);
  const [specificPartToRepair, setSpecificPartToRepair] = useState(null);
  const [showPartsListDialog, setShowPartsListDialog] = useState(false);
  const [showCarStartParamsDialog, setShowCarStartParamsDialog] =
    useState(true);

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
      {showCarStartParamsDialog && (
        <Dialog visible={showCarStartParamsDialog}>
          <DialogHeader title="Виберите категорию авто и цвета" />
          <View style={styles.paramsSwitcherCont}>
            <View style={styles.paramsSwitcherView}>
              <Ionicons size={30} name="car-outline" />
              <ParamsSwitcher
                curValue={carCategory}
                onItemChange={setCarCategory}
              />
            </View>
            <View style={styles.paramsSwitcherView}>
              <Ionicons size={30} name="color-palette-outline" />
              <ParamsSwitcher
                curValue={paintCategory}
                onItemChange={setPaintCategory}
              />
            </View>
          </View>
          <DialogActions>
            <Button
              title="Сохранить"
              variant="text"
              onPress={() => {
                setShowCarStartParamsDialog(false);
              }}
              color="#DB5000"
              style={{ borderColor: "#DB5000", borderWidth: 1, flex: 2 }}
            />
          </DialogActions>
        </Dialog>
      )}

      {!showCarStartParamsDialog && (
        <>
          <View
            style={{
              height: "100%",
              alignItems: "center",
              marginTop: 50,
              paddingBottom: 49,
            }}
          >
            <TouchableOpacity
              style={styles.currentCarCategory}
              onPress={() => setShowCarStartParamsDialog(true)}
            >
              <Ionicons size={25} name="car-outline" />
              <Text style>
                {" "}
                - {carCategory === 0 ? "I" : carCategory === 1 ? "II" : "III"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.currentPaintCategory}
              onPress={() => setShowCarStartParamsDialog(true)}
            >
              <Ionicons size={25} name="color-palette-outline" />
              <Text style>
                {" "}
                -{" "}
                {paintCategory === 0 ? "I" : paintCategory === 1 ? "II" : "III"}
              </Text>
            </TouchableOpacity>
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
                    currentCarCategory={carCategory}
                    currentPaintCategory={paintCategory}
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
                    {isPartsSelectorExpanded && "Σ "}
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
                      setShowPartsListDialog(true);
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
                  icon={(props) => (
                    <Ionicons name="car-sport-outline" {...props} />
                  )}
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

          <Dialog
            visible={showPartsListDialog}
            onDismiss={() => {
              setShowPartsListDialog(false);
            }}
          >
            <Text>List of parts</Text>
            <ScrollView style={styles.partListDialog}>
              {partListData.map((part) => (
                <ListItem
                  onPress={() => {
                    setShowPartsListDialog(false);
                    setShowSpecificPartsDialog(true);
                    setSpecificPartToRepair({
                      partName: part.partName,
                      workAmount: {
                        mountingTime: part.workAmount.mountingTime[carCategory],
                        assemblingTime:
                          part.workAmount.assemblingTime[carCategory],
                        repairTime: part.workAmount.repairTime,
                        paintPrice: part.workAmount.paintPrice[paintCategory],
                        repairTime: 0,
                        orderNewDetailPrice: 0,
                      },
                      specific: true,
                    });
                  }}
                  title={part.partName}
                />
              ))}
            </ScrollView>

            <DialogActions>
              <Button
                title="Отмена"
                variant="text"
                onPress={() => {
                  setShowPartsListDialog(false);
                }}
                color="#DB5000"
                style={{ borderColor: "#DB5000", borderWidth: 1, flex: 2 }}
              />
            </DialogActions>
          </Dialog>
        </>
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
    fontWeight: "500",
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
    borderColor: "gray",
    borderWidth: 1.5,
  },
  totalPriceContExp: {},
  paramsSwitcherCont: {
    display: "flex",
    flexDirection: "row",
  },
  paramsSwitcherView: { flex: 1, alignItems: "center" },
  partListDialog: {
    height: "60%",
  },
  currentCarCategory: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    left: 80,
    top: 11,
  },
  currentPaintCategory: {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    right: 80,
    top: 11,
  },
});
