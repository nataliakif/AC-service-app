import React from "react";
import {
  Button,
  DialogHeader,
  DialogActions,
  Dialog,
} from "@react-native-material/core";
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
              title="Да"
              variant="text"
              style={{ backgroundColor: "#DB5000", flex: 2, marginRight: 10 }}
              color="#fff"
              onPress={() => {
                showParamsDialog(true);
                showConfirmDialog(false);
              }}
            />
            <Button
              title="Нет"
              variant="text"
              onPress={() => showConfirmDialog(false)}
              color="#DB5000"
              style={{ borderColor: "#DB5000", borderWidth: 1, flex: 2 }}
            />
          </DialogActions>
        </View>
      </Dialog>
    </>
  );
}
