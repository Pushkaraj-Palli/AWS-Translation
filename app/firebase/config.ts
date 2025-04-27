// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7Urvu16vV24nMFpn-Yp54UurXM9erHUU",
  authDomain: "multilingual-translator-d986e.firebaseapp.com",
  projectId: "multilingual-translator-d986e",
  storageBucket: "multilingual-translator-d986e.firebasestorage.app",
  messagingSenderId: "949032133718",
  appId: "1:949032133718:web:433844ecc07d55ce4647f7",
  measurementId: "G-F3S3B3XZN4"
};

// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

let analytics;
// Only initialize analytics on the client side
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, analytics }; 