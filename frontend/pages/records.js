// frontend/pages/records.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state
  const router = useRouter();

  useEffect(() => {
    // This will run only in the client-side after the component mounts
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      axios.get('/api/records', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setRecords(response.data);  // Ensure that we set the records if data is an array
        } else {
          setRecords([]); // If data is not in the expected format, set records to an empty array
        }
        setLoading(false);
        console.log('API response data:', response.data);
      })
      .catch(error => {
        console.error('Error fetching records:', error);
        setError('Failed to fetch records.');
        setLoading(false);
      });
    }
  }, [token]);

  const handleEdit = (id) => { router.push(`/records/${id}`) };

  if (loading) return <div>Loading...</div>;  // Show loading message while waiting for data
  if (error) return <div>{error}</div>;  // Show error message if something went wrong

  return (
    <div>
      <h1>Your Watching Records</h1>
      <button onClick={() => router.push('/newRecord')}>Add New Record</button>
      {records.length > 0 ? (
        <ul>
          {records.map(record => (
            <li key={record.id}>
              <span>{record.title}</span> |
              <span> {record.country_code}</span> |
              {record.d_s && record.d_e && (
                <span> Season: {record.d_s}, Episode: {record.d_e}</span>
              )}
              {record.vs_s && record.vs_e && (
                <span> Season: {record.vs_s}, Episode: {record.vs_e}</span>
              )}
              {record.a_s && record.a_e && (
                <span> Season: {record.a_s}, Episode: {record.a_e}</span>
              )} |
              <span> {record.year}</span> |
              <span> {record.status} </span>
              <button onClick={() => handleEdit(record.id)}>Update</button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No Records Found</div>
      )}
    </div>
  );
};

export default Records;