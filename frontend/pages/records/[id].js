// frontend/pages/records/id.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

const EditRecord = () => {
  const [record, setRecord] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [title, setTitle] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [year, setYear] = useState('');
  const [season, setSeason] = useState('');
  const [episode, setEpisode] = useState('');
  const [status, setStatus] = useState('watching');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      axios.get(`/api/records/${id}`)
           .then(response => {
            const record = response.data[0];
            setMediaType(record.mediaType);
            setTitle(record.title);
            setCountryCode(record.country_code);
            setYear(record.year);
            setSeason(record.season || '');
            setEpisode(record.episode || '');
            setStatus(record.status);
           })
           .catch(error => console.error('Error fetching record:', error));
    }
  }, [id]);

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

  if (!record) return <p>Loading...</p>

  return (
    <div>
      <h1>Edit Record</h1>
      <form onSubmit={handleUpdate}>
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