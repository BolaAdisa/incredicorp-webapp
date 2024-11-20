import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAMwREY-Ec9WIV0ku-TUaX4wsB7Jje9sco",
  authDomain: "incredicorp-webapp.firebaseapp.com",
  projectId: "incredicorp-webapp",
  storageBucket: "incredicorp-webapp.appspot.com",
  messagingSenderId: "380595618392",
  appId: "1:380595618392:web:4456a3f244f313c9bdc02d",
  measurementId: "G-BV55EEC34Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;


// import { initializeApp } from "firebase/app";
// import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAMwREY-Ec9WIV0ku-TUaX4wsB7Jje9sco",
//   authDomain: "incredicorp-webapp.firebaseapp.com",
//   projectId: "incredicorp-webapp",
//   storageBucket: "incredicorp-webapp.appspot.com",
//   messagingSenderId: "380595618392",
//   appId: "1:380595618392:web:4456a3f244f313c9bdc02d",
//   measurementId: "G-BV55EEC34Y",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "127.0.0.1", 8080);
// }

// export { db };
// export default app;

