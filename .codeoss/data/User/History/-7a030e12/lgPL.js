// import React, { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "./firebase"; // Firestore instance

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (user) {
//         try {
//           const docRef = doc(db, "users", user.uid);
//           const userDoc = await getDoc(docRef);

//           if (userDoc.exists()) {
//             setUserData(userDoc.data());
//           } else {
//             console.log("No user data found!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         console.log("User not authenticated.");
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Welcome to the Dashboard</h2>
//       {userData ? (
//         <>
//           <p>Balance: ${userData.balance}</p>
//           <h3>Transaction History:</h3>
//           <ul>
//             {userData.transactions.map((transaction, index) => (
//               <li key={index}>
//                 {transaction.date}: {transaction.amount}{" "}
//                 {transaction.to ? `to ${transaction.to}` : transaction.from ? `from ${transaction.from}` : ""}
//               </li>
//             ))}
//           </ul>
//         </>
//       ) : (
//         <p>No data available</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

const Dashboard = () => {
  const [transaction, setTransaction] = useState({
    date: "",
    amount: "",
    to: "",
  });

  const auth = getAuth();
  const user = auth.currentUser;

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const addTransaction = async () => {
    if (!transaction.date || !transaction.amount || !transaction.to) {
      alert("Please fill out all fields.");
      return;
    }

    if (!user) {
      alert("No user is logged in.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const newTransaction = {
        date: transaction.date,
        amount: parseFloat(transaction.amount),
        to: transaction.to,
      };

      // Update Firestore
      await updateDoc(userDocRef, {
        transactions: arrayUnion(newTransaction),
      });

      // Clear Form
      setTransaction({ date: "", amount: "", to: "" });

      console.log("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      <div>
        <h3>Add Transaction</h3>
        <input
          type="date"
          name="date"
          value={transaction.date}
          onChange={handleTransactionChange}
        />
        <input
          type="number"
          name="amount"
          value={transaction.amount}
          onChange={handleTransactionChange}
          placeholder="Amount"
        />
        <input
          type="text"
          name="to"
          value={transaction.to}
          onChange={handleTransactionChange}
          placeholder="To"
        />
        <button onClick={addTransaction}>Add Transaction</button>
      </div>
    </div>
  );
};

export default Dashboard;
