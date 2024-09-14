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
    <form onSubmit={handleSubmit}>
      <label htmlFor="mediaType">Media Type: </label>
      <select
        id="mediaType"
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
      <select
        id="countryCode"
        name="countryCode"
        title="Select media country"
        value={countryCode}
        onChange={(e) => setCountryCode(e.target.value)}
      >
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

      {isEditMode && (
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="watching">Watching</option>
          <option value="completed">Completed</option>
        </select>
      )}

      <button type="submit">{submitButtonLabel}</button>

      {isEditMode && (
        <button type="button" onClick={handleDelete}>Delete</button>
      )}
    </form>
  );
};

export default WatchRecordForm;