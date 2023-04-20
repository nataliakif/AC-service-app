import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RegistrationForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const checkPasswordsMatch = (password, confirmPassword) => {
    if (password === confirmPassword) {
      return true;
    } else {
      return false;
    }
  };
  const handleRegistration = () => {
    // логика
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <View>
          <TextInput
            style={[styles.input]}
            secureTextEntry={!showPassword}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleShowPassword}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            style={[styles.input]}
            secureTextEntry={!showConfirmPassword}
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={toggleShowConfirmPassword}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpasity={0.7}
          style={styles.button}
          onPress={handleRegistration}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingLeft: 16,
    fontWeight: 500,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
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
    fontWeight: "bold",
    flexDirection: "row",
  },
  iconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});
