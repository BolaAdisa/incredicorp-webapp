import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const Dashboard = () => {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user data
        fetchUserData(user);
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe(); // Cleanup on component unmount
  }, []);
  
  const fetchUserData = async (user) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
        if (user.email.startsWith("admin")) {
          navigate("/admin");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };  

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

  const handleViewTransfers = () => {
    navigate("/transfers");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Display the title with username */}
        {userData ? (
          <h2>Welcome to your Dashboard, {userData.username}!</h2>
        ) : (
          <h2>Welcome to your Dashboard</h2>
        )}

        <div>
          <button onClick={handleViewTransactions}>Transaction History</button>
          <button onClick={handleViewTransfers}>Make Transfer</button>
        </div>
      </div>

      {/* Display user data if available */}
      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <p>Account Balance: {userData.balance}</p>
          <p>Account Number: {userData.accountnumber}</p>
          <p>Account Type: {userData.accounttype}</p>
        </div>
      )}

      {/* Form to add transaction */}
      <p>This is where you can add transaction details.</p>
      <form onSubmit={handleAddTransaction}>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Sent To:</label>
          <input
            type="text"
            value={sentTo}
            onChange={(e) => setSentTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Balance:</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Transaction</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;