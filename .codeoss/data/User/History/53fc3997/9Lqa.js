import React, { useState, useEffect } from "react";

import {

  getFirestore,

  collection,

  query,

  where,

  getDocs,

  orderBy, // Import orderBy

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

        const userId = auth.currentUser.uid;

        const transactionsRef = collection(db, "transactions");



        // Create the query with orderBy

        const q = query(

          transactionsRef,

          where("userId", "==", userId),

          orderBy("date", "desc")

        );



        const querySnapshot = await getDocs(q); // Use the query here



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

      <h2>Transaction History</h2>

      <ul>

        {transactions.map((transaction) => (

          <li key={transaction.id}>

            {/* ... display transaction details ... */}

          </li>

        ))}

      </ul>

    </div>

  );

};



export default Transactions;