import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "@firebase/firestore";
import { auth, database } from "../config/firebase";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Введите правильный email")
    .required("Введите email"),
  password: Yup.string()
    .min(6, "Пароль должен содержать не менее 6 символов")
    .required("Пароль обязателен"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Пароли должны совпадать")
    .required("Подтвердите пароль"),
});

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleRegistrationForm = async ({ email, password }) => {
    if (email !== "" && password !== "") {
      try {
        // Создание нового пользователя в Firebase Authentication
        await createUserWithEmailAndPassword(auth, email, password);

        const userRef = doc(database, "users", email);

        // Создание документа пользователя с дополнительными полями
        await setDoc(userRef, {
          role: "Сотрудник",
        });

        Alert.alert("Успех", "Пользователь успешно зарегистрирован:");
        navigation.navigate("Логин"); // предполагается, что ваш экран для входа называется 'Login'
      } catch (error) {
        Alert.alert("Ошибка", "Не удалось создать пользователя", error);
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegistrationSchema}
        onSubmit={(values) => handleRegistrationForm(values)}
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
            <View style={styles.login}>
              <TextInput
                style={styles.input}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="Email"
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <View>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder="Пароль"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}
              <View>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  value={values.confirmPassword}
                  placeholder="Подтвердите пароль"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.button}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Зарегистрироваться</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  login: {
    marginTop: 100,
    flex: 1,
    flexDirection: "column",
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingLeft: 16,
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
    /*     shadowOffset: {
      width: 0,
      height: 2,
    }, */
  },
  error: {
    alignSelf: "center",
    color: "red",
  },
  link: { color: "#007AFF", textAlign: "center", marginTop: 15 },
  button: {
    marginTop: 40,
    height: 60,
    paddingHorizontal: 100,
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
});

export default RegistrationForm;
