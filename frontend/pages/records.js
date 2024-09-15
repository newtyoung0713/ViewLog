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

  // Type mapping, convert database values ​​into friendly display format
  const typeMapping = {
    movie: 'Movie',
    variety_show: 'Variety Show',
    drama: 'Drama',
    animation: 'Animation',
  }

  useEffect(() => {
    // This will run only in the client-side after the component mounts
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
      // // Assuming we store the username in localStorage as well
      // const storeUsername = localStorage.getItem('username');
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
        // console.log('API response data:', response.data);
      })
      .catch(error => {
        // console.error('Error fetching records:', error);
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
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <h1>Your Watching Records</h1>
        <button onClick={() => router.push('/newRecord')} style={{ marginBottom: '20px' }}>Add New Record</button>
        {records.length > 0 ? (
          <table style={{ margin: '0 auto', width: '80%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Country</th>
                <th>Season</th>
                <th>Episode</th>
                <th>Year</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
              {records.map((record, index) => (
              <tr
                key={record.id}
                style={{
                  // Alternate row background colors
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e0f7fa',
                  borderTop: '1px solid #ddd'
                }}
              >
                <td>{typeMapping[record.type] || record.type}</td>
                <td> {record.title}</td>
                <td> {record.country_code}</td>
                <td>
                  {record.d_s && `${record.d_s}`}
                  {record.vs_s && `${record.vs_s}`}
                  {record.a_s && `${record.a_s}`}
                </td>
                <td>
                  {record.d_e && `${record.d_e}`}
                  {record.vs_e && `${record.vs_e}`}
                  {record.a_e && `${record.a_e}`}
                </td>
                <td> {record.year}</td>
                <td> {record.status.charAt(0).toUpperCase() + record.status.slice(1)} </td>
                <button onClick={() => handleEdit(record.id)}>Update</button>
              </tr>
            ))}
          </table>
        ) : (
          <div>No Records Found</div>
        )}
      </div>
    </div>
  );
};

export default Records;