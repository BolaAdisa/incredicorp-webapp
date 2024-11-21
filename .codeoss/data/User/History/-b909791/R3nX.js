import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import app from "./firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const db = getFirestore(app);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
            if (userDocSnap.data().email.startsWith("admin")) {
              fetchAllUsers();
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const usersList = [];

        querySnapshot.forEach((doc) => {
          const user = doc.data();
          if (!user.email.startsWith("admin")) {
            usersList.push({ id: doc.id, ...user });
          }
        });

        setAllUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setAllUsers(allUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleViewTransactions = () => {
    navigate("/transactions");
  };

  const handleViewTransfers = () => {
    navigate("/transfers");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {userData ? (
          <h2>Welcome to your Dashboard, {userData.username}!</h2>
        ) : (
          <h2>Welcome to your Dashboard</h2>
        )}
        <div>
          <button onClick={handleViewTransactions}>Transaction History</button>
          <button onClick={handleViewTransfers}>Make Transfer</button>
        </div>
      </div>

      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <p>Account Balance: {userData.balance}</p>
          <p>Account Number: {userData.accountnumber}</p>
          <p>Account Type: {userData.accounttype}</p>
        </div>
      )}

      {userData && userData.email.startsWith("admin") && (
        <div>
          <h3>Manage Users</h3>
          <ul>
            {allUsers.map((user) => (
              <li key={user.id}>
                <p>{user.username} ({user.email})</p>
                <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
