import { initializeApp } from "firebase/app";

import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";

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



import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import app from "./firebase";



const Login = () => {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate



  // Firebase Auth instance

  const auth = getAuth(app);



  const handleLogin = async () => {

    try {

      const userCredential = await signInWithEmailAndPassword(

        auth,

        email,

        password

      );

      console.log("User logged in:", userCredential.user);

      navigate("/dashboard"); // Redirect to the Dashboard after successful login

    } catch (error) {

      console.error("Login failed:", error.message);

    }

  };



  return (

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 

      <h1>Rose Bank</h1> 

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Apply flex to the inner div */}

        <h2>Login</h2>

        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e) => setEmail(e.target.value)}

        />

        <input

          type="password"

          placeholder="Password"   



          value={password}

          onChange={(e) => setPassword(e.target.value)}

        />

        <button onClick={handleLogin}>Login</button> 

      </div>

    </div>

  );

};



export default Login;
