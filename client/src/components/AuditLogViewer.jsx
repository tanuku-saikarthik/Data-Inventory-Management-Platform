import React, { useState, useEffect } from "react";

const AuditLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/audit-logs");
        const data = await response.json();
        setLogs(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch audit logs:", error.message);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Audit Logs</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Action</th>
            <th>Resource</th>
            <th>Timestamp</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id}>
              <td>{log.userId}</td>
              <td>{log.action}</td>
              <td>{log.resource}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{JSON.stringify(log.details)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogViewer;
