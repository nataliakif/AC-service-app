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
import Modal from "react-native-modal";
import EstimateOfSelectedPartsToRepair from "../components/EstimateOfSelectedPartsToRepair";
import { calculateTotalSumPerPart } from "../components/PartRepairExpandableItem";
import PartParamsAddDialog from "../components/PartParamsAddDialog";
import ParamsSwitcher from "../components/ParamsSwitcher";
import AddCarInfo from "../components/AddCarInfo";
import { AntDesign } from "@expo/vector-icons";

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
  const [showAddCarInfoDialog, setshowAddCarInfoDialog] = useState(false);

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
  const handleAddCarInfoDialog = (showDialog) => {
    setshowAddCarInfoDialog(showDialog);
  };
  return (
    <Provider>
      {showCarStartParamsDialog && (
        <Dialog visible={showCarStartParamsDialog}>
          <DialogHeader
            titleWrapperStyle={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
            title="Виберите категорию авто и цвета"
          />
          <View style={styles.paramsSwitcherCont}>
            <View style={styles.paramsSwitcherView}>
              <Ionicons size={30} name="car-outline" />
              <ParamsSwitcher
                style={{ backgroundColor: "#DB5000" }}
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
              color="#fff"
              style={{
                backgroundColor: "#DB5000",
                flex: 2,
                textTransform: "none",
              }}
            />
          </DialogActions>
        </Dialog>
      )}

      {!showCarStartParamsDialog && (
        <>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.addBtn}>
                <IconButton
                  color="#fff"
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
                  {paintCategory === 0
                    ? "I"
                    : paintCategory === 1
                    ? "II"
                    : "III"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn}>
                <IconButton
                  backgroundColor="#DB5000"
                  color="#fff"
                  icon={(props) => <Ionicons name="save-outline" {...props} />}
                />
              </TouchableOpacity>
            </View>
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
                  {!isPartsSelectorExpanded && (
                    <Text style={styles.totalPrice}>
                      {selectedPartsToRepair
                        .map((part) =>
                          calculateTotalSumPerPart(part.workAmount)
                        )
                        .reduce((prev, cur) => prev + cur, 0) + ` UAH`}
                    </Text>
                  )}
                  {!isPartsSelectorExpanded && (
                    <Text style={styles.priceText}>Стоимость</Text>
                  )}
                </View>

                <EstimateOfSelectedPartsToRepair
                  selectedPartsToRepair={selectedPartsToRepair}
                  isPartsSelectorExpanded={false}
                  onRemoveFromEstimate={removePartFromSelectedOnes}
                  handleAddCarInfoDialog={handleAddCarInfoDialog}
                />
              </>
            )}

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
              <ListItem
                onPress={() => {
                  setShowPartsListDialog(false);
                  setShowSpecificPartsDialog(true);
                  setSpecificPartToRepair({
                    partName: "",
                    workAmount: {
                      mountingTime: 0,
                      assemblingTime: 0,
                      repairTime: 0,
                      paintPrice: 0,
                      repairTime: 0,
                      orderNewDetailPrice: 0,
                    },
                    specific: true,
                  });
                }}
                title={"..."}
              />
            </ScrollView>

            <DialogActions>
              <Button
                title="Отмена"
                variant="text"
                color="#fff"
                onPress={() => {
                  setShowPartsListDialog(false);
                }}
                style={styles.button}
              />
            </DialogActions>
          </Dialog>
          <Modal
            style={styles.addCarInfoModal}
            isVisible={showAddCarInfoDialog}
            onBackdropPress={() => {
              setshowAddCarInfoDialog(false);
            }}
          >
            <AntDesign
              name="arrowleft"
              size={34}
              color="#DB5000"
              onPress={() => {
                setshowAddCarInfoDialog(false);
              }}
            />
            <AddCarInfo
              partsToRepair={{
                ...selectedPartsToRepair,
                carCategory,
                paintCategory,
              }}
            ></AddCarInfo>
          </Modal>
        </>
      )}
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 49,
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#DB5000",
    flex: 1,
  },

  expandBtn: {
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
    marginTop: 30,
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
  paramsSwitcherCont: {
    flexDirection: "row",
  },
  priceText: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17,
    color: "#BABABA",
    marginTop: 8,
  },
  paramsSwitcherView: { flex: 1, alignItems: "center" },
  partListDialog: {
    height: "70%",
  },
  addCarInfoModal: {
    margin: 0,
    backgroundColor: "#fff",
    paddingVertical: 50,
    paddingHorizontal: 15,
  },

  currentCarCategory: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  currentPaintCategory: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
