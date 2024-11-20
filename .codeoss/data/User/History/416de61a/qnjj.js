import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import app from "./firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);
const db = getFirestore(app);

const Transfers = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            // User data exists, no need to create a new document
            console.log("User data:", userDocSnap.data());
          } else {
            // User data doesn't exist, create a new document
            await setDoc(userDocRef, {
              email: currentUser.email,
              balance: 0, // Set initial balance
            });
            console.log("New user document created!");
          }
        }
      } catch (error) {
        console.error("Error fetching or creating user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;

      // 1. Get recipient user ID
      const recipientUser = await getUserByEmail(recipientEmail);
      if (!recipientUser) {
        setMessage("Recipient not found.");
        return;
      }
      const recipientUserId = recipientUser.id;

      // 2. Get current user's balance
      const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
      const currentUserBalance = currentUserDoc.data().balance || 0;

      // 3. Check if the current user has enough balance
      if (currentUserBalance < amount) {
        setMessage("Insufficient balance.");
        return;
      }

      // 4. Update balances
      await updateDoc(doc(db, "users", currentUserId), {
        balance: currentUserBalance - amount,
      });
      await updateDoc(doc(db, "users", recipientUserId), {
        balance: recipientUser.balance + amount, // Use recipientUser.balance to get the correct current balance
      });

      setMessage("Transfer successful!");
      setRecipientEmail("");
      setAmount("");
    } catch (error) {
      console.error("Error transferring money: ", error);
      setMessage("Transfer failed. Please try again.");
    }
  };

  const getUserByEmail = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      let recipientUser = null;
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.email.toLowerCase() === email.toLowerCase()) {
          // Case-insensitive email comparison
          recipientUser = { id: doc.id, ...user };
        }
      });

      return recipientUser;
    } catch (error) {
      console.error("Error getting user by email: ", error);
      return null;
    }
  };

  return (
    <div>
      <h2>Transfer Money</h2>
      <form onSubmit={handleTransfer}>
        <div>
          <label htmlFor="recipientEmail">Recipient Email:</label>
          <input
            type="email"
            id="recipientEmail"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Transfer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Transfers;