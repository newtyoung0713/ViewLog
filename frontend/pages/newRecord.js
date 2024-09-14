// frontend/pages/newRecord.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';
import WatchRecordForm from "@/components/WatchRecordForm";

const NewRecord = () => {
  const [mediaType, setMediaType] = useState('');
  const [title, setTitle] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [year, setYear] = useState('');
  const [season, setSeason] = useState(''); // For dramas/animation/variety
  const [episode, setEpisode] = useState(''); // For dramas/animation/variety
  const [status, setStatus] = useState('watching');
  const router = useRouter();

  useEffect(() => {
    if (mediaType === 'movie') setStatus('completed');
    else setStatus('watching');
  }, [mediaType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const recordData = {
      mediaType, title, countryCode, year, season, episode, status
    };

    if (mediaType === 'drama' || mediaType === 'variety_show' || mediaType === 'animation') {
      recordData.season = season;
      recordData.episode = episode;
    }

    try {
      await axios.post('/api/records', recordData, { headers: { Authorization: `Bearer ${token}` } });
      // Redirect to records page
      router.push('/records');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>New Watch Record</h1>
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
        handleSubmit={handleSubmit}
        submitButtonLabel="Add a new Record"
        isEditMode={false}
      />
    </div>
  );
};

export default NewRecord;