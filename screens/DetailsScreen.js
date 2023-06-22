import React, { useContext, useState, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import { checkCurrentUserAdmin } from "../components/functions";
import CreateUser from "../components/CreateUser";

import Header from "../components/Header";

export default function DetailsScreen() {
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    checkCurrentUserAdmin()
      .then((isAdmin) => {
        setEditable(isAdmin);
      })
      .catch((error) => {
        console.error("Error fetching user admin status:", error);
      });
  }, []);

  return (
    <>
      <Header></Header>
      <View style={styles.container}>{editable && <CreateUser />}</View>
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
