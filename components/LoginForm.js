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
  Modal,
} from "react-native";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { auth } from "../config/firebase";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Введите правильный email")
    .required("Введите email"),
  password: Yup.string().required("Пароль обязателен"),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleLoginForm = ({ email, password }) => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("login success");
        })
        .catch((err) => {
          Alert.alert("Login Error", err.message);
        });
    }
  };

  const resetPassword = async () => {
    if (isEmailModalVisible) {
      setIsEmailModalVisible(false);
      if (resetEmail === "") {
        Alert.alert("Введите email");
      } else {
        try {
          await sendPasswordResetEmail(auth, resetEmail);
          Alert.alert("Ссылка для смены пароля отправлена на указанную почту");
          console.log("Email sent successfully");
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    } else {
      setIsEmailModalVisible(true);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={(values) => handleLoginForm(values)}
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

              <TouchableOpacity onPress={resetPassword}>
                <Text style={styles.link}>Забыли пароль?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.button}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Логин</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>

      <Modal visible={isEmailModalVisible}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.emailInput}
            onChangeText={(text) => setResetEmail(text)}
            value={resetEmail}
            placeholder="Email"
          />
          <TouchableOpacity style={styles.modalButton} onPress={resetPassword}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  login: { marginTop: 100 },
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
    color: "red",
  },
  link: { color: "#007AFF", textAlign: "center", marginTop: 15 },
  button: {
    marginTop: 40,
    height: 60,
    paddingHorizontal: 140,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emailInput: {
    height: 52,
    borderWidth: 1,
    paddingLeft: 16,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: 200,
  },
  modalButton: {
    backgroundColor: "#DB5000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginForm;
