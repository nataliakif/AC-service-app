import React from "react";
import ChatList from "../components/ChatList";
import Header from "../components/Header";
import { View, StyleSheet } from "react-native";

export default function ChatsScreen() {
  return (
    <>
      <Header></Header>
      <ChatList></ChatList>
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
