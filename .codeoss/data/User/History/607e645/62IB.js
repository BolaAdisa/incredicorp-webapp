import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAMwREY-Ec9WIV0ku-TUaX4wsB7Jje9sco",
    authDomain: "incredicorp-webapp.firebaseapp.com",
    projectId: "incredicorp-webapp",
    storageBucket: "incredicorp-webapp.firebasestorage.app",
    messagingSenderId: "380595618392",
    appId: "1:380595618392:web:4456a3f244f313c9bdc02d",
    measurementId: "G-BV55EEC3YV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
