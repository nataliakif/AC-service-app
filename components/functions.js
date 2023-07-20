import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "@firebase/firestore";
import { database } from "../config/firebase";

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
    // Получение текущего пользователя из AsyncStorage
    const currentUser = await getUserFromAsyncStorage();
    const { email } = currentUser;

    // Получение документа пользователя из Firestore
    const userRef = doc(database, "users", email);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Получение значения userRole из документа
      const userData = userDoc.data();
      const userRole = userData.userRole;
      const isAdmin = userRole === "Админ";
      return isAdmin;
    } else {
      console.log("User document not found");
      // Если документ пользователя не найден, считаем, что пользователь не является админом
      return false;
    }
  } catch (error) {
    console.error("Error checking user admin status:", error);
    // В случае ошибки также считаем, что пользователь не является админом
    return false;
  }
};

// Вызов функции для проверки админского статуса текущего пользователя
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
    await uploadTask;
    Toast.show({
      type: "success",
      text1: "Фото загружено в облако",
      visibilityTime: 2000,
    });
    downloadURL = await storageRef.getDownloadURL();
  } catch (e) {
    Toast.show({
      type: "error",
      text1: e,
      visibilityTime: 2000,
    });
  }

  return downloadURL;
};

export { getUserFromAsyncStorage, checkCurrentUserAdmin, uploadImage };
