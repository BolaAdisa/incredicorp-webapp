const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./path-to-service-account-key.json"); // Replace with your service account key path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Update Firestore Document
const setupFirestore = async () => {
  const userId = "0FbVMK5J84g1Q0XwC0nTyx7PGSq1"; // Replace with your user UID

  try {
    // Delete existing document if it exists
    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
      console.log(`Deleting existing document for user: ${userId}`);
      await userDocRef.delete();
    }

    // Add new document with the correct fields
    console.log(`Adding new document for user: ${userId}`);
    await userDocRef.set({
      balance: 1000,
      transactions: [
        { amount: "-50", date: "2024-11-19", to: "Alice" },
        { amount: "+2000", date: "2024-11-18", from: "Salary JP Chase" },
      ],
    });

    console.log("Firestore document updated successfully!");
  } catch (error) {
    console.error("Error updating Firestore:", error);
  }
};

setupFirestore();
