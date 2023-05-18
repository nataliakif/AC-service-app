import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import Constants from "expo-constants";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpUhWBwEV3UN6w9Gm48KfLdakuyB-a6hc",
  authDomain: "ac-service-33617.firebaseapp.com",
  databaseURL:
    "https://ac-service-33617-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ac-service-33617",
  storageBucket: "ac-service-33617.appspot.com",
  messagingSenderId: "930416677434",
  appId: "1:930416677434:web:d2fd205da745822cd25b03",
  // apiKey: Constants.manifest.extra.apiKey,
  // authDomain: Constants.manifest.extra.authDomain,
  // projectId: Constants.manifest.extra.projectId,
  // storageBucket: Constants.manifest.extra.storageBucket,
  // messagingSenderId: Constants.manifest.extra.messagingSenderId,
  // appId: Constants.manifest.extra.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getDatabase(app);
