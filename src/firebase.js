// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzIj2s0Sg1ULl4TgPkHWgwrCQj7y59KEI",
  authDomain: "recruitment-bb526.firebaseapp.com",
  projectId: "recruitment-bb526",
  storageBucket: "recruitment-bb526.firebasestorage.app",
  messagingSenderId: "445394884989",
  appId: "1:445394884989:web:1b8dbf4122d5e2827e1414",
  measurementId: "G-L2BHLXBRXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 
const analytics = getAnalytics(app);