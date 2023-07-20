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
import Chat from "./Chat";

const WorkList = ({ data, isLoading, selectedZone }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
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
          {name === "Сервис" && (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={34}
              color="#DB5000"
              style={{ position: "absolute", top: 5, right: 10 }}
              onPress={() => {
                setChatVisible(true);
                setModalVisible(false);
              }}
            />
          )}
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
      <View style={styles.modalContainer}>
        {chatVisible && (
          <Modal
            style={styles.modal}
            visible={chatVisible}
            onRequestClose={() => setChatVisible(false)}
            animationType="slide"
          >
            <View style={styles.chatContainer}>
              <View style={styles.headerContainer}>
                <AntDesign
                  name="arrowleft"
                  size={34}
                  color="#DB5000"
                  onPress={() => setChatVisible(false)}
                />

                <Text style={styles.chatTitle}>
                  {selectedItem.carInfo.model}
                </Text>
                <Image
                  source={{ uri: selectedItem.carInfo.photoURL }}
                  style={styles.carChatImage}
                />
              </View>

              <Chat chatId={selectedItem.key} visible={chatVisible}></Chat>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
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
    flex: 1,
    margin: 0,
    backgroundColor: "#fff",
    paddingVertical: 50,
    paddingHorizontal: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    flex: 1,
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    borderTopWidth: 1,
    borderBottomWidth: 2,
    borderBottomColor: "#DB5000",
    borderRadius: 20,
    borderRadius: 20,
    // Другие стили верхней части контейнера
  },
  carChatImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    marginRight: 10,
    borderRadius: 50,
    // Другие стили фото машины
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: "bold",
    // Другие стили названия чата
  },
});

export default WorkList;
