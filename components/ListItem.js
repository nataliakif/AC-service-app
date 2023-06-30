import React, { useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../config/firebase";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import EstimateOfSelectedPartsToRepair from "./EstimateOfSelectedPartsToRepair";
import WorkStatus from "./WorkStatus";
import StatusDropdown from "./StatusDropdown";
import AddCarInfoForm from "./AddCarInfo";
import { useRoute } from "@react-navigation/native";
import { exportToPDF } from "./exportToPdf";
import Chat from "./Chat";

const ListItem = ({ data, setModalVisible, selectedZone }) => {
  const { carInfo, key, partsToRepair, workStatus } = data;
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [chatVisible, setChatVisible] = useState("false");
  const route = useRoute();
  const { name } = route;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleStatusChange = () => {
    const updatedWorkStatus = {
      ...workStatus,
      [selectedZone.toLowerCase() + "Status"]: selectedStatus,
    };

    update(ref(db, "calcs/" + key), {
      workStatus: updatedWorkStatus,
    })
      .then(() => {
        console.log("Object updated");
        setModalVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleExportToPDF = () => {
    exportToPDF(data);
  };
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View>
            <Image
              source={{ uri: carInfo.photoURL }}
              defaultSource={require("../images/plugPhoto.jpeg")}
              style={styles.image}
            />
            {name === "Сервис" && (
              <WorkStatus workStatus={workStatus}></WorkStatus>
            )}
            <EstimateOfSelectedPartsToRepair
              selectedPartsToRepair={partsToRepair.selectedPartsToRepair}
              setPhotoURLToSelectedPart={true}
              canAddPhoto={true}
              removePhotoURLFromSelectedPart={true}
              onRemoveFromEstimate={true}
              carModel=""
              changeParamsOfPartFromEstimate={true}
            />
            <AddCarInfoForm
              setShowAddCarInfoForm={true}
              initialValues={carInfo}
              isEditable={false}
            />

            {name === "Сервис" && (
              <View>
                <StatusDropdown
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setChatVisible(true)}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={46}
                    color="#DB5000"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.button}
                  onPress={handleStatusChange}
                >
                  <Text style={styles.buttonText}>Изменить</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* {name !== "Сервис" && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={handleExportToPDF}
            >
              <Text style={styles.buttonText}>Экспорт в PDF</Text>
            </TouchableOpacity>
          )} */}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <Modal
        style={styles.modal}
        visible={chatVisible}
        onRequestClose={() => setChatVisible(false)}
        animationType="slide"
      >
        <View>
          <AntDesign
            name="arrowleft"
            size={34}
            color="#DB5000"
            onPress={() => {
              setChatVisible(false);
            }}
          />

          <Chat></Chat>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 50,
  },
  scroll: {
    flex: 1,
    width: "100%",
  },
  image: {
    width: 340,
    height: 220,
    backgroundColor: "#BABABA",
    marginHorizontal: 0,
  },

  button: {
    marginTop: 36,
    height: 60,
    paddingHorizontal: 130,
    paddingVertical: 20,
    textAlign: "center",
    backgroundColor: "#DB5000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    flexDirection: "row",
  },
  disabledButton: {
    opacity: 0.5,
  },
  partContainer: {
    flexDirection: "column",
  },
  partNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
  },
  partName: {
    fontWeight: "400",
    fontSize: 18,
    marginLeft: 8,
  },
  workAmountContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  workAmount: { color: "#757373", marginBottom: 5 },
  modal: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 50,
    paddingHorizontal: 15,
  },
});

export default ListItem;
