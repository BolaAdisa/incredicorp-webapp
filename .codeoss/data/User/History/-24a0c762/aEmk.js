const admin = require("firebase-admin");
const serviceAccount = require("./path/to/your-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const userId = "0FbVMK5J84g1Q0XwC0nTyx7PGSq1"; // Replace with actual User ID
const userData = {
  balance: 1000,
  transactions: [
    { date: "2024-11-19", amount: -50, to: "Alice" },
    { date: "2024-11-18", amount: 200, to: "Salary" },
  ],
};

db.collection("users")
  .doc(userId)
  .set(userData)
  .then(() => console.log("User data written successfully!"))
  .catch((error) => console.error("Error writing document: ", error));
