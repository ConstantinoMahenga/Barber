
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBIOKsZLPCIACG0FpJdNRXZgnaPKCMYHX4",
    authDomain: "simple-491a8.firebaseapp.com",
    projectId: "simple-491a8",
    storageBucket: "simple-491a8.firebasestorage.app",
    messagingSenderId: "880705745169",
    appId: "1:880705745169:web:5b76a79083c7b6e9e39cb0"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
 // Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export { auth };
