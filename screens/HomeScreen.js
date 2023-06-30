import React, { useState, useEffect } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ref, onValue } from "firebase/database";
import { db } from "../config/firebase";
import SearchBar from "../components/SearchBar";
import WorkList from "../components/WorkList";
import Header from "../components/Header";

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
    const dataRef = ref(db, "calcs/");

    onValue(dataRef, (snapshot) => {
      const calcs = snapshot.val();
      setData(calcs);
      setIsLoading(false);
    });
  }, []);

  const filteredData =
    data &&
    Object.keys(data)
      .filter((key) =>
        data[key].carInfo.model.toLowerCase().includes(search.toLowerCase())
      )
      .filter((key) => data[key].status === "inProgress")

      .map((key) => ({ key, ...data[key] }));
  return (
    <>
      <Header></Header>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            justifyContent: "center",
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <SearchBar onSearchChange={handleSearchChange}></SearchBar>

          <WorkList data={filteredData} isLoading={isLoading}></WorkList>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
}
