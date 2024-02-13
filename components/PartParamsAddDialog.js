import React from "react";
import { DialogActions, Dialog } from "@react-native-material/core";
import { Button } from "react-native-paper";
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
          borderRadius: 15,
          paddingVertical: 20,
          paddingHorizontal: 10,
          margin: -5,
        }}
      >
        <PartRepairExpandableItem
          selectedPartToRepair={selectedPartToRepair}
          isExpanded={true}
          onChangeParamsOfSelectedPart={setSelectedPartToRepair}
          canExpand={false}
          specificDetailAdding={specificDetailAdding}
        />

        <DialogActions style={{ marginTop: 60 }}>
          <Button
            mode="contained"
            style={{
              borderRadius: 8,
              backgroundColor: "#DB5000",
              flex: 2,
            }}
            onPress={() => {
              onAddPart(selectedPartToRepair);
              setSelectedPartToRepair(null);
              setShowParamsDialog(false);
            }}
          >
            Добавить
          </Button>
          <Button
            mode="contained"
            buttonColor="fff"
            textColor="#DB5000"
            onPress={() => {
              //console.log("closed");
              setShowParamsDialog(false);
              setSelectedPartToRepair(null);
            }}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              borderColor: "#DB5000",
              flex: 2,
              marginLeft: 8,
            }}
          >
            Отмена
          </Button>
        </DialogActions>
      </View>
    </Dialog>
  );
}
