import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth();

const Dashboard = () => {
  const [userData, setUserData] = useState(null); // User data from API
  const [message, setMessage] = useState(""); // Feedback message for the UI
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const response = await axios.get(
            "https://us-central1-your-project-id.cloudfunctions.net/api/account", // Replace with your Cloud Functions URL
            {
              params: { userId: user.uid }, // Pass the userId as a query parameter
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

      {/* Display error or success messages */}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
