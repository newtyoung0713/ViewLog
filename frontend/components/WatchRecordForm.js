// frontend/components/WatchRecordForm.js
import React from "react";
const WatchRecordForm = ({
  mediaType, setMediaType,
  title, setTitle,
  countryCode, setCountryCode,
  year, setYear,
  season, setSeason,
  episode, setEpisode,
  status, setStatus,
  handleSubmit,
  submitButtonLabel,
  isEditMode,
  handleDelete,
}) => {
  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="title-label" htmlFor="mediaType">Media Type: </label>
        <select
          id="mediaType"
          className="select"
          value={mediaType}
          title="Select media type"
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="" disabled>Choose the media type</option>
          <option value="movie">Movie</option>
          <option value="drama">Drama</option>
          <option value="variety_show">Variety Show</option>
          <option value="animation">Animation</option>
        </select>

        <label className="title-label" htmlFor="title">Title: </label>
        <input
          id="title"
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter media title"
          required
        />

        <label className="title-label" htmlFor="countryCode">Country: </label>
        <select
          id="countryCode"
          className="select"
          name="countryCode"
          title="Select media country"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
        >
          <option value="" disabled>Choose the country</option>
          <option value="AUS">Australia</option>
          <option value="CHN">China</option>
          <option value="JPN">Japan</option>
          <option value="KRN">Korea</option>
          <option value="GBR">United Kingdom</option>
          <option value="USA">United States of America</option>
        </select>

        <label className="title-label" htmlFor="year">Year: </label>
        <input
          id="year"
          className="input"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter year of release"
          required
        />

        {(mediaType === 'drama' || mediaType === 'variety_show' || mediaType === 'animation') && (
          <>
            <label className="title-label" htmlFor="season">Season: </label>
            <input
              id="season"
              className="input"
              type="number"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              required
            />
            <label className="title-label" htmlFor="episode">Episode: </label>
            <input
              id="episode"
              className="input"
              type="number"
              value={episode}
              onChange={(e) => setEpisode(e.target.value)}
              required
            />
          </>
        )}

        {isEditMode && (
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
          </select>
        )}

        <button className="button" type="submit">{submitButtonLabel}</button>

        {isEditMode && (
          <button className="button" type="button" onClick={handleDelete}>Delete</button>
        )}
      </form>
      <style jsx>{`
        .form {
          display: flex;
          flex-direction: column;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .title-label {
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }
        .input, .select {
          margin-bottom: 16px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        .input:focus, .select:focus {
          border-color: #0070f3;
          outline: none;
        }
        .button {
          margin-top: 10px;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background-color: #0070f3;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }
        .button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default WatchRecordForm;