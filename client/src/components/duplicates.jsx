import React, { useEffect, useState } from "react";
import { findDuplicates } from "../utils/duplicateDetection";
import styles from "../styles/DuplicatesPage.module.css";
import axios from "axios";
import AuditLogViewer from "./AuditLogViewer";

const DuplicatesPage = ({ data }) => {
  const [mergedData, setMergedData] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState({});
  const [currentMergeGroup, setCurrentMergeGroup] = useState(null);

  useEffect(() => {
    const foundDuplicates = findDuplicates(data);
    setDuplicates(foundDuplicates);
    setMergedData(data);
  }, [data]);

  // Handle merging of individual groups
  const handleMerge = async () => {
    setLoading(true);
    setMessage("");

    const { record, matchedWith } = currentMergeGroup;
    const fieldsToMerge = Object.keys(selectedFields).filter(field => selectedFields[field]);

    try {
      const response = await axios.post("http://localhost:3000/api/customers/merge", {
        record,
        matchedWith,
        mergedData: fieldsToMerge,
      });

      if (response.data) {
        const newData = [...mergedData];
        newData.splice(currentMergeGroup.index, 1, { ...matchedWith }); // Update with merged group
        setMergedData(newData);
        setDuplicates(findDuplicates(newData)); // Recalculate duplicates after merge
        setMessage("Record merged successfully.");
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setModalOpen(false); // Close modal after merge
    }
  };

  const openMergeModal = (groupIndex, record, matchedWith) => {
    setModalOpen(true);
    setSelectedFields({
      cust_name: true,
      cust_add1: true,
      cust_add2: false,
      cust_city: false,
      cust_pincode: true,
      cust_mob: true,
      cust_mail: false,
      cust_bank: false,
      cust_bk_act: true,
      cust_ifsc: false,
      gst_no: true,
    });
    setCurrentMergeGroup({ groupIndex, record, matchedWith });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedFields(prev => ({ ...prev, [name]: checked }));
  };

  const renderConflict = (field, recordValue, matchedWithValue) => {
    if (recordValue !== matchedWithValue) {
      return <span style={{ color: 'red' }}><strong>{recordValue}</strong> vs <strong>{matchedWithValue}</strong></span>;
    }
    return <span>{recordValue}</span>;
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Duplicate Records</h1>
      {message && <p>{message}</p>}
      
      {duplicates.length === 0 ? (
        <p>No duplicates found</p>
      ) : (
        <div>
          <h2>Duplicates</h2>
          {duplicates.map((group, groupIndex) => (
            <div key={groupIndex} className={styles.duplicateGroup}>
              <h3>Duplicate Group {groupIndex + 1}</h3>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>CUST_ID</th>
                    <th>CUST_NAME</th>
                    <th>CUST_MOB</th>
                    <th>CUST_PINCODE</th>
                    <th>GST_NO.</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((record, index) => (
                    <tr key={index}>
                      <td>{record["cust_id"]}</td>
                      <td>{record["cust_name"]}</td>
                      <td>{record["cust_mob"]}</td>
                      <td>{record["cust_pincode"]}</td>
                      <td>{record["gst_no"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => openMergeModal(groupIndex, group[0], group[1])}
                className={styles.mergeButton}
                disabled={loading}
              >
                {loading ? "Merging..." : `Merge Group ${groupIndex + 1}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for selecting merge fields */}
      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Select fields to merge</h3>
            <div>
              <h4>Preview Merge</h4>
              <div className={styles.previewContainer}>
                <h5>Original Record</h5>
                <ul>
                  {Object.keys(selectedFields).map((field) => (
                    <li key={field}>
                      <label>{field}:</label>
                      {renderConflict(field, currentMergeGroup.record[field], currentMergeGroup.matchedWith[field])}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form>
              {Object.keys(selectedFields).map((field) => (
                <div key={field}>
                  <input
                    type="checkbox"
                    name={field}
                    checked={selectedFields[field]}
                    onChange={handleCheckboxChange}
                  />
                  <label>{field}</label>
                </div>
              ))}
            </form>
            <button onClick={handleMerge} className={styles.mergeButton}>
              Merge Selected Fields
            </button>
            <button onClick={() => setModalOpen(false)} className={styles.closeButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <AuditLogViewer />
    </div>
  );
};

export default DuplicatesPage;
