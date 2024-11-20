import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Transactions from "./Transactions"; // Import the Transactions component
import Transfers from "./Transfers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
};

export default App;




