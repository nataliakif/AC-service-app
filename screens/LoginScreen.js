import React, { useState } from "react";
import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import { StyleSheet, View, StatusBar } from "react-native";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <>
          <Header title="Log In" />
          <LoginForm />
        </>
      ) : (
        <View>{/* Разметка для другого состояния */}</View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 0,
    backgroundColor: "#fff",
  },
});
