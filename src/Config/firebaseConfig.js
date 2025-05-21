import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCZyjYqY_Yjmak4Z4kf_6zulgJBb73mja0",
  authDomain: "vnptlocal.firebaseapp.com",
  projectId: "vnptlocal",
  storageBucket: "vnptlocal.firebasestorage.app",
  messagingSenderId: "562789873599",
  appId: "1:562789873599:web:f7b692abb8f7871a70130a",
  measurementId: "G-2Z0XQ38KB5"
};

// Khởi tạo app Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore
const db = getFirestore(app);

// ✅ Export db đúng cách
export { db };