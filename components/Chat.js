import React, { useEffect, useState, useContext } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { TouchableOpacity, Text } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "./functions";
import { FontAwesome } from "@expo/vector-icons";
import { AuthUserContext } from "../AuthContext";
import { Avatar } from "react-native-paper";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { database } from "../config/firebase";
import { StyleSheet, View } from "react-native";

export default function Chat({ chatId }) {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(AuthUserContext);
  const userId = user ? user.uid : null;
  const userName = user ? user.displayName : "Неизвестный";
  const userAvatar = user ? user.photoURL : null;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(database, "chats", chatId, "messages"), // Путь к коллекции "chats" и документу с идентификатором chatId, затем коллекция "messages"
        orderBy("createdAt", "desc")
      ),
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
  }, [chatId]);

  const handleChoosePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        console.error("Permission denied");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaType: "photo",
        quality: 1,
      });

      if (!result.canceled) {
        // Используйте 'canceled' вместо 'cancelled'
        const selectedImage = result.assets[0]; // Получите доступ к выбранному ресурсу через 'assets'

        const { uri } = selectedImage; // Доступ к URI изображения
        const url = await uploadImage(uri, "chats");

        sendPhotoMessage(url);
      }
    } catch (error) {
      console.error("Error choosing photo:", error);
    }
  };

  const sendPhotoMessage = (photo) => {
    const message = {
      _id: String(Date.now()),
      image: photo,
      createdAt: new Date(),
      user: {
        _id: userId,
        name: user.displayName,
      },
    };

    try {
      addDoc(collection(database, "chats", chatId, "messages"), message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onSend = (newMessages = []) => {
    const { _id, text, createdAt, user } = newMessages[0];

    const message = {
      _id,
      text,
      createdAt: createdAt || new Date(),
      user: {
        _id: userId,
      },
    };

    try {
      addDoc(collection(database, "chats", chatId, "messages"), message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderAvatar = (props) => {
    return (
      <View>
        {userAvatar ? (
          <Avatar.Image size={60} source={{ uri: userAvatar }} />
        ) : (
          <Avatar.Text
            size={60}
            label={user.email ? user.email[0].toUpperCase() : ""}
            style={{ color: "#fff" }}
          />
        )}
      </View>
    );
  };
  const renderUsername = (props) => {
    const { currentMessage } = props;
    console.log(props);
    return (
      <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>
          {currentMessage.user._id === userId ? "Вы" : userName}
        </Text>
      </View>
    );
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
        renderUsername={renderUsername}
        renderAvatar={renderAvatar}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: { backgroundColor: "F5F5F5" },
              right: {
                backgroundColor: " rgba(255, 174, 37, 1)",
              },
            }}
          />
        )}
        renderActions={() => (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleChoosePhoto}
          >
            <FontAwesome name="photo" size={24} color="#000" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  iconButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  usernameText: { color: "red" },
});
