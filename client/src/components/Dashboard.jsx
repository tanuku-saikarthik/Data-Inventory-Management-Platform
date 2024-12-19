import React, { useEffect, useState } from "react";
import MetricsCard from "./MetricsCard.jsx";
import CustomersTable from "./CustomersTable.jsx";
import styles from "../styles/Dashboard.module.css";
import Metrics from "./MetricsCard.jsx";
import DuplicatesPage from "./duplicates.jsx";
import { fetchData } from "../api.js";


const Dashboard = () => {
  const [data, setData] = useState([]);
  
    useEffect(() => {
      const loadData = async () => {
        try {
          const data = await fetchData(); // Await the response
          console.log("Fetched Data:", data);
          setData(data); // Set data to state
        } catch (error) {
          console.error("Error fetching data:", error);
          setData([]); // Ensure empty array on failure
        }
      };
  
      loadData();
    }, []);
    console.log(data);
  return (
    <div className={styles.container}>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h2>Hello Evano 👋</h2>
        </header>

        <div className={styles.metrics}>
          <Metrics data={data}/>
        </div>

        <CustomersTable data = {data}/>
      </main>
    </div>
  );
};

export default Dashboard;
