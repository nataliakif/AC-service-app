import CarModelImage from "../components/CarModelImage";
import { TouchableOpacity, Text } from "react-native";
import { View } from "react-native";
import { DialogActions } from "@react-native-material/core";
import { useState } from "react";
import { Dialog, Button } from "@react-native-material/core";
import ConfirmPartAddDialog from "./ConfirmPartAddDialog";
import PartParamsAddDialog from "./PartParamsAddDialog";

export const vocabularyParts = {
  hood: "Капот",
  frontBumper: "Пер. бампер",
  rearBumper: "Задн. бампер",
  trunk: "Багажник",
  frontLeftWing: "Пер. лев. крыло",
  frontRightWing: "Пер. прав. крыло",
  rearLeftWing: "Зад. лев. крыло",
  rearRightWing: "Задн. прав. крыло",
  frontLeftDoor: "Пер. лев. дверь",
  frontRightDoor: "Пер. прав. дверь",
  rearRightDoor: "Задн. прав. дверь",
  rearLeftDoor: "Задн. лев. дверь",
  roof: "Крыша",
};

export default function CarPartsSelector({
  alreadySelectedPartsToRepair,
  onAddPart,
}) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showParamsDialog, setShowParamsDialog] = useState(false);
  const [selectedPartToRepair, setSelectedPartToRepair] = useState(null);

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
    specific: false,
    note: "",
  };
  //console.log("current part for adding: " + selectedPartToRepair);

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 40,
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
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair({ ...carPartTemplate, partName: "hood" });
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
            setSelectedPartToRepair({
              ...carPartTemplate,
              partName: "frontBumper",
            });
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
            setSelectedPartToRepair({
              ...carPartTemplate,
              partName: "frontLeftWing",
            });
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
            setSelectedPartToRepair({
              ...carPartTemplate,
              partName: "frontRightWing",
            });
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
            setSelectedPartToRepair({
              ...carPartTemplate,
              partName: "frontLeftDoor",
            });
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

        {/* front right door */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair({
              ...carPartTemplate,
              partName: "frontRightDoor",
            });
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

        {/* roof */}
        <TouchableOpacity
          onPress={() => {
            //show alert to confirm then modal window set mew item
            setSelectedPartToRepair({
              ...carPartTemplate,
              partName: "roof",
            });
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
            partName={vocabularyParts[selectedPartToRepair.partName]}
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
