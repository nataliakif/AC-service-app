import React, { useContext, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Switch,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
<<<<<<< Updated upstream
import { AuthUserContext } from "../App";
=======
import { Avatar } from "react-native-paper";
import { AuthUserContext } from "../AuthContext";
>>>>>>> Stashed changes
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "./AddCarInfo";

export default function UserProfileSettings({ settingsVisible, closeModal }) {
  const { user } = useContext(AuthUserContext);
  const [name, setName] = useState(user.displayName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    setName(user.displayName);
    setPhotoURL(user.photoURL);
  }, []);

  const updateUserProfile = async () => {
    console.log(name, photoURL);
    if (user) {
      try {
        await updateProfile(user, {
          displayName: name,
          photoURL: photoURL,
        });
        closeModal();
        console.log("Updated");
      } catch (error) {
        console.error("Error updating user profile:", error);
        // Обработка ошибок, если не удалось обновить профиль пользователя
      }
    }
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.cancelled) {
        const { uri } = result;
        const url = await uploadImage(uri);
        setPhotoURL(url);
      }
    } catch (error) {
      console.error("Error choosing photo:", error);
    }
  };

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      Alert.alert("Ссылка для смены пароля отправлена на указанную почту");
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  return (
    <Modal visible={settingsVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Настройки</Text>

        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Avatar.Image size={60} source={{ uri: user.photoURL }} />
          ) : (
            <Avatar.Text
              size={60}
              label={user.email ? user.email[0].toUpperCase() : ""}
            />
          )}
          <Button title="Изменить фото" onPress={handleChoosePhoto} />
        </View>

        <Text>Изменить имя:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Введите имя"
          style={styles.textInput}
        />
        <Button title="Сбросить пароль" onPress={resetPassword} />
        <Text>Сменить тему:</Text>
        <Switch value={darkTheme} onValueChange={setDarkTheme} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={updateUserProfile}
          >
            <Text style={styles.saveButtonText}>Сохранить</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "gray",
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 24,
    color: "white",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonsContainer: { alignItems: "center", marginTop: 20 },
  saveButton: {
    width: 200,
    backgroundColor: "#DB5000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#fff",
    width: 200,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DB5000",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#DB5000",
    fontSize: 16,
    fontWeight: "bold",
  },
});
