import React, { useEffect, useState, useContext } from "react";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import { AuthUserContext } from "../AuthContext";
import { Avatar } from "react-native-paper";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "@firebase/firestore";

import ImageZoomViewer from "react-native-image-zoom-viewer";

import { ActivityIndicator } from "react-native";
import {
  View,
  Modal,
  StyleSheet,
  Alert,
  Image,
  Text,
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
  const userEmail = user ? user.email : null;

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
                name: userName || "Аноним",
                avatar: userAvatar,
                email: userEmail,
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
        alert("Для сохранения фото нужно разрешение");
        return;
      }
      setLoading(true);
      // Определяем путь к директории
      const directoryUri = `${FileSystem.documentDirectory}chats/`;

      // Проверяем, существует ли директория
      const directoryInfo = await FileSystem.getInfoAsync(directoryUri);
      if (!directoryInfo.exists) {
        // Если директория не существует, создаем ее
        await FileSystem.makeDirectoryAsync(directoryUri, {
          intermediates: true,
        });
      }

      // Генерируем локальный URI для изображения на основе текущего времени
      const fileName = imageUri.split("/").pop();
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      // Загружаем изображение из сети в локальное хранилище
      const downloadResult = await FileSystem.downloadAsync(imageUri, fileUri);

      // Сохраняем изображение из локального хранилища в альбом на устройстве
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      const album = await MediaLibrary.getAlbumAsync("Скачанные из чата");
      if (album === null) {
        await MediaLibrary.createAlbumAsync("Скачанные из чата", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
      }
      alert("Фото успешно загружено в галерею");
    } catch (error) {
      console.error("Ошибка при сохранении фото:", error);
      alert("Ошибка при сохранении фото");
    } finally {
      setLoading(false);
    }
  };

  const onSend = async (newMessages = []) => {
    const { _id, text, createdAt, user, image } = newMessages[0];

    const message = {
      _id,
      text: text,
      image: image || "",
      createdAt: createdAt || new Date(),

      user: {
        _id: userId,
        name: userName || "Аноним",
        avatar: userAvatar || null,
        email: userEmail,
      },
    };

    try {
      addDoc(collection(database, "chats", chatId, "messages"), message);
      const chatRef = doc(database, "chats", chatId);
      const chatDoc = await getDoc(chatRef);

      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        // Если у чата есть поле participants как массив email'ов
        if (!chatData.participants.includes(userEmail)) {
          // Обновляем документ чата, добавляя email пользователя в массив участников
          await updateDoc(chatRef, {
            participants: arrayUnion(userEmail),
          });
        }
      } else {
        // Если в документе чата нет списка участников, создаем его
        await setDoc(
          chatRef,
          {
            participants: [userEmail],
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const renderBubble = (props) => {
    return (
      <View style={{ maxWidth: "70%", marginVertical: 6 }}>
        {props.position === "left" && (
          <Text
            style={{
              marginBottom: 5,
              marginLeft: 0,
              fontSize: 14,
              color: "#DB5000",
              fontWeight: "500",
            }}
          >
            {props.currentMessage.user.name}
          </Text>
        )}
        <Bubble
          {...props}
          wrapperStyle={{
            left: { backgroundColor: "#F0F0F0" },
            right: { backgroundColor: "rgba(219, 80, 0, 0.7)" },
          }}
        />
      </View>
    );
  };

  const renderAvatar = (props) => {
    // Получаем аватар email отправителя из текущего сообщения
    const messageUserAvatar = props.currentMessage.user.avatar;
    const messageUserEmail = props.currentMessage.user.email;

    return (
      <View>
        {messageUserAvatar ? (
          <Avatar.Image size={60} source={{ uri: messageUserAvatar }} />
        ) : (
          <Avatar.Text
            size={60}
            label={messageUserEmail ? messageUserEmail[0].toUpperCase() : ""}
            style={{ color: "#fff" }}
          />
        )}
      </View>
    );
  };

  const renderUsername = (props) => {
    const { currentMessage } = props;

    // Сравниваем ID отправителя сообщения с ID текущего пользователя
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
          name: userName,
          avatar: userAvatar,
          email: userEmail,
        }}
        messagesContainerStyle={styles.container}
        renderUsername={renderUsername}
        renderAvatar={renderAvatar}
        renderBubble={renderBubble}
        renderMessageImage={(props) => (
          <TouchableOpacity
            onPress={() => handleOpenModal(props.currentMessage.image)}
          >
            {/* {loading ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : ( */}
            <Image
              source={{ uri: props.currentMessage.image }}
              style={{ width: 150, height: 100 }}
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
          activeOpacity={1}
        >
          <Image
            source={{ uri: modalImageURL }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              padding: 10,
              borderRadius: 30,
            }}
            onPress={() => handleDownloadPhoto(modalImageURL)}
          >
            <FontAwesome name="download" size={24} color="#FFF" />
          </TouchableOpacity>
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
});
