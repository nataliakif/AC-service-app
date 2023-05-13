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
import { signInWithEmailAndPassword } from "@firebase/auth";
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

  return (
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
          <View>
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

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.button}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  error: {
    color: "red",
  },

  button: {
    marginTop: 110,
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
});

export default LoginForm;
