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

        const userId = auth.currentUser.uid;

        console.log("Fetching transactions for userId:", userId); // Log the userId



        const transactionsRef = collection(db, "transactions");



        const q = query(

          transactionsRef,

          where("userId", "==", userId),

          orderBy("date", "desc")

        );



        const querySnapshot = await getDocs(q);

        console.log("Transactions fetched:", querySnapshot.docs); // Log the fetched documents



        const userTransactions = [];

        querySnapshot.forEach((doc) => {

          userTransactions.push({ id: doc.id, ...doc.data() });

        });



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

      <ul>

        {transactions.map((transaction) => (

          <li key={transaction.id}>

            <p>Date: {transaction.date}</p>

            <p>Amount: {transaction.amount}</p>

            <p>Sent To: {transaction.sentTo}</p>

            <p>Type: {transaction.type}</p> {/* Added type */}

          </li>

        ))}

      </ul>

    </div>

  );

};



export default Transactions;
