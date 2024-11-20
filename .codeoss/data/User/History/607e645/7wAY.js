import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, 1  onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

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

// Check if running in an emulator and connect to Firestore Emulator
if (window.location.hostname === "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userDocRef = doc(db, "users", uid);

    // Check if user data exists in Firestore
    getDoc(userDocRef)
      .then((docSnap) => {
        if (!docSnap.exists()) {
          // If user data doesn't exist, create it
          setDoc(userDocRef, {
            email: user.email,
            username: "user123", // Replace with your username logic
            balance: 0,
          });
        }
      })
      .catch((error) => {
        console.error("Error checking/creating user data:", error);
      });
  }
});

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

