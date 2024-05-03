// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2_pH0GuYyhj0wQddRsebY72cWMvWfsu8",
  authDomain: "workout-data-bd7c5.firebaseapp.com",
  projectId: "workout-data-bd7c5",
  storageBucket: "workout-data-bd7c5.appspot.com",
  messagingSenderId: "552072584361",
  appId: "1:552072584361:web:03fbb17b1bada3ec819db8",
  measurementId: "G-ZWT99FQES2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
