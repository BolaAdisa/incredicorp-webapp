import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAMwREY-Ec9WIV0ku-TUaX4wsB7Jje9sco",
  authDomain: "incredicorp-webapp.firebaseapp.com",
  projectId: "incredicorp-webapp",
  storageBucket: "incredicorp-webapp.appspot.com",
  messagingSenderId: "380595618392",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export default app;
