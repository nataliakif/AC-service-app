import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "@firebase/firestore";
import { auth, database } from "../config/firebase";

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
    const { uid } = currentUser;

    // Получение документа пользователя из Firestore
    const userRef = doc(database, "users", uid);
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

export { getUserFromAsyncStorage, checkCurrentUserAdmin };
