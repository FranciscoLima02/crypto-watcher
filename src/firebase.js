// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCIwdw0suzS6hfZb-jAJzqlsAAyy9qe1ro",
  authDomain: "crypto-watcher-c9354.firebaseapp.com",
  projectId: "crypto-watcher-c9354",
  storageBucket: "crypto-watcher-c9354.appspot.com",
  messagingSenderId: "563751265346",
  appId: "1:563751265346:web:7b23fec302a5aa1cbeb9db",
  measurementId: "G-6414V1MXX4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
export const messaging = getMessaging(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
