// frontend/pages/viewlogs.js
import { useState, useEffect } from "react";

export default function ViewLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Fetch view logs from backend API (dummy data for now)
    const fetchedLogs = [
      { id: 1, title: 'Movie 1', status: 'Watched' },
      { id: 1, title: 'Show 2', status: 'In Progress' },
    ];
    setLogs(fetchedLogs);
  }, []);

  return (
    <div>
      <h1>View Logs</h1>
      <ul>
        {logs.map(log => {
          <li key={log.id}>
            {log.title} - {log.status}
          </li>
        })}
      </ul>
    </div>
  );
}