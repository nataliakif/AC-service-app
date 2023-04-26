import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import SearchBar from "../components/SearchBar";
import WorkList from "../components/WorkList";

export default function HomeScreen() {
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
    fetch("https://6436945c3e4d2b4a12d615cc.mockapi.io/cars")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);
  const filteredData =
    data &&
    data.filter((item) =>
      item.model.toLowerCase().includes(search.toLowerCase())
    );
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
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
