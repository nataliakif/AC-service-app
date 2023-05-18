import { ref, update } from "firebase/database";
import { database } from "../config/firebase";
import React, { useState } from "react";
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
import { Formik } from "formik";
import { TextInputMask } from "react-native-masked-text";
import StatusDropdown from "./StatusDropdown";
import { useNavigation } from "@react-navigation/native";

const ListItem = ({ data, setModalVisible }) => {
  const { carInfo, status, key } = data;
  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function updateInfo(values) {
    update(ref(database, "calcs/" + key), {
      carInfo: {
        color: values.color,
        description: values.description,
        model: values.model,
        number: values.number,
        owner: values.owner,
        phone: values.phone,
      },
      status: values.status,
    })
      .then(() => {
        console.log("data updated");
        navigation.navigate("В работе");
        setModalVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
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
          startDate: new Date(),
          status: status,
        }}
        onSubmit={(values) => {
          updateInfo(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, dirty }) => (
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View>
              <Image source={{}} style={styles.image} />
              <View style={styles.inputContainer}>
                <StatusDropdown
                  value={values.status}
                  onChange={handleChange("status")}
                />
              </View>
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
                  placeholder="AB0000BA"
                  onChangeText={handleChange("number")}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Ваделец:</Text>
                <TextInput
                  style={styles.input}
                  value={values.owner}
                  placeholder="Введите ФИО"
                  onChangeText={handleChange("owner")}
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
                  handleBlur={handleBlur("phone")}
                />
              </View>

              {/* <View style={styles.inputContainer}>
                <Text style={styles.label}>Дата приема:</Text>
                <DatePicker
                  style={styles.datePicker}
                  value={values.startDate}
                  disabled="true"
                  format="DD-MM-YYYY"
                />
              </View> */}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Допонительная информация:</Text>
                <TextInput
                  style={{ ...styles.input, ...styles.description }}
                  value={values.decription}
                  onChangeText={handleChange("description")}
                />
              </View>
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
});

export default ListItem;
