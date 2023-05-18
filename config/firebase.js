import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpUhWBwEV3UN6w9Gm48KfLdakuyB-a6hc",
  authDomain: "ac-service-33617.firebaseapp.com",
  projectId: "ac-service-33617",
  storageBucket: "ac-service-33617.appspot.com",
  messagingSenderId: "930416677434",
  appId: "1:930416677434:web:d2fd205da745822cd25b03",
  databaseURL:
    "https://ac-service-33617-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "gs://ac-service-33617.appspot.com",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
//realtime database
export const db = getDatabase();
export { firebase };
