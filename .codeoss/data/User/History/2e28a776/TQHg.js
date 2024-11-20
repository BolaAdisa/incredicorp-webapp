import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import { getAuth } from "firebase/auth";

const auth = getAuth();

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await axios.get(
            "https://us-central1-your-incredicorp-webapp.cloudfunctions.net/api/transactions", // Replace with your Cloud Functions URL
            {
              params: { userId: user.uid }, // Pass the userId as a query parameter
            }
          );
          setTransactions(response.data); // Update state with transactions
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setMessage("Failed to fetch transactions.");
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      {message && <p>{message}</p>}
      <ul>
        {transactions.length === 0 ? (
          <li>No transactions available.</li>
        ) : (
          transactions.map((transaction) => (
            <li key={transaction.id}>
              <p>Date: {transaction.date}</p>
              <p>Amount: ${transaction.amount}</p>
              <p>Sent To: {transaction.sentTo}</p>
              <p>Type: {transaction.type}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Transactions;
