// frontend/pages/editRecord.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

const EditRecord = () => {
  const [mediaId, setMediaId] = useState('');
  const [status, setStatus] = useState('watching');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios.get(`/record/${id}`)
           .then(response => {
            const record = response.data;
            setMediaId(record.media_id);
            setStatus(record.status);
           })
           .catch(error => console.error('Error fetching record:', error));
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/record/${id}`, { mediaId, status });
      router.push('/allRecord');
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.put(`/record/${id}`, { mediaId, status });
      router.push('/allRecord');
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div>
      <h1>Edit Record</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={mediaId}
          onChange={(e) => setMediaId(e.target.value)}
          required
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete}>Delete</button>
      </form>
    </div>
  );
};

export default EditRecord;