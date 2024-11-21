import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where, deleteDoc } from "firebase/firestore";
import app from "./firebase"; 

const db = getFirestore(app);

const AdminDashboard = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const usersRef = collection(db, "users");

        // Query to exclude emails containing "admin"
        const q = query(usersRef, where("email", "not-like", "%admin%")); 

        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setAllUsers(allUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
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
  );
};

export default AdminDashboard;