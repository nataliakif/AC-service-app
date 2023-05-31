import { useState } from "react";
import { StyleSheet, View, Image, Text, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import ListItem from "../components/ListItem";

const WorkList = ({ data, isLoading, selectedZone }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleItemPress = (item) => {
    setSelectedItem(item);

    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {data &&
            data.map(({ key, carInfo, status, partsToRepair }) => {
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() =>
                    handleItemPress({ key, carInfo, status, partsToRepair })
                  }
                  style={styles.carItem}
                >
                  <Image
                    source={{ uri: carInfo.photoURL }}
                    defaultSource={require("../images/plugPhoto.jpeg")}
                    style={styles.carImage}
                  />
                  <View style={styles.carDetails}>
                    <View style={styles.modelWrapper}>
                      <FontAwesome
                        name="circle"
                        size={20}
                        color={
                          status === "pending"
                            ? "#34a8eb"
                            : status === "inProgress"
                            ? "#77eb34"
                            : "#eb4334"
                        }
                      />
                      <Text style={styles.carModel}>{carInfo?.model}</Text>
                    </View>
                    <Text style={styles.carInfo}>{carInfo?.number}</Text>
                    <Text style={styles.carInfo}>{carInfo?.owner}</Text>
                    <Text style={styles.carInfo}>
                      Принята: {carInfo?.startDate}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      )}
      <Modal
        style={styles.modal}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <AntDesign
          name="arrowleft"
          size={34}
          color="#DB5000"
          onPress={() => {
            setModalVisible(false);
          }}
        />

        {selectedItem && (
          <ListItem
            data={selectedItem}
            setModalVisible={setModalVisible}
            selectedZone={selectedZone}
          ></ListItem>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  carItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  carDetails: {
    marginLeft: 12,
  },
  modelWrapper: {
    flexDirection: "row",
  },
  carImage: {
    width: 150,
    height: 100,
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
  modal: {
    margin: 0,
    backgroundColor: "#fff",
    paddingVertical: 50,
    paddingHorizontal: 15,
  },
});

export default WorkList;
