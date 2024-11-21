import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import app from "./firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const db = getFirestore(app);

const Dashboard = () => {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // To store non-admin users
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
              fetchAllUsers(); // Fetch users if the logged-in user is an admin
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch non-admin users for admin view
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
        setAllUsers(usersList); // Store non-admin users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const userId = auth.currentUser.uid;
      await addDoc(collection(db, "transactions"), {
        date,
        amount,
        sentTo,
        balance,
        userId: userId,
      });
      setMessage("Transaction added successfully!");
      setDate("");
      setAmount("");
      setSentTo("");
      setBalance("");
    } catch (error) {
      console.error("Error adding transaction: ", error.message);
      setMessage("Error adding transaction. Please try again.");
    }
  };

  const handleViewTransactions = () => {
    navigate("/transactions");
  };

  const handleViewTransfers = () => {
    navigate("/transfers");
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setAllUsers(allUsers.filter(user => user.id !== userId)); // Remove deleted user from the list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Display the title with username */}
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

      {/* Display user data if available */}
      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <p>Account Balance: {userData.balance}</p>
          <p>Account Number: {userData.accountnumber}</p>
          <p>Account Type: {userData.accounttype}</p>
        </div>
      )}

      {/* Admin-specific view for managing users */}
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

      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
