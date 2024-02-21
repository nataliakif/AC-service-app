import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { database } from "../config/firebase";
import Toast from "react-native-toast-message";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const handleUpdateUserToken = async (email, deviceToken) => {
  try {
    // Получаем ссылку на документ пользователя в базе данных по email
    const userRef = doc(database, "users", email);

    // Обновляем или создаём токен устройства пользователя
    await updateDoc(userRef, {
      deviceToken: deviceToken, // Эта операция создаст поле deviceToken, если оно не существует
    });

    console.log("Успех", "Токен устройства пользователя обновлён успешно");
  } catch (error) {
    console.log("Ошибка", "Не удалось обновить токен устройства пользователя");
    console.error("Error updating user device token:", error);
  }
};

const getUserFromAsyncStorage = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    return parsedUser;
  } catch (error) {
    console.log("Error retrieving user from AsyncStorage:", error);
  }
};

const checkCurrentUserAdmin = async () => {
  try {
    const currentUser = await getUserFromAsyncStorage();
    if (!currentUser || !currentUser.email) {
      console.log("No user email found in AsyncStorage");
      return false;
    }
    const { email } = currentUser;

    const userRef = doc(database, "users", email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Обновляем данные пользователя в AsyncStorage
      await updateUserInAsyncStorage({ ...currentUser, ...userData });
      return userData.role === "Админ";
    } else {
      console.log("User document not found in Firestore");
      return false;
    }
  } catch (error) {
    console.error("Error checking user admin status:", error);
    return false;
  }
};

const updateUserInAsyncStorage = async (userData) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    console.log("User data updated in AsyncStorage");
  } catch (error) {
    console.error("Error updating user in AsyncStorage:", error);
  }
};

const storage = getStorage();

const uploadImage = async (uri, folderPath) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const storageRef = ref(storage, `${folderPath}/${filename}`);

  try {
    // Загрузка blob в указанный путь в Firebase Storage
    const uploadResult = await uploadBytes(storageRef, blob);
    // Получение URL загруженного файла
    const downloadURL = await getDownloadURL(uploadResult.ref);
    Toast.show({
      type: "success",
      text1: "Фото загружено в облако",
      visibilityTime: 2000,
    });
    return downloadURL;
  } catch (e) {
    Toast.show({
      type: "error",
      text1: e.message, // Используйте e.message для получения текста ошибки
      visibilityTime: 2000,
    });
    return ""; // В случае ошибки возвращаем пустую строку или можно выбросить ошибку
  }
};

const deletePhotoFromStorage = async (photoURL) => {
  try {
    // Создание ссылки на объект в хранилище из URL
    const storageRef = ref(storage, photoURL);

    // Удаление объекта по ссылке
    await deleteObject(storageRef);

    Toast.show({
      type: "info",
      text1: "Фото удалено из облака",
      visibilityTime: 2000,
    });
  } catch (error) {
    Toast.show({
      type: "error",
      text1: error.message, // Уточнение, что нужно использовать error.message
      visibilityTime: 2000,
    });
  }
};

async function getChatParticipants(chatId, senderEmail) {
  const chatRef = admin.firestore().collection("chats").doc(chatId);
  const chatDoc = await chatRef.get();
  let participantEmails = [];

  if (chatDoc.exists) {
    const chatData = chatDoc.data();
    // Предполагаем, что у нас есть поле participants в документе чата
    participantEmails = chatData.participants.filter(
      (email) => email !== senderEmail
    );
  }
  return participantEmails;
}

async function getDeviceTokens(emails) {
  const tokens = [];
  for (const email of emails) {
    // Поскольку email является ID документа, мы можем напрямую обратиться к документу
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(email)
      .get();
    if (userDoc.exists && userDoc.data().deviceToken) {
      tokens.push(userDoc.data().deviceToken);
    }
  }
  return tokens;
}

export {
  handleUpdateUserToken,
  getUserFromAsyncStorage,
  updateUserInAsyncStorage,
  checkCurrentUserAdmin,
  uploadImage,
  getChatParticipants,
  getDeviceTokens,
  deletePhotoFromStorage,
};
