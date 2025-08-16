// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";   // 👈 add this import
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLG6SNrktjzMr10g5H9D9Dmsp8N5bsCKY",
  authDomain: "login-auth-9cc37.firebaseapp.com",
  databaseURL: "https://login-auth-9cc37-default-rtdb.firebaseio.com",
  projectId: "login-auth-9cc37",
  storageBucket: "login-auth-9cc37.firebasestorage.app",
  messagingSenderId: "812038632828",
  appId: "1:812038632828:web:059ae4c3c9070a857ee0f9",
  measurementId: "G-GSG13NK78W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Export auth so it can be used in Signup.js
export const auth = getAuth(app);
