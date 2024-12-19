import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import CustomersTable from "./components/CustomersTable.jsx";
import DuplicatesPage from "./components/duplicates.jsx";
import { fetchData } from "./api";
import styles from "./styles/Dashboard.module.css"; // Ensure the correct path
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Regsiter.jsx"; // Corrected import

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData(); // Fetch data from API
        console.log("Fetched Data:", fetchedData);
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); // Set to an empty array on error
      }
    };

    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <Router>
        <Sidebar />
        <main className={styles.mainContent}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* Corrected path */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/merge" element={<PrivateRoute><DuplicatesPage /></PrivateRoute>} />
            <Route path="/datainventory" element={<PrivateRoute><CustomersTable /></PrivateRoute>} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
