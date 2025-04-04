// src/Firebase/FirebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCFduPbT9v5OUJfCOXGOEW-aXeHLhb3-Ik",
    authDomain: "fuelcalculation.firebaseapp.com",
    projectId: "fuelcalculation",
    storageBucket: "fuelcalculation.firebasestorage.app",
    messagingSenderId: "11687368039",
    appId: "1:11687368039:web:2d3a87c01f92dd16e4cbc2",
    measurementId: "G-1XXH4KVMXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // 🔥 Firestore ko initialize kiya

const analytics = getAnalytics(app);

export { app, db }; // ✅ Ab db properly export ho raha hai
