import React, { useState } from "react";
import axios from "axios"; // Import Axios for API calls
import { getAuth } from "firebase/auth";

const auth = getAuth();

const Transfers = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (user) {
        const response = await axios.post(
          "https://us-central1-your-incredicorp-webapp.cloudfunctions.net/api/transactions", // Replace with your Cloud Functions URL
          {
            userId: user.uid,
            sentTo: recipientEmail,
            amount: Number(amount),
          }
        );
        setMessage(response.data.message); // Set success or error message
      }
    } catch (error) {
      console.error("Error transferring money:", error);
      setMessage("Transfer failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Transfer Money</h2>
      <form onSubmit={handleTransfer}>
        <div>
          <label htmlFor="recipientEmail">Recipient Email:</label>
          <input
            type="email"
            id="recipientEmail"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Transfer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Transfers;
