import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase";
import { AntDesign } from "@expo/vector-icons";
import WorkList from "../components/WorkList";

export default function ServiceZonesScreen() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleZonePress = (zone) => {
    setModalVisible(true);
    setSelectedZone(zone);
  };

  useEffect(() => {
    const dataRef = ref(db, "calcs/");

    onValue(dataRef, (snapshot) => {
      const calcs = snapshot.val();
      setData(calcs);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const filteredKeys =
      data &&
      Object.keys(data).filter((key) => data[key].status === "inProgress");

    switch (selectedZone) {
      case "Assembling":
        const assemblingData = filteredKeys
          .filter((key) => {
            const item = data[key];

            return (
              item.workStatus &&
              item.workStatus.assemblingStatus !== "delete" &&
              item.partsToRepair.selectedPartsToRepair &&
              Object.values(item.partsToRepair.selectedPartsToRepair)
                .filter(
                  (part) => part.workAmount && part.workAmount.assemblingTime
                )
                .reduce(
                  (total, part) => total + part.workAmount.assemblingTime,
                  0
                ) > 0
            );
          })
          .map((key) => ({ key, ...data[key] }));
        setFilteredData(assemblingData);
        break;
      case "Mounting":
        const mountingData = filteredKeys
          .filter((key) => {
            const item = data[key];

            return (
              item.workStatus &&
              item.workStatus.mountingStatus !== "delete" &&
              item.partsToRepair.selectedPartsToRepair &&
              Object.values(item.partsToRepair.selectedPartsToRepair)
                .filter(
                  (part) => part.workAmount && part.workAmount.mountingTime
                )
                .reduce(
                  (total, part) => total + part.workAmount.mountingTime,
                  0
                ) > 0
            );
          })
          .map((key) => ({ key, ...data[key] }));

        setFilteredData(mountingData);
        break;
      case "Repair":
        const repairData = filteredKeys
          .filter((key) => {
            const item = data[key];

            return (
              item.workStatus &&
              item.workStatus.repairStatus !== "delete" &&
              item.partsToRepair.selectedPartsToRepair &&
              Object.values(item.partsToRepair.selectedPartsToRepair)
                .filter((part) => part.workAmount && part.workAmount.repairTime)
                .reduce(
                  (total, part) => total + part.workAmount.repairTime,
                  0
                ) > 0
            );
          })
          .map((key) => ({ key, ...data[key] }));
        setFilteredData(repairData);
        break;
      case "Paint":
        const paintData = filteredKeys
          .filter((key) => {
            const item = data[key];

            return (
              item.workStatus &&
              item.workStatus.paintStatus !== "delete" &&
              item.partsToRepair.selectedPartsToRepair &&
              Object.values(item.partsToRepair.selectedPartsToRepair)
                .filter((part) => part.workAmount && part.workAmount.paintPrice)
                .reduce(
                  (total, part) => total + part.workAmount.paintPrice,
                  0
                ) > 0
            );
          })
          .map((key) => ({ key, ...data[key] }));
        setFilteredData(paintData);
        break;
      case "Polishing":
        const polishData = filteredKeys
          .filter((key) => {
            const item = data[key];
            return (
              item.workStatus &&
              item.workStatus.polishingStatus !== "delete" &&
              item.partsToRepair.selectedPartsToRepair &&
              Object.values(item.partsToRepair.selectedPartsToRepair)
                .filter((part) => part.workAmount && part.workAmount.paintPrice)
                .reduce(
                  (total, part) => total + part.workAmount.paintPrice,
                  0
                ) > 0
            );
          })
          .map((key) => ({ key, ...data[key] }));
        setFilteredData(polishData);
        break;
      case "OrderNewDetails":
        const orderData = filteredKeys
          .filter((key) => {
            const item = data[key];

            return (
              item.workStatus &&
              item.workStatus.orderNewDetailsStatus !== "delete" &&
              item.partsToRepair.selectedPartsToRepair &&
              Object.values(item.partsToRepair.selectedPartsToRepair)
                .filter(
                  (part) =>
                    part.workAmount && part.workAmount.orderNewDetailPrice
                )
                .reduce(
                  (total, part) => total + part.workAmount.orderNewDetailPrice,
                  0
                ) > 0
            );
          })
          .map((key) => ({ key, ...data[key] }));
        setFilteredData(orderData);
        break;
      default:
        setFilteredData(null);
        break;
    }
  }, [data, selectedZone]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.zone}
        onPress={() => handleZonePress("Assembling")}
      >
        <Text style={styles.text}>Cборка/разборка</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.zone}
        onPress={() => handleZonePress("Mounting")}
      >
        <Text style={styles.text}>Снятие/Установка</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.zone}
        onPress={() => handleZonePress("Repair")}
      >
        <Text style={styles.text}>Ремонт/Рихтовка</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.zone}
        onPress={() => handleZonePress("Paint")}
      >
        <Text style={styles.text}>Покраска</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.zone}
        onPress={() => handleZonePress("Polishing")}
      >
        <Text style={styles.text}>Полировка</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.zone}
        onPress={() => handleZonePress("OrderNewDetails")}
      >
        <Text style={styles.text}>Заказ новых деталей</Text>
      </TouchableOpacity>

      <Modal animationType="slide" visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              paddingHorizontal: 20,
              marginTop: 80,
            }}
          >
            <AntDesign
              name="arrowleft"
              size={34}
              color="#DB5000"
              onPress={() => {
                setModalVisible(false);
              }}
            />
            <WorkList
              data={filteredData}
              isLoading={isLoading}
              selectedZone={selectedZone}
            ></WorkList>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
    paddingHorizontal: 15,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  zone: {
    flex: 1,
    marginBottom: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#DB5000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  modal: {
    margin: 0,
    backgroundColor: "#fff",
    paddingVertical: 50,
    paddingHorizontal: 15,
  },
});
