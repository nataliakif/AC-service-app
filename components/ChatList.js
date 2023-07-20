import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../config/firebase";

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Получение данных о чатах из Firebase Firestore
    const getChatIds = async () => {
      try {
        // Получаем ссылку на коллекцию "chats"
        const chatsRef = collection(database, "chats");

        // Выполняем запрос на получение всех документов в коллекции "chats"
        const querySnapshot = await getDocs(chatsRef);

        // Обрабатываем полученные данные и извлекаем chatId каждого документа
        const chatIds = querySnapshot.docs.map((doc) => doc);
        console.log(chatIds); // Здесь выведется массив с chatId всех документов в коллекции "chats"
        return chatIds;
      } catch (error) {
        console.error("Error getting chatIds:", error);
        return [];
      }
    };
    getChatIds();
  }, []);

  const handleOpenChat = (chatId) => {
    // Здесь можно добавить навигацию к компоненту чата с использованием React Navigation
    // Например, navigation.navigate('Chat', { chatId });
    console.log(`Opening chat with ID: ${chatId}`);
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleOpenChat(item.id)}
    >
      <Text style={styles.chatTitle}>{item.title}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "#888",
  },
});

export default ChatList;
