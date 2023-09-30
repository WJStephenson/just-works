// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrCkH_0LYxIIi9oScxXzzfAnF6aq1TQp4",
  authDomain: "just-works-7dfab.firebaseapp.com",
  projectId: "just-works-7dfab",
  storageBucket: "just-works-7dfab.appspot.com",
  messagingSenderId: "873949422512",
  appId: "1:873949422512:web:ebfda9eed8b50a446e2c75",
  measurementId: "G-5NC3HBFWJW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)