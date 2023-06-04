import React, { useState, useEffect } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  IconButton,
  Provider,
  DialogActions,
  Dialog,
  Button,
  ListItem,
  DialogHeader,
} from "@react-native-material/core";
import Ionicons from "react-native-vector-icons/Ionicons";
import GestureRecognizer from "react-native-swipe-detect";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import { ref, set, update } from "firebase/database";
import { db } from "../config/firebase";

import CarPartsSelector from "../components/CarPartsSelector";
import EstimateOfSelectedPartsToRepair from "../components/EstimateOfSelectedPartsToRepair";
import PartParamsAddDialog from "../components/PartParamsAddDialog";
import ParamsSwitcher from "../components/ParamsSwitcher";
import AddCarInfo, { deletePhotoFromStorage } from "../components/AddCarInfo";

import { useNavigation, useRoute } from "@react-navigation/native";

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
  const [carInfo, setCarInfo] = useState({
    model: "",
    color: "",
    number: "",
    owner: "",
    vinCode: "",
    phone: "",
    description: "",
    photoURL: "",
  });
  const [carPartsSelectorBaseHeight] = useState(new Animated.Value(0));
  const [isPartsSelectorExpanded, setIsPartsSelectorExpanded] = useState(true);
  const [showSpecificPartsDialog, setShowSpecificPartsDialog] = useState(false);
  const [specificPartToRepair, setSpecificPartToRepair] = useState(null);
  const [showPartsListDialog, setShowPartsListDialog] = useState(false);
  const [showCarStartParamsDialog, setShowCarStartParamsDialog] =
    useState(true);
  const [showAddCarInfoForm, setShowAddCarInfoForm] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!route.params) {
      return;
    }
    setEditMode(true);
    const { carInfo, partsToRepair } = route.params;
    setCarInfo(carInfo);
    setSelectedPartsToRepair(partsToRepair.selectedPartsToRepair);
    setCarCategory(partsToRepair.carCategory);
    setPaintCategory(partsToRepair.paintCategory);
    setShowCarStartParamsDialog(false);
  }, []);

  useEffect(() => {
    Animated.timing(carPartsSelectorBaseHeight, {
      toValue: isPartsSelectorExpanded ? 510 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isPartsSelectorExpanded, carPartsSelectorBaseHeight]);

  const setPhotoURLToSelectedPart = (url, itemIndex) => {
    setSelectedPartsToRepair((prevState) => {
      const modifiedParts = [...prevState];
      if (!modifiedParts[itemIndex].photoURL?.length)
        modifiedParts[itemIndex].photoURL = [];
      modifiedParts[itemIndex].photoURL.push(url);
      return modifiedParts;
    });
  };
  const removePhotoURLFromSelectedPart = (url, itemIndex) => {
    setSelectedPartsToRepair((prevState) => {
      const modifiedParts = [...prevState];
      modifiedParts[itemIndex].photoURL.splice(
        modifiedParts[itemIndex].photoURL.indexOf(url),
        1
      );
      return modifiedParts;
    });
  };

  const addPartToSelectedOnes = (partToRepair) => {
    setSelectedPartsToRepair((prevState) => [...prevState, partToRepair]);
  };

  const saveNewItemToDB = async () => {
    set(ref(db, "calcs/" + uuid.v1()), {
      carInfo,
      status: "pending",
      partsToRepair: {
        selectedPartsToRepair,
        carCategory,
        paintCategory,
      },
    })
      .then(() => {
        console.log("item created in firebase db");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateItemInDB = async () => {
    update(ref(db, "calcs/" + route.params.key), {
      carInfo,
      partsToRepair: {
        selectedPartsToRepair,
        carCategory,
        paintCategory,
      },
      workStatus: route.params.workStatus ? route.params.workStatus : {},
      status: route.params.status,
    })
      .then(() => {
        console.log("item updated in firebase db");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removePartFromSelectedOnes = (partNameToRemove) => {
    selectedPartsToRepair
      .find((item) => item.partName === partNameToRemove)
      .photoURL?.map((url) => deletePhotoFromStorage(url));
    setSelectedPartsToRepair((prevState) => [
      ...prevState.filter((part) => part.partName !== partNameToRemove),
    ]);
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
              <Ionicons size={25} name="car-outline" />
              <ParamsSwitcher
                style={{ backgroundColor: "#DB5000" }}
                curValue={carCategory}
                onItemChange={setCarCategory}
              />
            </View>
            <View style={styles.paramsSwitcherView}>
              <Ionicons size={25} name="color-palette-outline" />
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
            <AntDesign
              name="arrowleft"
              size={34}
              color="#DB5000"
              style={styles.backBtn}
              onPress={() => {
                Alert.alert(
                  "Подтверждение",
                  "Вы уверени что хотите выйти без сохранения данных?",
                  [
                    {
                      text: "Отмена",
                      style: "cancel",
                    },
                    {
                      text: "Да",
                      style: "destructive",
                      onPress: () => navigation.goBack(),
                    },
                  ],
                  { cancelable: false }
                );
              }}
            />

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

              <IconButton
                disabled={!(carInfo.model && selectedPartsToRepair.length > 0)}
                style={{
                  opacity:
                    carInfo.model && selectedPartsToRepair.length > 0 ? 1 : 0.2,
                }}
                backgroundColor="#DB5000"
                color="#fff"
                icon={(props) => <Ionicons name="save-outline" {...props} />}
                onPress={async () => {
                  //при добавлении нового просчета
                  if (editMode) {
                    await updateItemInDB();
                  } else await saveNewItemToDB();

                  navigation.navigate("Архив");
                }}
              />
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

            <ScrollView style={styles.scrollContainer} alwaysBounceVertical>
              {selectedPartsToRepair.length > 0 && (
                <>
                  <EstimateOfSelectedPartsToRepair
                    selectedPartsToRepair={selectedPartsToRepair}
                    isPartsSelectorExpanded={isPartsSelectorExpanded}
                    onRemoveFromEstimate={removePartFromSelectedOnes}
                    setShowAddCarInfoForm={setShowAddCarInfoForm}
                    setPhotoURLToSelectedPart={setPhotoURLToSelectedPart}
                    removePhotoURLFromSelectedPart={
                      removePhotoURLFromSelectedPart
                    }
                    carModel={carInfo.model}
                    canAddPhoto={editMode}
                  />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.button}
                      onPress={() => {
                        setShowAddCarInfoForm(true);
                      }}
                    >
                      <Text style={styles.buttonText}>Инфо о авто</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>

            {!isPartsSelectorExpanded && (
              <View style={styles.expandBtn}>
                <IconButton
                  icon={(props) => (
                    <Ionicons name="car-sport-outline" {...props} />
                  )}
                  onPress={() => setIsPartsSelectorExpanded(true)}
                />
                <Ionicons
                  style={{ position: "absolute", top: 35 }}
                  name="chevron-down-outline"
                />
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
            <ScrollView
              style={{
                ...styles.partListDialog,
              }}
            >
              {partListData.map((part, index) => (
                <ListItem
                  key={index}
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
                      photoURL: [],
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
                    photoURL: [],
                    specific: true,
                  });
                }}
                title={"..."}
              />
            </ScrollView>

            <DialogActions>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.button}
                  onPress={() => {
                    setShowPartsListDialog(false);
                  }}
                >
                  <Text style={styles.buttonText}>Отмена</Text>
                </TouchableOpacity>
              </View>
            </DialogActions>
          </Dialog>

          <Modal
            style={styles.addCarInfoModal}
            isVisible={showAddCarInfoForm}
            onBackdropPress={() => {
              setShowAddCarInfoForm(false);
            }}
          >
            <AntDesign
              name="arrowleft"
              size={34}
              color="#DB5000"
              onPress={() => {
                setShowAddCarInfoForm(false);
              }}
            />
            <AddCarInfo
              setShowAddCarInfoForm={setShowAddCarInfoForm}
              onCarInfoFormSubmit={setCarInfo}
              initialValues={carInfo}
            />
          </Modal>
        </>
      )}
    </Provider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { width: "100%" },
  container: {
    position: "relative",
    height: "100%",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 55,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  expandBtn: {
    alignItems: "center",
    position: "absolute",
    top: 30,
  },

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
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
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

  backBtn: {
    position: "absolute",
    left: 10,
    top: 40,
  },
});
