import { ref, update, remove } from "firebase/database";
import { db } from "../config/firebase";
import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Gear from "../assets/gear.svg";
import { Formik } from "formik";
import { TextInputMask } from "react-native-masked-text";
import StatusDropdown from "./StatusDropdown";
import { useNavigation, useRoute } from "@react-navigation/native";

const ListItem = ({ data, setModalVisible, selectedZone }) => {
  const { carInfo, status, key, partsToRepair, workStatus } = data;
  const navigation = useNavigation();
  const route = useRoute();
  const { name } = route;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function updateInfo(values) {
    if (values.status === "inProgress") {
      // Создание нового объекта с информацией о машине
      const updatedCarInfo = {
        color: values.color,
        description: values.description,
        model: values.model,
        number: values.number,
        owner: values.owner,
        phone: values.phone,
        vinCode: values.vinCode,
        startDate: values.startDate,
        photoURL: values.photoURL,
      };
      console.log(selectedZone);
      console.log(values.workStatus);
      // Создание нового объекта с информацией о статусе работы
      const workStatus = {
        assemblingStatus:
          selectedZone === "Assembling" ? values.workStatus : "pending",
        mountingStatus:
          selectedZone === "Mounting" ? values.workStatus : "pending",
        paintStatus: selectedZone === "Paint" ? values.workStatus : "pending",
        polishingStatus:
          selectedZone === "Polishing" ? values.workStatus : "pending",
        repairStatus: selectedZone === "Repair" ? values.workStatus : "pending",
        orderNewDetailStatus:
          selectedZone === "orderNewDetail" ? values.workStatus : "pending",
      };

      // Обновление информации о машине и статусе работы
      update(ref(db, "calcs/" + key), {
        carInfo: updatedCarInfo,
        partsToRepair: partsToRepair,
        workStatus: workStatus,
        status: values.status,
      })
        .then(() => {
          console.log("Object updated");
          navigation.navigate("В работе");
          setModalVisible(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (values.status === "delete") {
      // Удаление объекта
      remove(ref(db, "calcs/" + key))
        .then(() => {
          console.log("Object deleted");
          setModalVisible(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (values.status === "pending") {
      update(ref(db, "calcs/" + key), {
        carInfo: {
          color: values.color,
          description: values.description,
          model: values.model,
          number: values.number,
          owner: values.owner,
          phone: values.phone,
          vinCode: values.vinCode,
          startDate: values.startDate,
          photoURL: values.photoURL,
        },
        status: values.status,
      })
        .then(() => {
          console.log("Object updated");
          navigation.navigate("Архив");
          setModalVisible(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Formik
        initialValues={{
          color: carInfo.color || "",
          description: carInfo.description || "",
          model: carInfo.model || "",
          number: carInfo.number || "",
          owner: carInfo.owner || "",
          phone: carInfo.phone || "",
          vinCode: carInfo.vinCode || "",
          startDate: new Date().toLocaleDateString(),
          status: status,
          workStatus: workStatus,
          photoURL: carInfo.photoURL || "",
        }}
        onSubmit={(values) => {
          updateInfo(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, dirty }) => (
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View>
              <Image
                source={{ uri: values.photoURL }}
                defaultSource={require("../images/plugPhoto.jpeg")}
                style={styles.image}
              />
              {name !== "Сервис" && (
                <View style={styles.inputContainer}>
                  <StatusDropdown
                    value={values.status}
                    onChange={handleChange("status")}
                    label="Удалить"
                  />
                </View>
              )}
              <View style={styles.inputContainer}>
                <Text style={styles.title}>Основные данные</Text>
                <Text style={styles.label}>Марка машины:</Text>
                <TextInput
                  style={styles.input}
                  value={values.model}
                  placeholder="Введите марку машины"
                  onChangeText={handleChange("model")}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Цвет:</Text>
                <TextInput
                  style={styles.input}
                  value={values.color}
                  placeholder="Введите цвет"
                  onChangeText={handleChange("color")}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Регистрационный номер:</Text>
                <TextInput
                  style={styles.input}
                  value={values.number}
                  placeholder=""
                  onChangeText={handleChange("number")}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>VIN код:</Text>
                <TextInput
                  style={styles.input}
                  value={values.vinCode}
                  placeholder=""
                  onChangeText={handleChange("vinCode")}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Владелец:</Text>
                <TextInput
                  style={styles.input}
                  value={values.owner}
                  placeholder="Введите ФИО"
                  onChangeText={handleChange("owner")}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Дата приема:</Text>
                <TextInput
                  style={styles.input}
                  value={values.startDate}
                  editable={false} // Запретить редактирование поля ввода
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Контактный номер:</Text>
                <TextInputMask
                  style={styles.input}
                  value={values.phone}
                  placeholder={"(099)999-99-99"}
                  type={"custom"}
                  options={{
                    mask: " (099) 999-99-99",
                  }}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Дополнительная информация:</Text>
                <TextInput
                  style={{ ...styles.input, ...styles.description }}
                  value={values.description}
                  onChangeText={handleChange("description")}
                />
              </View>
              {name === "Сервис" && (
                <View>
                  <Text style={styles.title}>Перечень деталей в работу:</Text>

                  <StatusDropdown
                    value={values.workStatus}
                    onChange={handleChange("workStatus")}
                    label="Завершить"
                  />

                  {Object.keys(partsToRepair).map((key) => {
                    const part = partsToRepair[key];
                    if (key !== "carCategory" && key !== "paintCategory") {
                      return (
                        <View key={key} style={styles.partContainer}>
                          <View style={styles.partNameContainer}>
                            <Gear style={styles.icon} />
                            <Text style={styles.partName}>{part.partName}</Text>
                          </View>
                          <View style={styles.workAmountContainer}>
                            {part.workAmount.assemblingTime > 0 && (
                              <Text style={styles.workAmount}>
                                Снятие/Установка
                              </Text>
                            )}
                            {part.workAmount.mountingTime > 0 && (
                              <Text style={styles.workAmount}>
                                Сборка/Разборка
                              </Text>
                            )}
                            {part.workAmount.repairTime > 0 && (
                              <Text style={styles.workAmount}>
                                Ремонт/Рихтовка
                              </Text>
                            )}
                            {part.workAmount.paintPrice > 0 && (
                              <>
                                <Text style={styles.workAmount}>Покраска</Text>
                                <Text style={styles.workAmount}>Полировка</Text>
                              </>
                            )}
                            {part.workAmount.orderNewDetailPrice > 0 && (
                              <Text style={styles.workAmount}>
                                Заказ новых деталей
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    }
                    return null;
                  })}
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.button, !dirty && styles.disabledButton]} // Add styles based on dirty property
                onPress={handleSubmit}
                disabled={!dirty && !values.status}
              >
                <Text style={styles.buttonText}>Изменить</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 50,
  },
  image: {
    width: 340,
    height: 220,
    backgroundColor: "#BABABA",
    marginHorizontal: 0,
  },
  formWrapper: {
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 29,
    color: "#343434",
    marginTop: 24,
    marginBottom: 36,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  dateTouchBody: {
    height: 30,
    width: 100,
  },
  description: { height: 100 },
  button: {
    marginTop: 36,
    height: 60,
    paddingHorizontal: 130,
    paddingVertical: 20,
    textAlign: "center",
    backgroundColor: "#DB5000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    flexDirection: "row",
  },
  disabledButton: {
    opacity: 0.5,
  },
  partContainer: {
    flexDirection: "column",
  },
  partNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
  },
  partName: {
    fontWeight: "400",
    fontSize: 18,
    marginLeft: 8,
  },
  workAmountContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  workAmount: { color: "#757373", marginBottom: 5 },
});

export default ListItem;
