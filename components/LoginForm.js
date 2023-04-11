import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = () => {
    // логика
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
      />
      <View>
        <TextInput
          style={[styles.input]}
          secureTextEntry={!showPassword}
          placeholder="Password"
          value={password}
          secureTextEntry
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.link}>Forgot your Password?</Text>
      </TouchableOpacity>
    </View>
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
    fontWeight: "500",
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
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
  link: {
    fontWeight: 600,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 20,
    marginTop: 10,
    color: "#DB5000",
  },
  iconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});
