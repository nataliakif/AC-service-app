import React from "react";
import { Button, DialogActions, Dialog } from "@react-native-material/core";
import { View } from "react-native";
import PartRepairExpandableItem from "./PartRepairExpandableItem";

export default function PartParamsAddDialog({
  visible,
  selectedPartToRepair,
  setShowParamsDialog,
  setSelectedPartToRepair,
  onAddPart,
  specificDetailAdding = false,
}) {
  return (
    <Dialog
      visible={visible}
      onDismiss={() => {
        setShowParamsDialog(false);
        setSelectedPartToRepair(null);
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderColor: "#DB5000",
          borderWidth: 1,
          borderRadius: 15,
          margin: -5,
          // height: 300,
        }}
      >
        <PartRepairExpandableItem
          selectedPartToRepair={selectedPartToRepair}
          isExpanded={true}
          onChangeParamsOfSelectedPart={setSelectedPartToRepair}
          canExpand={false}
          specificDetailAdding={specificDetailAdding}
        />

        <DialogActions>
          <Button
            title="Добавить в просчет"
            variant="text"
            style={{
              backgroundColor: "#DB5000",
              flex: 2,
              marginRight: 10,
            }}
            color="#fff"
            onPress={() => {
              onAddPart(selectedPartToRepair);
              setSelectedPartToRepair(null);
              setShowParamsDialog(false);
            }}
          />
          <Button
            title="Отмена"
            variant="text"
            onPress={() => {
              //console.log("closed");
              setShowParamsDialog(false);
              setSelectedPartToRepair(null);
            }}
            color="#DB5000"
            style={{ borderColor: "#DB5000", borderWidth: 1, flex: 2 }}
          />
        </DialogActions>
      </View>
    </Dialog>
  );
}
