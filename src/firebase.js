// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCaAfOhr97J1W0oWKDhlKRVHA-mtcDU9k",
  authDomain: "expensemate-88614.firebaseapp.com",
  projectId: "expensemate-88614",
  storageBucket: "expensemate-88614.appspot.com",
  messagingSenderId: "729947483790",
  appId: "1:7a9947483790:web:a2ac8aa3f7072c8a9263df",
  measurementId: "G-XQCQ8DCRQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
