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
      <div className="record-container">
        <h1>Your Watching Records</h1>
        <div className="button-container">
          <button className="button-new-record" onClick={() => router.push('/newRecord')}>Add New Record</button>
        </div>
        {records.length > 0 ? (
          <table>
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
                className="record-line-color"
                key={record.id}
                style={{
                  // Alternate row background colors
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e0f7fa'
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
                <td>
                  <div className="button-wrapper">
                    <button onClick={() => handleEdit(record.id)}>Update</button>
                  </div>
                </td>
              </tr>
            ))}
          </table>
        ) : (
          <div>No Records Found</div>
        )}
      </div>

      <style jsx>{`
        .record-container {
          margin-top: 100px;
          text-align: center;
        }
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .button-new-record {
          margin-bottom: 20px;
        }
        .button-wrapper {
          display: flex;
          // Ensures horizontal centering
          justify-content: center;
          // Ensures vertical centering
          align-items: center;
          height: 100%;
        }
        .record-line-color {
          // Alternate row background colors
          background-color: index % 2 === 0 ? #f9f9f9 : #e0f7fa;
          border-top: 1px solid #ddd;
        }
        button {
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #45a049;
        }
        table {
          margin: 0 auto;
          width: 85%;
          border-collapse: collapse;
        }
        thead th {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        td {
          // Centers text with in table cells
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Records;