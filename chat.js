
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbbhY5INR8eecF3gXWwKB8pJ75Tko3Zpw",
  authDomain: "bondback-7664f.firebaseapp.com",
  databaseURL: "https://bondback-7664f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bondback-7664f",
  storageBucket: "bondback-7664f.firebasestorage.app",
  messagingSenderId: "108312823634",
  appId: "1:108312823634:web:eef02a0e5ea5b483761c8b",
  measurementId: "G-D8M41LHR1J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);
console.log(app); // Should log the Firebase app instance
