// frontend/pages/records/[id].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import WatchRecordForm from '@/components/WatchRecordForm';

const EditRecord = () => {
  const router = useRouter();
  // Getting a dynamic route ID
  const { id } = router.query;

  const [record, setRecord] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [title, setTitle] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [year, setYear] = useState('');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [status, setStatus] = useState('watching');

  useEffect(() => {
    if (id) {
      axios.get(`/api/records/${id}`)
           .then((response) => {
             const data = response.data;
             if (data) {
               setRecord(data);
               setMediaType(data.type || '');
               setTitle(data.title || '');
               setCountryCode(data.country_code || '');
               setYear(data.year || '');
               setSeason(data.season || '');
               setEpisode(data.episode || '');
               setStatus(data.status || 'watching');
             }
           })
           .catch(error => console.error('Error fetching record:', error));
    }
  }, [id]);

  if (!record || !mediaType) return <div>Loading for the specific data...</div>;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/records/${id}`, { mediaType, title, countryCode, year, season, episode, status });
      router.push('/records');
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/records/${id}`);
      router.push('/records');
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <div>
      <h1>Edit Record</h1>
      <WatchRecordForm
        mediaType={mediaType}
        setMediaType={setMediaType}
        title={title}
        setTitle={setTitle}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        year={year}
        setYear={setYear}
        season={season}
        setSeason={setSeason}
        episode={episode}
        setEpisode={setEpisode}
        status={status}
        setStatus={setStatus}
        handleSubmit={handleUpdate}
        submitButtonLabel="Update"
        isEditMode={true}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default EditRecord;