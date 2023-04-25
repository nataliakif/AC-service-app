import * as React from "react";
import { View, Text } from "react-native";
import SearchBar from "../components/SearchBar";
import WorkList from "../components/WorkList";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        marginTop: 80,
      }}
    >
      <SearchBar></SearchBar>

      <WorkList></WorkList>
    </View>
  );
}
