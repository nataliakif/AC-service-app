import React, { useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { TouchableOpacity, Text } from "react-native-gesture-handler";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { database, auth } from "../config/firebase";
import { StyleSheet, View } from "react-native";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const currentUser = auth.currentUser;
  const userId = currentUser ? currentUser.uid : null;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(database, "chats"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => {
          const { _id, text, createdAt, user } = doc.data();
          return {
            _id,
            text,
            createdAt: createdAt.toDate(),
            user,
          };
        });
        setMessages(newMessages);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const onSend = async (newMessages = []) => {
    const { _id, text, createdAt, user } = newMessages[0];
    const message = {
      _id,
      text,
      createdAt: createdAt || new Date(),
      user,
    };

    try {
      await addDoc(collection(database, "chats"), message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: userId,
        }}
        messagesContainerStyle={styles.container}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
