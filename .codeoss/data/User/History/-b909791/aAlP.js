import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import app from "./firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const Dashboard = () => {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [balance, setBalance] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // State to store all users
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

            // Fetch all users if the current user is an admin
            if (user.email.startsWith("admin")) {
              fetchAllUsers();
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Function to fetch all users (excluding admins)
  const fetchAllUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "not-in", ["admin@example.com"])); // Exclude specific admin emails if needed
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAllUsers(usersData);
    } catch (error) {
      console.error("Error fetching all users:", error);
    }
  };

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

  // Function to handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      // Update the allUsers state after deleting
      setAllUsers(allUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Display the title with username */}
        {userData ? (
          <h2>Welcome to your Dashboard, {userData.username}!</h2>
        ) : (
          <h2>Welcome to your Dashboard</h2>
        )}

        <div>
          {/* Added a div to wrap the buttons */}
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

      {/* Display admin-specific view */}
      {userData && userData.email.startsWith("admin") && (
        <div>
          <h3>Admin Panel</h3>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;