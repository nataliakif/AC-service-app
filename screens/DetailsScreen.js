import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import CreateUser from "../components/CreateUser";
import Header from "../components/Header";

export default function DetailsScreen() {
  return (
    <>
      <Header></Header>

      <View style={styles.container}>
        <CreateUser />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 15,
    flexDirection: "column",
  },
});
