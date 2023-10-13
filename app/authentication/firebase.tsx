// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaWcPJTZXm6MdV5e0jFWWF7om5Afvg-WY",
  authDomain: "ticketing-system-a9789.firebaseapp.com",
  projectId: "ticketing-system-a9789",
  storageBucket: "ticketing-system-a9789.appspot.com",
  messagingSenderId: "25034052176",
  appId: "1:25034052176:web:b9ca1eb214fb57d9053755",
  measurementId: "G-9H5PQCSMRB"
};

// Initialize Firebase
const app = getApps.length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { app, auth, db }
