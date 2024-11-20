import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from "./firebase"; // Import Firebase configuration

const Dashboard = () => {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");

  // Firestore instance
  const db = getFirestore(app);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      // Add transaction details to Firestore
      await addDoc(collection(db, "transactions"), {
        date,
        amount,
        sentTo,
        balance,
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

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
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



// import React from "react";

// const Dashboard = () => {
//   return (
//     <div>
//       <h2>Welcome to the Dashboard</h2>
//       <p>This is where user account info will be displayed.</p>
//     </div>
//   );
// };

// export default Dashboard;