// frontend/components/WatchRecordForm.js
import { useState } from "react";

function WatchRecordForm() {
  const [mediaId, SetMediaId] = useState('');
  const [progress, SetProgress] = useState('');
  const [status, SetStatus] = useState('watching');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Assume you store JWT in localStorage
    const token = localStorage.getItem('token');

    const response = await fetch('/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ media_id: mediaId, progress, status })
    });

    if (response.ok) {
      alert('Record added!');
    } else {
      alert('Failed to add  record!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Media ID"
        value={mediaId}
        onChange={(e) => SetMediaId(e.target.value)}
        />
      <input
        type="text"
        placeholder="Progress"
        value={progress}
        onChange={(e) => SetProgress(e.target.value)}
      />
      <select value={status} onChange={(e) => SetStatus(e.target.value)}>
        <option value='watching'>Watching</option>
        <option value='completed'>Completed</option>
      </select>
      <button type="submit">Add Record</button>
    </form>
  );
}

export default WatchRecordForm;