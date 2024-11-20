import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebase";

const Login = () => {
  // ... your state and functions ...

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Apply flex to the main container */}
      <h1>Rose Bank</h1> {/* Main title centered now */}
      <div> 
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