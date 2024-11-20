import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAMwREY-Ec9WIV0ku-TUaX4wsB7Jje9sco",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export default app;
