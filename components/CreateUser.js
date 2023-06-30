import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Formik } from "formik";
import { RadioButton } from "react-native-paper";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { doc, setDoc } from "@firebase/firestore";
import { auth, database } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function CreateUser() {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleCreateUser = async ({ email, selectedRole }) => {
    try {
      // Создание нового пользователя в Firebase Authentication
      const password = uuidv4();
      await createUserWithEmailAndPassword(auth, email, password);

      // Сохранение дополнительных полей в профиле пользователя
      const userRef = doc(database, "users", email);

      // Создание документа пользователя с дополнительными полями
      await setDoc(userRef, {
        role: selectedRole,
      });

      Alert.alert("Пользователь создан успешно");
      // Отправка письма с приглашением на указанный адрес электронной почты

      const response = await axios.post(
        "https://api.sendgrid.com/v3/mail/send",
        {
          personalizations: [
            {
              to: [{ email: email }],
              subject: "Приглашение для скачивания приложения",
            },
          ],
          from: { email: "nataliakif@gmail.com" },
          content: [
            {
              type: "text/plain",
              value: `Вы были приглашены для скачивания приложения. Логин: ${email}, Пароль: ${password}.`,
            },
          ],
        },
        {
          headers: {
            Authorization:
              "Bearer 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",
          },
        }
      );
      console.log(response);
      if (response.status === 202) {
        Alert.alert("Успех", "Пользователь создан, и приглашение отправлено");
      } else {
        Alert.alert("Ошибка", "Не удалось отправить письмо");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось создать пользователя");
      console.error("Error creating user:", error);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", selectedRole: "Сотрудник" }}
      onSubmit={(values, { resetForm }) => {
        handleCreateUser(values);
        resetForm();
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values }) => (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View>
            <Text style={styles.title}>Cоздать нового пользователя</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Email"
            />

            <View style={styles.radioContainer}>
              <View style={styles.radioButtons}>
                <View style={styles.radioButton}>
                  <RadioButton
                    value="Админ"
                    status={
                      values.selectedRole === "Админ" ? "checked" : "unchecked"
                    }
                    onPress={() => handleChange("selectedRole")("Админ")}
                    color="#DB5000"
                  />
                  <Text>Админ</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton
                    value="Сотрудник"
                    status={
                      values.selectedRole === "Сотрудник"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handleChange("selectedRole")("Сотрудник")}
                    color="#DB5000"
                  />
                  <Text>Сотрудник</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Создать пользователя</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingLeft: 16,
    fontWeight: "500",
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  inputFocused: {
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  error: {
    color: "red",
  },
  button: {
    marginTop: 40,
    marginHorizontal: 30,
    height: 60,
    paddingHorizontal: 60,
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
  iconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  radioContainer: {
    marginBottom: 16,
  },
  radioButtons: {
    flexDirection: "row",
    marginTop: 8,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
});
