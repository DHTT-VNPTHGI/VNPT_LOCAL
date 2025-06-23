import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZyjYqY_Yjmak4Z4kf_6zulgJBb73mja0",
  authDomain: "vnptlocal.firebaseapp.com",
  databaseURL: "https://vnptlocal-default-rtdb.firebaseio.com",
  projectId: "vnptlocal",
  storageBucket: "vnptlocal.firebasestorage.app",
  messagingSenderId: "562789873599",
  appId: "1:562789873599:web:f7b692abb8f7871a70130a",
  measurementId: "G-2Z0XQ38KB5"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
export const db = getDatabase(app);
