import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { database } from "../config/firebase";

const ChatList = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // Добавляем состояние loading

  useEffect(() => {
    const getChatIds = async () => {
      try {
        const chatsRef = collection(database, "chats");
        const querySnapshot = await getDocs(chatsRef);
        console.log(querySnapshot.docs);

        // Обновляем состояние "chats" данными о чатах
        setChats();

        // Устанавливаем loading в значение false, так как данные успешно получены
        setLoading(false);
      } catch (error) {
        console.error("Error getting chatIds:", error);
        setChats([1, 2, 3]); // Если произошла ошибка, устанавливаем пустой массив чатов
        setLoading(false); // Устанавливаем loading в значение false
      }
    };

    // Вызываем функцию getChatIds() один раз при загрузке компонента
    getChatIds();
  }, []);
  if (loading) {
    // Показываем индикатор загрузки, пока данные еще загружаются
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleOpenChat = (chatId) => {
    // Например, navigation.navigate('Chat', { chatId });
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
