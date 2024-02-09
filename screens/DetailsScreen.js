import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import CreateUser from "../components/CreateUser";
import Header from "../components/Header";
import PriceEditor from "../components/PriceEditor";

export default function DetailsScreen() {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showPriceEditor, setShowPriceEditor] = useState(false);

  const handleCreateUserClick = () => {
    setShowCreateUser(!showCreateUser);
    setShowPriceEditor(false);
  };

  const handlePriceEditorClick = () => {
    setShowPriceEditor(!showPriceEditor);
    setShowCreateUser(false);
  };

  return (
    <>
      <Header />

      <View style={styles.container}>
        <TouchableOpacity style={styles.link} onPress={handleCreateUserClick}>
          <Text style={styles.linkText}>Права доступа</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkB} onPress={handlePriceEditorClick}>
          <Text style={styles.linkText}>Изменить прайс лист</Text>
        </TouchableOpacity>
        {showCreateUser && (
          <CreateUser onClose={() => setShowCreateUser(false)} />
        )}
        {showPriceEditor && (
          <PriceEditor onClose={() => setShowPriceEditor(false)} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    paddingHorizontal: 15,
    flexDirection: "column",
  },
  link: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  linkB: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 30,
  },
  linkText: {
    fontSize: 18,
    color: "#000",
  },
});
