import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

interface FConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ?? "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID ?? "",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Init Authentication
export const auth = getAuth(firebaseApp);

// Init Database
export const db = getFirestore(firebaseApp);
