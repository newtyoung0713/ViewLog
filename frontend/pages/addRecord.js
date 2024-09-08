// frontend/pages/addRecord.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';
import Cookies from 'js-cookie';

const AddRecord = () => {
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
    const token = Cookies.get('token');

    const recordData = {
      mediaType, title, countryCode, year, status,
    };

    if (mediaType === 'drama' || mediaType === 'variety_show' || mediaType === 'animation') {
      recordData.season = season;
      recordData.episode = episode;
    }

    try {
      await axios.post('http://localhost:5000/addRecord',
        recordData, { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/'); // Redirect to homepage or another page
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <h1>Add Watch Record</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mediaType">Media Type: </label>
        <select id="mediaType" value={mediaType} title="Select media type" onChange={(e) => setMediaType(e.target.value)}>
          <option value="" disabled>Choose the media type</option>
          <option value="movie">Movie</option>
          <option value="drama">Drama</option>
          <option value="variety_show">Variety Show</option>
          <option value="animation">Animation</option>
        </select>

        <label htmlFor="title">Title: </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter media title"
          required
        />

        <label htmlFor="countryCode">Country: </label>
        <select id="countryCode" name="countryCode" title="Select media country" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
          <option value="" disabled>Choose the country</option>
          <option value="AUS">Australia</option>
          <option value="CHN">China</option>
          <option value="GBR">United Kingdom</option>
          <option value="JPN">Japan</option>
          <option value="KRN">Korea</option>
          <option value="USA">United States of America</option>
        </select>

        <label htmlFor="year">Year: </label>
        <input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter year of release"
          required
        />

        {(mediaType === 'drama' || mediaType === 'variety_show' || mediaType === 'animation') && (
          <>
            <label htmlFor="season">Season: </label>
            <input
              id="season"
              type="number"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              required
            />
            <label htmlFor="episode">Episode: </label>
            <input
              id="episode"
              type="number"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit">Add Record</button>
      </form>
    </div>
  );
};

export default AddRecord;