import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import app from "./firebase"; 
import { getAuth } from "firebase/auth"; 

const auth = getAuth(app);
const db = getFirestore(app);

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = auth.currentUser.uid;
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, where("userId", "==", userId), orderBy("date", "desc")); // Order by date
        // ... (rest of your fetchTransactions code) ...
      } catch (error) {
        // ...
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <p>Date: {transaction.date}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Sent To: {transaction.sentTo}</p>
            <p>Balance: {transaction.balance}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;