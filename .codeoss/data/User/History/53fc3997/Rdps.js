import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
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
        const q = query(collection(db, "transactions"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const userTransactions = [];
        querySnapshot.forEach((doc) => {
          userTransactions.push({ id: doc.id, ...doc.data() });
        });

        setTransactions(userTransactions);
      } catch (error) {
        console.error("Error fetching transactions: ", error.message);
      }
    };

    fetchTransactions();
  }, []); 

  return (
    <div>
      <h2>Transaction His</h2>
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