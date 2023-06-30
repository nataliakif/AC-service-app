import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { checkCurrentUserAdmin } from "./functions";
import { FontAwesome, AntDesign, Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import ListItem from "../components/ListItem";
import { useNavigation, useRoute } from "@react-navigation/native";
const WorkList = ({ data, isLoading, selectedZone }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editable, setEditable] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { name } = route;

  const handleItemPress = (item) => {
    setSelectedItem(item);

    setModalVisible(true);
  };

  useEffect(() => {
    checkCurrentUserAdmin()
      .then((isAdmin) => {
        setEditable(isAdmin);
      })
      .catch((error) => {
        console.error("Error fetching user admin status:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {data &&
            data.map(({ key, carInfo, status, partsToRepair, workStatus }) => {
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => {
                    if (name === "Архив") {
                      navigation.navigate("Просчет", {
                        key,
                        status,
                        carInfo,
                        partsToRepair,
                        workStatus,
                      });
                    } else {
                      handleItemPress({
                        key,
                        carInfo,
                        status,
                        partsToRepair,
                        workStatus,
                      });
                    }
                  }}
                  style={styles.carItem}
                >
                  <Image
                    source={
                      carInfo.photoURL
                        ? { uri: carInfo.photoURL }
                        : require("../images/plugPhoto.jpeg")
                    }
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
        data={selectedItem}
        style={styles.modal}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View>
          <AntDesign
            name="arrowleft"
            size={34}
            color="#DB5000"
            onPress={() => {
              setModalVisible(false);
            }}
          />
          {editable && name === "В работе" && (
            <Ionicons
              name="brush"
              size={24}
              color="#DB5000"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Просчет", {
                  key: selectedItem.key,
                  status: selectedItem.status,
                  carInfo: selectedItem.carInfo,
                  partsToRepair: selectedItem.partsToRepair,
                  workStatus: selectedItem.workStatus,
                });
              }}
              style={{ position: "absolute", top: 10, right: 10 }}
            />
          )}
        </View>

        {selectedItem && (
          <ListItem
            data={selectedItem}
            setModalVisible={setModalVisible}
            selectedZone={selectedZone}
            editable={editable}
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
