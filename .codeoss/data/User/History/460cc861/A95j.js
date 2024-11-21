const admin = require("firebase-admin");
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// API Endpoints

// 1. Fetch User Data
app.get("/account", async (req, res) => {
  const {userId} = req.query;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send({message: "User not found"});
    }

    res.send(userDoc.data());
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({message: "Internal server error"});
  }
});

// 2. Handle Transfers
app.post("/transactions", async (req, res) => {
  const {userId, sentTo, amount} = req.body;

  try {
    // Fetch sender's account
    const senderRef = db.collection("users").doc(userId);
    const senderDoc = await senderRef.get();

    if (!senderDoc.exists) {
      return res.status(404).send({message: "Sender not found"});
    }

    const senderData = senderDoc.data();
    if (senderData.balance < amount) {
      return res.status(400).send({message: "Insufficient balance"});
    }

    // Fetch recipient's account
    const recipientQuery = db.collection("users")
        .where("email", "==", sentTo)
        .limit(1);

    const recipientSnapshot = await recipientQuery.get();

    if (recipientSnapshot.empty) {
      return res.status(404).send({message: "Recipient not found"});
    }

    const recipientDoc = recipientSnapshot.docs[0];
    const recipientRef = recipientDoc.ref;
    const recipientData = recipientDoc.data();

    // Perform transaction
    await senderRef.update({balance: senderData.balance - amount});
    await recipientRef.update({balance: recipientData.balance + amount});

    // Record transaction
    await db.collection("transactions").add({
      userId,
      sentTo,
      amount,
      date: admin.firestore.Timestamp.now(),
      type: "transfer",
    });

    res.send({message: "Transaction successful"});
  } catch (error) {
    console.error("Error handling transaction:", error);
    res.status(500).send({message: "Internal server error"});
  }
});

// 3. Fetch Transaction History
app.get("/transactions", async (req, res) => {
  const {userId} = req.query;

  try {
    const transactionsRef = db.collection("transactions");
    const querySnapshot = await transactionsRef
        .where("userId", "==", userId)
        .orderBy("date", "desc")
        .get();

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({id: doc.id, ...doc.data()});
    });

    res.send(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send({message: "Internal server error"});
  }
});

const port = process.env.PORT || 8080; 
app.listen(port, () => {
  console.log(`Server listening on port ${port}`); 
});

// Export Express app as a Cloud Function
exports.api = functions.https.onRequest(app);
