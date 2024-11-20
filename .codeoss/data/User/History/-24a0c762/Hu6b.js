import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const SetupFirestore = () => {
  const initializeData = async () => {
    const userId = "0FbVMK5J84g1Q0XwC0nTyx7PGSq1"; // Replace with actual User ID
    const userData = {
      balance: 1000,
      transactions: [
        { date: "2024-11-19", amount: -50, to: "Alice" },
        { date: "2024-11-18", amount: 200, to: "Salary" },
      ],
    };

    try {
      await setDoc(doc(db, "users", userId), userData);
      console.log("User data written successfully!");
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <div>
      <button onClick={initializeData}>Initialize Firestore</button>
    </div>
  );
};

export default SetupFirestore;
