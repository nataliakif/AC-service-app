import React, { useEffect, useState, useContext } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import { AuthUserContext } from "../AuthContext";
import { Avatar } from "react-native-paper";
import { ActivityIndicator } from "react-native";
import {
  View,
  Modal,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";

import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { database } from "../config/firebase";
import { uploadImage } from "./functions";

export default function Chat({ chatId }) {
  const [messages, setMessages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImageURL, setModalImageURL] = useState("");
  const [loading, setLoading] = useState(false);
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
          const { _id, text, createdAt, user, image } = doc.data();
          return {
            _id,
            text,
            image,
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

  const handleOpenModal = (imageURL) => {
    setModalImageURL(imageURL);
    setModalVisible(true);
  };

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
        const selectedImage = result.assets[0]; // Получите доступ к выбранному ресурсу через 'assets'

        const { uri } = selectedImage; // Доступ к URI изображения
        setLoading(true);
        const url = await uploadImage(uri, "chats");

        onSend(
          (newMessages = [
            {
              _id: String(Date.now()),
              image: url,
              text: "",
              createdAt: new Date(),
              user: {
                _id: userId,
              },
            },
          ])
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Error choosing photo:", error);
    }
  };

  const handleDownloadPhoto = async (imageUri) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission denied");
        return;
      }
      setLoading(true);
      const fileUri = FileSystem.cacheDirectory + "photo.jpg";
      await FileSystem.downloadAsync(imageUri, fileUri);
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", [asset], false);
      Alert.alert("Фото успешно загружено");
      setLoading(false);
    } catch (error) {
      console.error("Ошибка скачивания фотографии:", error);
    }
  };

  const onSend = (newMessages = []) => {
    const { _id, text, createdAt, user, image } = newMessages[0];

    const message = {
      _id,
      text: text,
      image: image || "",
      createdAt: createdAt || new Date(),
      user: {
        _id: userId,
        name: userName,
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

    return (
      <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>
          {currentMessage.user._id === userId ? "Вы" : currentMessage.user.name}
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
              right: { backgroundColor: "rgba(255, 174, 37, 1)" },
            }}
          />
        )}
        renderMessageImage={(props) => (
          <TouchableOpacity
            onPress={() => handleOpenModal(props.currentMessage.image)}
          >
            {/* {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : ( */}
            <Image
              source={{ uri: props.currentMessage.image }}
              style={{ width: 150, height: 100 }} // Укажите размер миниатюры изображения
              resizeMode="cover"
            />
            {/* )} */}
          </TouchableOpacity>
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
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
          onPress={() => setModalVisible(false)}
        >
          {!loading ? ( // Проверяем состояние загрузки, если true, отображаем Loader
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <Image
                source={{ uri: modalImageURL }}
                style={{ width: 300, height: 400 }}
                // resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownloadPhoto(modalImageURL)}
              >
                <FontAwesome name="download" size={24} color="#DB5000" />
              </TouchableOpacity>
            </>
          )}
        </TouchableOpacity>
      </Modal>
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
  downloadButton: { marginTop: 20 },
  usernameText: { color: "red" },
});
