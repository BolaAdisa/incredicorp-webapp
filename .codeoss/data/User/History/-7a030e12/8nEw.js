import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("No user data found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [auth]); // Add 'auth' as a dependency

  if (loading) {
    return <div>Loading...</div>;
  }

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
                {transaction.date}: {transaction.amount} to {transaction.to}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Dashboard;
