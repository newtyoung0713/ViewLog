// frontend/pages/records.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

const Records = () => {
  const [records, setRecords] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/records')
         .then(response => {
            console.log('API response data:', response.data);
            if (Array.isArray(response.data)) {
              setRecords(response.data);
            } else {
              console.error('Unexpected API response format:', response.data);
            }
          })
         .catch(error => console.error('Error fetching records:', error));
  }, []);

  const handleEdit = (id) => { router.push(`/editRecord/${id}`) };

  return (
    <div>
      <h1>Your Watching Records</h1>
      <button onClick={() => router.push('/addRecord')}>Add New Record</button>
      <ul>
        {Array.isArray(records) && records.length > 0 ? (
          records.map(record => (
          <li key={record.id}>
            <span>{record.title}</span> | <span>{record.country_code}</span> | <span>{record.year}</span> | <span>{record.status}</span>
            <button onClick={() => handleEdit(record.id)}>Update</button>
          </li>
          ))
        ) : (
            <li>No Records Found</li>
        )}
      </ul>
    </div>
  );
};

export default Records;