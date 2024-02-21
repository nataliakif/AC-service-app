// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// Импорт функций из модульного API Firebase v9+
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Конфигурация вашего Firebase проекта
const firebaseConfig = {
  apiKey: "AIzaSyCpUhWBwEV3UN6w9Gm48KfLdakuyB-a6hc",
  authDomain: "ac-service-33617.firebaseapp.com",
  databaseURL:
    "https://ac-service-33617-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ac-service-33617",
  storageBucket: "ac-service-33617.appspot.com",
  messagingSenderId: "930416677434",
  appId: "1:930416677434:web:d2fd205da745822cd25b03",
};

// Инициализация Firebase приложения
const app = initializeApp(firebaseConfig);

// Инициализация сервисов Firebase
export const auth = getAuth(app);
export const database = getFirestore(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
