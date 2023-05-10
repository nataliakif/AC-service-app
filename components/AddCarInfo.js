import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Formik } from "formik";
import ImagePickerForm from "./ImagePickerForm";
import { TextInputMask } from "react-native-masked-text";
import DatePicker from "react-native-datepicker";

const AddCarScreen = () => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={{
          model: "",
          color: "",
          number: "",
          owner: "",
          phone: "",
          startDate: new Date(),
          description: "",
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View>
              <ImagePickerForm value={values.photo}></ImagePickerForm>
              <View style={styles.inputContainer}>
                <Text style={styles.title}>Основные данные</Text>
                <Text style={styles.label}>Марка машины:</Text>
                <TextInput
                  style={styles.input}
                  value={values.model}
                  placeholder="Введите марку"
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

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Дата приема:</Text>
                <DatePicker
                  style={styles.datePicker}
                  value={values.startDate}
                  disabled="true"
                  format="DD-MM-YYYY"
                  //   mode="date"
                  //   confirmBtnText="Подтвердить"
                  //   cancelBtnText="Отменить"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Допонительная информация:</Text>
                <TextInput
                  style={{ ...styles.input, ...styles.description }}
                  value={values.description}
                  onChangeText={handleChange("description")}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.button}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Подтвердить</Text>
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
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 30,
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
});

export default AddCarScreen;
