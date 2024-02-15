import React, { useState, useEffect } from "react";
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
import { doc, setDoc } from "@firebase/firestore";
import { database } from "../config/firebase";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs } from "@firebase/firestore";
import { updateDoc } from "@firebase/firestore";

export default function CreateUser() {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(database, "users");
      const usersSnapshot = await getDocs(usersCollection);
      // Теперь извлекаем не только id, но и данные документа
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Фильтруем пользователей, исключая админов
      const filteredUsers = usersData
        .filter((user) => user.role !== "Админ")
        .map((nonAdminUser) => nonAdminUser.id);
      setUsers(filteredUsers);
    };

    fetchUsers();
  }, []);

  const handleUpdateUserRole = async (email, newRole) => {
    try {
      // Получаем ссылку на документ пользователя в базе данных
      const userRef = doc(database, "users", email);

      // Обновляем роль пользователя
      await updateDoc(userRef, {
        role: newRole,
      });

      Alert.alert("Права доступа пользователя обновлены успешно");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось обновить права доступа пользователя");
      console.error("Error updating user role:", error);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", selectedRole: "Сотрудник" }}
      onSubmit={(values, { resetForm }) => {
        handleUpdateUserRole(values.email, values.selectedRole);
        resetForm();
      }}
    >
      {({ handleChange, handleSubmit, values }) => (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View>
            <Text style={styles.title}>
              Cменить права доступа для пользователя
            </Text>

            <Picker
              selectedValue={values.email}
              onValueChange={handleChange("email")}
            >
              {users.map((email) => (
                <Picker.Item
                  style={styles.pickerItem}
                  key={email}
                  label={email}
                  value={email}
                />
              ))}
            </Picker>

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
              <Text style={styles.buttonText}>Изменить</Text>
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
    marginTop: 60,
  },
  title: {
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DB5000",
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
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
