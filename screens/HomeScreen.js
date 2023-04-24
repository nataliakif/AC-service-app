import * as React from "react";
import { View, Text } from "react-native";
import SearchBar from "../components/SearchBar";
import WorkList from "../components/WorkList";
import RegistrationScreen from "./RegistrationScreen";
import LoginScreen from "./LoginScreen";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <SearchBar></SearchBar>
      <RegistrationScreen></RegistrationScreen>
      <LoginScreen></LoginScreen>
      <WorkList></WorkList>
    </View>
  );
}
