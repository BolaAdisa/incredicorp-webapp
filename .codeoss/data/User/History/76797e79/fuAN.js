



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import app from "./firebase"; // Import Firebase configuration

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate(); // Initialize navigate

//   // Firebase Auth instance
//   const auth = getAuth(app);

//   const handleLogin = async () => {
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       console.log("User logged in:", userCredential.user);
//       navigate("/dashboard"); // Redirect to the Dashboard
//     } catch (error) {
//       console.error("Login failed:", error.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={handleLogin}>Login</button>
//     </div>
//   );
// };

// export default Login;
