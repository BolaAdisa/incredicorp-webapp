// import React, { useState, useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "./firebase"; // Firestore instance

// const Dashboard = () => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (user) {
//         try {
//           const docRef = doc(db, "users", user.uid);
//           const userDoc = await getDoc(docRef);

//           if (userDoc.exists()) {
//             setUserData(userDoc.data());
//           } else {
//             console.log("No user data found!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         console.log("User not authenticated.");
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>Welcome to the Dashboard</h2>
//       {userData ? (
//         <>
//           <p>Balance: ${userData.balance}</p>
//           <h3>Transaction History:</h3>
//           <ul>
//             {userData.transactions.map((transaction, index) => (
//               <li key={index}>
//                 {transaction.date}: {transaction.amount}{" "}
//                 {transaction.to ? `to ${transaction.to}` : transaction.from ? `from ${transaction.from}` : ""}
//               </li>
//             ))}
//           </ul>
//         </>
//       ) : (
//         <p>No data available</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData({ ...userDoc.data(), uid: user.uid });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      {userData ? (
        <>
          <p>Balance: ${userData.balance}</p>
          <h3>Transaction History:</h3>
          <ul>
            {userData.transactions.map((transaction, index) => (
              <li key={index}>
                {transaction.date}: {transaction.amount}{" "}
                {transaction.to ? `to ${transaction.to}` : `from ${transaction.from}`}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Dashboard;
