// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuHLKJuTTRyy5qAv4DHIEbWbcuxB72HFw",
  authDomain: "next-app-d77cb.firebaseapp.com",
  projectId: "next-app-d77cb",
  storageBucket: "next-app-d77cb.firebasestorage.com",
  messagingSenderId: "534919034517",
  appId: "1:534919034517:web:6ae3497bab0056cd95cd9c",
  measurementId: "G-QL48PF2KL7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get authentication and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app);
