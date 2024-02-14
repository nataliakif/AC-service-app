import React from "react";
import {
  DialogHeader,
  DialogActions,
  Dialog,
} from "@react-native-material/core";
import { Button } from "react-native-paper";
import { View } from "react-native";

export default function ConfirmPartAddDialog({
  partName,
  visible,
  showConfirmDialog,
  showParamsDialog,
}) {
  return (
    <>
      <Dialog visible={visible} onDismiss={() => showConfirmDialog(false)}>
        <View
          style={{
            backgroundColor: "#fff",
            borderColor: "#DB5000",
            borderWidth: 1,
            borderRadius: 15,
            margin: -5,
          }}
        >
          <DialogHeader title={`${partName}?`} />
          <DialogActions>
            <Button
              mode="contained"
              style={{
                backgroundColor: "#DB5000",
                borderRadius: 8,
                flex: 2,
                marginRight: 10,
              }}
              onPress={() => {
                showParamsDialog(true);
                showConfirmDialog(false);
              }}
            >
              Да
            </Button>
            <Button
              mode="contained"
              onPress={() => showConfirmDialog(false)}
              buttonColor="fff"
              textColor="#DB5000"
              style={{
                borderColor: "#DB5000",
                borderRadius: 8,
                borderWidth: 1,
                flex: 2,
              }}
            >
              Нет
            </Button>
          </DialogActions>
        </View>
      </Dialog>
    </>
  );
}
