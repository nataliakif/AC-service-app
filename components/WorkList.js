import React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const WorkList = ({ data, isLoading }) => {
  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : data ? (
        data.map(({ id, photo, model, owner, number, status, startDate }) => (
          <View key={id} style={styles.carItem}>
            <Image source={{ uri: photo }} style={styles.carImage} />
            <View style={styles.carDetails}>
              <View style={styles.modelWrapper}>
                <FontAwesome
                  name="circle"
                  size={20}
                  color={
                    status === "принят"
                      ? "#34a8eb"
                      : status === "в работе"
                      ? "#77eb34"
                      : "#eb4334"
                  }
                />
                <Text style={styles.carModel}>{model}</Text>
              </View>
              <Text style={styles.carInfo}>{number}</Text>
              <Text style={styles.carInfo}>{owner}</Text>
              <Text style={styles.carInfo}>Принята: {startDate}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text>No data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  carItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    // backgroundColor: "#f5f5f5",
    marginBottom: 24,
  },
  carImage: {
    width: 150,
    height: 100,
  },

  carDetails: {
    flex: 1,
    marginLeft: 12,
  },
  modelWrapper: {
    flexDirection: "row",
  },
  carModel: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 5,
    marginLeft: 5,
  },
  carInfo: {
    fontSize: 16,
    color: "#343434",
    fontWeight: "400",
    lineHeight: 20,
    marginBottom: 5,
  },
  carStatus: {
    width: 5,
    height: 5,
    borderRadius: 20,
  },
});

export default WorkList;
