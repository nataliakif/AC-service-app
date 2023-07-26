import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkStatus = ({ workStatus }) => {
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return (
          <>
            <Text style={{ color: "#ffc100", fontWeight: "500" }}>
              В ожидании
            </Text>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: "#ffc100",
                },
              ]}
            />
          </>
        );
      case "inProgress":
        return (
          <>
            <Text style={{ color: "#eb4334", fontWeight: "500" }}>
              В работе
            </Text>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: "#eb4334",
                },
              ]}
            />
          </>
        );
      case "finished":
        return (
          <>
            <Text style={{ color: "#2db83d", fontWeight: "500" }}>
              Завершен
            </Text>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: "#2db83d",
                },
              ]}
            />
          </>
        );
      case "delete":
        return (
          <>
            <Text style={{ color: "#808080", fontWeight: "500" }}>
              Удален из списка
            </Text>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: "#808080",
                },
              ]}
            />
          </>
        );
      default:
        return ""; // Цвет по умолчанию
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Зборка/Разборка</Text>
        {getStatusText(workStatus.assemblingStatus)}
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Снятие/Установка</Text>
        {getStatusText(workStatus.mountingStatus)}
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Ремонт/Рихтовка</Text>
        {getStatusText(workStatus.repairStatus)}
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Покраска</Text>
        {getStatusText(workStatus.paintStatus)}
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Полировка</Text>
        {getStatusText(workStatus.polishingStatus)}
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.work}>Заказ деталей</Text>
        {getStatusText(workStatus.orderNewDetailStatus)}
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
    marginLeft: 10,
  },
});

export default WorkStatus;
