// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAMwREY-Ec9WIV0ku-TUaX4wsB7Jje9sco",
//   authDomain: "incredicorp-webapp.firebaseapp.com",
//   projectId: "incredicorp-webapp",
//   storageBucket: "incredicorp-webapp.appspot.com",
//   messagingSenderId: "380595618392",
//   appId: "1:380595618392:web:4456a3f244f313c9bdc02d",
//   measurementId: "G-BV55EEC34Y",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
// export default app;

import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMwREY-Ec9WIV0ku-TUaX4wsB7Jje9sco",
  authDomain: "incredicorp-webapp.firebaseapp.com",
  projectId: "incredicorp-webapp",
  storageBucket: "incredicorp-webapp.appspot.com",
  messagingSenderId: "380595618392",
  appId: "1:380595618392:web:4456a3f244f313c9bdc02d",
  measurementId: "G-BV55EEC34Y",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Check if running on localhost and connect to the Firestore emulator
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080); // Use the port you set during the emulator setup
}

export { db };
export default app;
