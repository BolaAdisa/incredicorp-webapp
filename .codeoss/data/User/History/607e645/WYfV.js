import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AlzaSyAmvREY-Ec9WiV0ku-TUaX4wsB7JJe9sco",
  authDomain: "incredicorp-webapp.firebaseapp.com",
  projectId: "incredicorp-webapp",
  storageBucket: "incredicorp-webapp.appspot.com",
  messagingSenderId: "380595618392",
  appId: "1:380595618392:web:4456a3f244f313c9bdc02d",
  measurementId: "G-BV55EEC34Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
