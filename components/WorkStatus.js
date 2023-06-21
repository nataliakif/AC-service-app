import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkStatus = ({ workStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFC107"; // Цвет для статуса "pending"
      case "inProgress":
        return "#77eb34"; // Цвет для статуса "inProgress"
      case "delete":
        return "#eb4334"; // Цвет для статуса "delete"
      default:
        return "#000000"; // Цвет по умолчанию
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Зборка/Разборка</Text>

        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(workStatus.assemblingStatus) },
          ]}
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Снятие/Установка</Text>

        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(workStatus.mountingStatus) },
          ]}
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Ремонт/Рихтовка</Text>

        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(workStatus.repairStatus) },
          ]}
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Покраска</Text>

        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(workStatus.paintStatus) },
          ]}
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Полировка</Text>

        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(workStatus.polishingStatus) },
          ]}
        />
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Заказ деталей</Text>

        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: getStatusColor(workStatus.orderNewDetailStatus),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 20,
    fontSize: 20,
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  work: {
    flex: 1,
    marginRight: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default WorkStatus;
