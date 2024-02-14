import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "@firebase/firestore";
import { database } from "../config/firebase";
import { firebase } from "../config/firebase";
import Toast from "react-native-toast-message";

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

const uploadImage = async (uri, folderPath) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const filename = uri.substring(uri.lastIndexOf("/") + 1);
  const storageRef = firebase
    .storage()
    .ref()
    .child(`${folderPath}/${filename}`);
  let downloadURL = "";

  try {
    const uploadTask = storageRef.put(blob);
    await uploadTask.then(async () => {
      // После завершения загрузки получаем URL
      downloadURL = await storageRef.getDownloadURL();
      Toast.show({
        type: "success",
        text1: "Фото загружено в облако",
        visibilityTime: 2000,
      });
    });
  } catch (e) {
    Toast.show({
      type: "error",
      text1: e.message, // Используйте e.message для получения текста ошибки
      visibilityTime: 2000,
    });
  }

  return downloadURL;
};

export { getUserFromAsyncStorage, checkCurrentUserAdmin, uploadImage };
