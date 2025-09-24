// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeh2KY3ucpOL8DVRw59Q9oVeUMXP1FeEI",
  authDomain: "how-to-cook-9d954.firebaseapp.com",
  projectId: "how-to-cook-9d954",
  storageBucket: "how-to-cook-9d954.firebasestorage.app",
  messagingSenderId: "451498425774",
  appId: "1:451498425774:web:ff9f75424483ce5c4b5c3f",
  measurementId: "G-R9BLJ2KPKD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it for use in other files
const db = getFirestore(app);

export { db };
