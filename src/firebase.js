import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// REPLACE these placeholder values with your actual Firebase project config
// You can find these in your Firebase Console under Project Settings > General
const firebaseConfig = {
  apiKey: "AIzaSyD-mRAWte0lWxnT0eg0j83ob75VnL6nrr8",
  authDomain: "wallpaper-app-7948e.firebaseapp.com",
  projectId: "wallpaper-app-7948e",
  storageBucket: "wallpaper-app-7948e.firebasestorage.app",
  messagingSenderId: "625415624873",
  appId: "1:625415624873:web:f1039ae60fa130b83731b8",
  measurementId: "G-KRXQ1KBRVD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
