import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA1Q2q2HmixxTIxfBSbIxeOenDh8yurQ8Y",
  authDomain: "quiz-app-c95a6.firebaseapp.com",
  projectId: "quiz-app-c95a6",
  storageBucket: "quiz-app-c95a6.appspot.com",
  messagingSenderId: "201749079839",
  appId: "1:201749079839:web:294c576015ee37e5b8322a",
  measurementId: "G-98P9GSB16Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const db = getFirestore(app);