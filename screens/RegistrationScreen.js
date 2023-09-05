import React, { useState } from "react";
import Header from "../components/Header";
import RegistrationForm from "../components/RegistrationForm";
import { StyleSheet, View, StatusBar } from "react-native";

export default function RegistrationScreen() {
  return (
    <View style={styles.container}>
      <>
        <Header title="Регистрация" subtitle="Вход" name="Логин" />
        <RegistrationForm />
      </>

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
