import React, { useState } from 'react';
import './App.css';

const NasaPhotoApp = () => {
  const [photos, setPhotos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const apiKey = 'Il6AU142P4X2d0Q6FeebVGS9iVlgBezxmPDvCZAk';

  const getPreviousDates = (daysBack) => {
    const dates = [];
    for (let i = 0; i <= daysBack; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const getNasaPhotoByDate = (date) => {
    return fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        return null; // Return null on error to handle it gracefully
      });
  };

  const getNasaPhotos = (daysBack) => {
    const dates = getPreviousDates(daysBack);
    const photoPromises = dates.map(date => getNasaPhotoByDate(date));

    Promise.all(photoPromises)
      .then(photoResults => {
        const validPhotos = photoResults.filter(photo => photo !== null);
        setPhotos(validPhotos);
      })
      .catch(error => console.error('Error in Promise.all:', error));
  };

  const handleToggleClick = () => {
    setIsVisible(true);
    getNasaPhotos(3);
  };

  const handleResetClick = () => {
    setIsVisible(false);
    setPhotos([]);
  };

  return (
    <div id="app-container"> {/* Grid container */}
      <div id="title-section">
        <h1 id="title" className={!isVisible ? '' : 'hide-border'}>
          NASA Photo of the Day
        </h1>
        {!isVisible && (
          <button id="toggle-button" onClick={handleToggleClick}>
            Click Here to See the Photos!
          </button>
        )}
      </div>
      {isVisible && (
        <div id="nasa-photos-container">
          {photos.map((photo, index) => (
            <div key={index} className="photo">
              <h3>{photo.title}</h3>
              <img src={photo.url} alt={photo.title} width="300" />
              <p>{photo.explanation}</p>
            </div>
          ))}
        </div>
      )}
      {isVisible && (
        <button id="reset-button" onClick={handleResetClick}>
          Reset
        </button>
      )}
    </div>
  );  
};

export default NasaPhotoApp;
