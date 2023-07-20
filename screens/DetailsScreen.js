import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { checkCurrentUserAdmin } from "../components/functions";
import CreateUser from "../components/CreateUser";
import Chat from "../components/Chat";
import Header from "../components/Header";
import ChatList from "../components/ChatList";

export default function DetailsScreen() {
  const [editable, setEditable] = useState(true);

  useEffect(() => {
    checkCurrentUserAdmin()
      .then((isAdmin) => {
        setEditable(isAdmin);
        console.log(editable);
      })
      .catch((error) => {
        console.error("Error fetching user admin status:", error);
      });
  }, []);

  return (
    <>
      <Header></Header>
      {/* <ChatList></ChatList> */}
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
