import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const StatusDropdown = ({ value, onChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(value);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    onChange(value);
  };

  return (
    <View style={styles.inputContainer}>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={handleStatusChange}
        style={styles.input}
      >
        <Picker.Item label="В ожидании" value="pending" />
        <Picker.Item label="Взять в работу" value="inProgress" />
        <Picker.Item label="Удалить" value="delete" />
      </Picker>
      {selectedStatus === "pending" && (
        <View style={[styles.statusIndicator, styles.pendingIndicator]} />
      )}
      {selectedStatus === "inProgress" && (
        <View style={[styles.statusIndicator, styles.inProgressIndicator]} />
      )}
      {selectedStatus === "delete" && (
        <View style={[styles.statusIndicator, styles.deleteIndicator]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: { height: 160 },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    left: 20,
    top: 100,
  },
  inProgressIndicator: {
    backgroundColor: "#77eb34",
  },
  pendingIndicator: {
    backgroundColor: "yellow",
  },
  deleteIndicator: {
    backgroundColor: "#eb4334",
  },
});

export default StatusDropdown;
