import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase"; // Import Firestore
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore"; // For user management

const auth = getAuth();

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // User data from API
  const [allUsers, setAllUsers] = useState([]); // Store all users for admin view
  const [message, setMessage] = useState(""); // Feedback message for the UI
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          // Check if the user is an admin
          const isAdmin = user.email.startsWith("admin");

          // Fetch all users (only for admins)
          if (isAdmin) {
            const userCollectionRef = collection(db, "users");
            const snapshot = await getDocs(userCollectionRef);
            const usersList = snapshot.docs.map(doc => doc.data());
            setAllUsers(usersList); // Set all users in state
          }

          const response = await axios.get(
            "https://us-central1-your-incredicorp-webapp.cloudfunctions.net/api/account",
            {
              params: { userId: user.uid },
            }
          );

          setUserData(response.data); // Update state with user data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleViewTransactions = () => {
    navigate("/transactions"); // Navigate to transaction history
  };

  const handleViewTransfers = () => {
    navigate("/transfers"); // Navigate to transfers page
  };

  // Admin: Delete user function
  const handleDeleteUser = async (userEmail) => {
    try {
      const userDocRef = doc(db, "users", userEmail);
      await deleteDoc(userDocRef); // Delete user from Firestore
      setAllUsers(prevUsers => prevUsers.filter(user => user.email !== userEmail)); // Remove user from list
      setMessage("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Failed to delete user.");
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
          {/* Buttons to navigate */}
          <button onClick={handleViewTransactions}>Transaction History</button>
          <button onClick={handleViewTransfers}>Make Transfer</button>
        </div>
      </div>

      {/* Display user data if available */}
      {userData && (
        <div>
          <p>Email: {userData.email}</p>
          <p>Account Balance: ${userData.balance}</p>
          <p>Account Number: {userData.accountnumber}</p>
          <p>Account Type: {userData.accounttype}</p>
        </div>
      )}

      {/* Display admin users' management section */}
      {auth.currentUser?.email.startsWith("admin") && (
        <div>
          <h3>Manage Users</h3>
          <ul>
            {allUsers
              .filter(user => !user.email.startsWith("admin")) // Only non-admin users
              .map(user => (
                <li key={user.email}>
                  {user.email} <button onClick={() => handleDeleteUser(user.email)}>Delete</button>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Display error or success messages */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
