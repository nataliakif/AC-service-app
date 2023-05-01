import CarModelImage from "../components/CarModelImage";
import { TouchableOpacity, Text } from "react-native";
import { View } from "react-native";
import { useState } from "react";
import ConfirmPartAddDialog from "./ConfirmPartAddDialog";
import PartParamsAddDialog from "./PartParamsAddDialog";

const partListData = require("../config/price.json");

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
    };
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          paddingTop: 40,
          //backgroundColor: "green",
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
