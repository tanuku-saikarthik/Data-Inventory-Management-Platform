import React, { useEffect, useState } from "react";
import styles from "../styles/MetricsCard.module.css";
import { fetchData } from "../api";

// Function to calculate the percentage of valid data entries for each metric
const calculatePercentage = (data, metricType) => {
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData(); // Await the response
        console.log("Fetched Data:", data);
        setMergedData(data); // Set data to state
      } catch (error) {
        console.error("Error fetching data:", error);
        setMergedData([]); // Ensure empty array on failure
      }
    };

    loadData();
  }, []);
  const totalRecords = data.length;
  let validRecords = 0;

  mergedData.forEach((record) => {
    switch (metricType) {
      case "health": {
        // Checking if essential fields are not empty
        if (
          record["cust_name"] &&
          record["cust_pincode"] &&
          record["cust_mob"]
        ) {
          validRecords++;
        }
        break;
      }
      case "cleanliness": {
        // Checking if fields have valid format (e.g., mobile is numeric, pincode is 6 digits)
        if (
          /^[0-9]{10}$/.test(record["cust_mob"]) &&
          /^[0-9]{6}$/.test(record["cust_pincode"])
        ) {
          validRecords++;
        }
        break;
      }
      case "duplicates": {
        // Duplicates logic (we will calculate the number of duplicate records)
        const uniqueRecords = new Set();
        data.forEach((entry) => {
          uniqueRecords.add(entry["cust_id"]);
        });
        // Number of duplicates is total records minus unique records
        const duplicates = totalRecords - uniqueRecords.size;
        validRecords = duplicates; // In this case, we're counting duplicates
        break;
      }
      default:
        break;
    }
  });

  return ((validRecords / totalRecords) * 100).toFixed(1);
};

const MetricsCard = ({ title, percentage }) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <div className={styles.circle}>
        <div className={styles.percentage}>{percentage}</div>
      </div>
    </div>
  );
};

const Metrics = ({ data }) => {
  const healthPercentage = calculatePercentage(data, "health");
  const cleanlinessPercentage = calculatePercentage(data, "cleanliness");
  const duplicateCount = calculatePercentage(data, "duplicates");

  return (
    <div className={styles.metricsContainer}>
      <MetricsCard title="Data Health" percentage={healthPercentage} />
      <MetricsCard title="Data Cleanliness" percentage={cleanlinessPercentage} />
      <MetricsCard title="Duplicate Records" percentage={duplicateCount} />
    </div>
  );
};

export default Metrics;
