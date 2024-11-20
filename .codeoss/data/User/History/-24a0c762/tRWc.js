import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const SetupFirestore = () => {
  const initializeUser1 = async () => {
    const userId = "0FbVMK5J84g1Q0XwC0nTyx7PGSq1"; // User 1 ID
    const userData = {
      balance: 1000,
      transactions: [
        { date: "2024-11-19", amount: 50, to: "Alice" },
      ],
    };

    try {
      await setDoc(doc(db, "users", userId), userData);
      console.log("User 1 data written successfully!");
    } catch (error) {
      console.error("Error writing User 1 data: ", error);
    }
  };

  const initializeUser2 = async () => {
    const userId = "JvAdpB4HWPS19YAsDj10hDstKx32"; // User 2 ID
    const userData = {
      balance: 1000,
      transactions: [
        { date: "2024-11-18", amount: 200, from: "Salary" },
      ],
    };

    try {
      await setDoc(doc(db, "users", userId), userData);
      console.log("User 2 data written successfully!");
    } catch (error) {
      console.error("Error writing User 2 data: ", error);
    }
  };

  return (
    <div>
      <button onClick={initializeUser1}>Initialize User 1</button>
      <button onClick={initializeUser2}>Initialize User 2</button>
    </div>
  );
};

export default SetupFirestore;
