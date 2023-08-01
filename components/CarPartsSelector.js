import CarModelImage from "../components/CarModelImage";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useState } from "react";
import ConfirmPartAddDialog from "./ConfirmPartAddDialog";
import PartParamsAddDialog from "./PartParamsAddDialog";

import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase";

let partListData = [];
async function getPriceFromDB() {
  const dataRef = ref(db, "price");

  onValue(dataRef, (snapshot) => {
    partListData = snapshot.val();
  });
}
getPriceFromDB();

export default function CarPartsSelector({
  alreadySelectedPartsToRepair,
  onAddPart,
  currentCarCategory,
  currentPaintCategory,
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showParamsDialog, setShowParamsDialog] = useState(false);
  const [selectedPartToRepair, setSelectedPartToRepair] = useState(null);

  const generatePartTemplate = (partName, partNameToShow = partName) => {
    const partTemplate = partListData.find(
      (part) => part.partName === partName
    );
    return {
      partName: partNameToShow,
      workAmount: {
        mountingTime: partTemplate.workAmount.mountingTime[currentCarCategory],
        assemblingTime:
          partTemplate.workAmount.assemblingTime[currentCarCategory],
        repairTime: 0,
        paintPrice: partTemplate.workAmount.paintPrice[currentPaintCategory],
        orderNewDetailPrice: 0,
      },
      specific: false,
      photoURL: [],
    };
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 40,
          //backgroundColor: "yellow",
        }}
      >
        <CarModelImage
          selectedPartsNames={alreadySelectedPartsToRepair.map(
            (part) => part.partName
          )}
        />
        {/* hood */}
        <TouchableOpacity
          onPress={() => {
            setSelectedPartToRepair(generatePartTemplate("Капот"));
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 100,
            height: 80,
            //backgroundColor: "green",
            top: 60,
          }}
        />

        {/* front bamper */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(generatePartTemplate("Бампер передний"));
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 100,
            height: 30,
            //backgroundColor: "green",
            top: 25,
          }}
        />

        {/* front left wiing */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Крыло переднее", "Крыло пер. лев.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            left: 10,
            top: 85,
          }}
        />

        {/* front right wing */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Крыло переднее", "Крыло пер. прав.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            right: 10,
            top: 85,
          }}
        />

        {/* front left door */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Дверь", "Дверь пер. лев.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            left: 10,
            top: 210,
          }}
        />

        {/* rear left door */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Дверь", "Дверь задн. лев.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            left: 10,
            top: 290,
          }}
        />

        {/* front right door */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Дверь", "Дверь пер. прав.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            right: 10,
            top: 210,
          }}
        />

        {/* rear right door */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Дверь", "Дверь задн. прав.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            right: 10,
            top: 290,
          }}
        />

        {/* rear right wing */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Крыло заднее", "Крыло задн. прав.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            right: 10,
            top: 370,
          }}
        />

        {/* rear right wing */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(
              generatePartTemplate("Крыло заднее", "Крыло задн. лев.")
            );
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 30,
            height: 75,
            //backgroundColor: "green",
            left: 10,
            top: 370,
          }}
        />

        {/* trunk */}
        <TouchableOpacity
          onPress={() => {
            setSelectedPartToRepair(generatePartTemplate("Багажник"));
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 100,
            height: 35,
            //backgroundColor: "green",
            top: 435,
          }}
        />

        {/* Rear bumper */}
        <TouchableOpacity
          onPress={() => {
            setSelectedPartToRepair(generatePartTemplate("Бампер задний"));
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 140,
            height: 25,
            //backgroundColor: "green",
            top: 480,
          }}
        />

        {/* roof */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair(generatePartTemplate("Крыша"));
            setShowConfirmDialog(true);
          }}
          style={{
            position: "absolute",
            width: 100,
            height: 200,
            //backgroundColor: "green",
            top: 230,
          }}
        />
      </View>

      {/* dialog that confirms user part item to calc */}

      {selectedPartToRepair && (
        <>
          <ConfirmPartAddDialog
            partName={selectedPartToRepair.partName}
            visible={showConfirmDialog}
            showConfirmDialog={setShowConfirmDialog}
            showParamsDialog={setShowParamsDialog}
          />

          <PartParamsAddDialog
            visible={showParamsDialog}
            selectedPartToRepair={selectedPartToRepair}
            setShowParamsDialog={setShowParamsDialog}
            setSelectedPartToRepair={setSelectedPartToRepair}
            onAddPart={onAddPart}
          />
        </>
      )}
    </>
  );
}
