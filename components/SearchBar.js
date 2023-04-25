import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const SearchBar = ({}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (text) => {
    setSearchTerm(text);
  };

  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Поиск"
        placeholderTextColor="gray"
        value={searchTerm}
        onChangeText={handleSearchTermChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderRadius: "50%",
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
});

export default SearchBar;
