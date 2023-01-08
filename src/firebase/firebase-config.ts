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
  apiKey: "AIzaSyDBWJ9IOPAbN75ZjKZy3naGi0DrV-UExfU",
  authDomain: "dcsfso-820ad.firebaseapp.com",
  projectId: "dcsfso-820ad",
  storageBucket: "dcsfso-820ad.appspot.com",
  messagingSenderId: "371026043598",
  appId: "1:371026043598:web:347e60e937c24ea983669f",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Init Authentication
export const auth = getAuth(firebaseApp);

// Init Database
export const db = getFirestore(firebaseApp);
