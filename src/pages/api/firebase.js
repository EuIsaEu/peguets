import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVnEVhOhe2KYPG2SI-3Tu0rHbbX9FvkYw",
  authDomain: "sage-duck.firebaseapp.com",
  databaseURL: "https://sage-duck-default-rtdb.firebaseio.com",
  projectId: "sage-duck",
  storageBucket: "sage-duck.appspot.com",
  messagingSenderId: "424285179811",
  appId: "1:424285179811:web:6162abab7b81b387565416",
  measurementId: "G-ZF5H5QWDGP"
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)
export const auth = getAuth(app)