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


import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState({
    date: "",
    amount: 0,
    to: "",
  });

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged-in user UID:", user.uid);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            console.log("User document data:", userDoc.data());
            setUserData({ ...userDoc.data(), uid: user.uid });
          } else {
            console.log("No document found for this user.");
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        console.log("No user is authenticated.");
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const addTransaction = async () => {
    if (!userData || !transaction.date || !transaction.amount || !transaction.to) {
      alert("All fields are required.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userData.uid);
      await updateDoc(userDocRef, {
        transactions: arrayUnion(transaction),
      });
      console.log("Transaction added successfully!");
      setUserData((prev) => ({
        ...prev,
        transactions: [...prev.transactions, transaction],
      }));
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      {userData ? (
        <>
          <p>Balance: ${userData.balance}</p>
          <h3>Transaction History:</h3>
          <ul>
            {userData.transactions.map((transaction, index) => (
              <li key={index}>
                {transaction.date}: {transaction.amount}{" "}
                {transaction.to ? `to ${transaction.to}` : `from ${transaction.from}`}
              </li>
            ))}
          </ul>
          <div>
            <h3>Add Transaction</h3>
            <input
              type="date"
              name="date"
              value={transaction.date}
              onChange={handleTransactionChange}
              placeholder="Date"
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
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Dashboard;