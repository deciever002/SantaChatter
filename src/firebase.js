import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAJCcbEeSxJgkHZgJ8zGPNG2FIzt_L4sSM",
    authDomain: "santa-chatter.firebaseapp.com",
    projectId: "santa-chatter",
    storageBucket: "santa-chatter.appspot.com",
    messagingSenderId: "661443418392",
    appId: "1:661443418392:web:01addb90833a2e96d5266d"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//set authentication storage and firestore db
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);