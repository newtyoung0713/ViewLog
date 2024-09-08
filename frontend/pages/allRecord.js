// frontend/pages/allRecord.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

const AllRecords = () => {
  const [records, setRecords] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/records')
         .then(response => setRecords(response.data))
         .catch(error => console.error('Error fetching records:', error));
  }, []);

  const handleEdit = (id) => { router.push(`/editRecord/${id}`) };

  return (
    <div>
      <h1>Your Watching Records</h1>
      <button onClick={() => router.push('/addRecord')}>Add New Record</button>
      <ul>
        {records.map(record => (
          <li key={record.id}>
            <span>{record.media_id}</span> | <span>{record.status}</span>
            <button onClick={() => handleEdit(record.id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllRecords;