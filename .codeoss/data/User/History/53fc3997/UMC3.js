import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import app from "./firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);
const db = getFirestore(app);

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.error("No user is logged in.");
          return;
        }

        const transactionsRef = collection(db, "transactions");

        const q = query(
          transactionsRef,
          where("userId", "==", userId),
          orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);

        const userTransactions = [];
        querySnapshot.forEach((doc) => {
          userTransactions.push({ id: doc.id, ...doc.data() });
        });

        console.log("Fetched transactions:", userTransactions);
        setTransactions(userTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <p><strong>Date:</strong> {transaction.date}</p>
              <p><strong>Amount:</strong> ${transaction.amount}</p>
              <p><strong>Sent To:</strong> {transaction.sentTo}</p>
              <p><strong>Type:</strong> {transaction.type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default Transactions;
