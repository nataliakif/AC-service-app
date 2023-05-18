import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../config/firebase";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import SearchBar from "../components/SearchBar";
import WorkList from "../components/WorkList";

export default function SavedCalculationsScreen() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleSearchChange = (search) => {
    setSearch(search);
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  useEffect(() => {
    const dataRef = ref(database, "calcs/");

    onValue(dataRef, (snapshot) => {
      const calcs = snapshot.val();
      const inProgressCalcs = Object.values(calcs).filter(
        (calc) => calc.status === "pending"
      );
      setData(inProgressCalcs);
      setIsLoading(false);
    });
  }, []);

  const filteredData =
    data &&
    Object.keys(data)
      .filter((key) =>
        data[key].carInfo.model.toLowerCase().includes(search.toLowerCase())
      )
      .map((key) => ({ key, ...data[key] }));

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          paddingHorizontal: 20,
          marginTop: 80,
        }}
      >
        <SearchBar onSearchChange={handleSearchChange}></SearchBar>

        <WorkList data={filteredData} isLoading={isLoading}></WorkList>
      </View>
    </TouchableWithoutFeedback>
  );
}
