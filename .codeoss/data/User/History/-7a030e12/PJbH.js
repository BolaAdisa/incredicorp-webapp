import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./firebase"; 
import { getAuth } from "firebase/auth"; 
import { useNavigate } from "react-router-dom"; 1 

const auth = getAuth(app);
const db = getFirestore(app);
const navigate = useNavigate(); 

const Dashboard = () => {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser.uid; 

      await addDoc(collection(db, "transactions"), {
        date,
        amount,
        sentTo,
        balance,
        userId: userId, 
      });

      setMessage("Transaction added successfully!");
      setDate("");
      setAmount("");
      setSentTo("");
      setBalance("");
    } catch (error) {
      console.error("Error adding transaction: ", error.message);
      setMessage("Error adding transaction. Please try again.");
    }
  };

  const handleViewTransactions = () => {
    navigate("/transactions"); 
  };

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <p>This is where you can add transaction details.</p>
      <form onSubmit={handleAddTransaction}>
        {/* ... your form inputs (same as before) */}
        <button type="submit">Add Transaction</button>
      </form>
      {message && <p>{message}</p>}

      <button onClick={handleViewTransactions}>Transaction Details</button> 
    </div>
  );
};

export default Dashboard;