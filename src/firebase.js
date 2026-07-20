import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuKX9u8sQAH9SxA9FmbpQopuk7l69B2KE",
  authDomain: "wisdomscroll-937f5.firebaseapp.com",
  projectId: "wisdomscroll-937f5",
  storageBucket: "wisdomscroll-937f5.firebasestorage.app",
  messagingSenderId: "1047885461768",
  appId: "1:1047885461768:web:3756ff3216791f11ea94bd",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);