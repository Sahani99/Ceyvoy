import React, { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import Card from '../components/card.js'; // Adjust import path based on your project structure
import '../styles/Locations.css';
import locations from '../components/location'; // Adjust path to match your actual file structure
import { FaTimes } from 'react-icons/fa'; // Import cross icon

const locationsData = [
  { title: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
  { title: 'Kalutara', latitude: 6.5854, longitude: 79.9607 },
  { title: 'Kandy', latitude: 7.2906, longitude: 80.6337 },
  { title: 'Galle', latitude: 6.0535, longitude: 80.2200 },
  { title: 'Gampaha', latitude: 7.0915, longitude: 79.9945 },
  { title: 'Jaffna', latitude: 9.6615, longitude: 80.0255 }
];

function Locations() {
  const [viewport, setViewport] = useState({
    latitude: 7.8731,
    longitude: 80.7718,
    zoom: 7,
    width: '50vw',
    height: '100vh',
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCards, setSelectedCards] = useState([]);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const itemsPerPage = 4; // Define itemsPerPage here

  // Calculate total pages based on the length of locations array and itemsPerPage
  const totalPages = Math.ceil(locations.length / itemsPerPage);

  const handleCardSelect = (index, isSelected) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    const updatedSelectedCards = [...selectedCards];

    if (isSelected) {
      updatedSelectedCards.push({ ...locations[actualIndex], order: updatedSelectedCards.length + 1 });
    } else {
      const cardIndex = updatedSelectedCards.findIndex(card => card.title === locations[actualIndex].title);
      if (cardIndex !== -1) {
        updatedSelectedCards.splice(cardIndex, 1);
      }
      // Update the order of remaining selected cards
      updatedSelectedCards.forEach((card, idx) => {
        card.order = idx + 1;
      });
    }

    setSelectedCards(updatedSelectedCards);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCardHover = (index, event) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    setSelectedLocation(locations[actualIndex]);
    const { top, left } = event.currentTarget.getBoundingClientRect();
    setPopupPosition({ top, left });
  };

  const handleCardLeave = () => {
    setSelectedLocation(null);
  };

  const handleConfirm = () => {
    // Implement logic to save selectedCards to the database or handle as required
    console.log("Selected Cards:", selectedCards);
    // Reset selection state after saving to database if needed
    setSelectedCards([]);
  };

  const handleRemoveSelected = index => {
    const updatedSelectedCards = selectedCards.filter((_, i) => i !== index);
    updatedSelectedCards.forEach((card, idx) => {
      card.order = idx + 1;
    });
    setSelectedCards(updatedSelectedCards);
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, dropIndex) => {
    event.preventDefault();
    const dragIndex = event.dataTransfer.getData('text');
    const updatedSelectedCards = Array.from(selectedCards);
    const [movedItem] = updatedSelectedCards.splice(dragIndex, 1);
    updatedSelectedCards.splice(dropIndex, 0, movedItem);
    updatedSelectedCards.forEach((card, idx) => {
      card.order = idx + 1;
    });
    setSelectedCards(updatedSelectedCards);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleImages = locations.slice(startIndex, endIndex);

  return (
    <div id="locations" className={`locations-page ${selectedLocation ? 'blurred' : ''}`}>
      <div className="map-container">
        <ReactMapGL
          mapboxAccessToken='pk.eyJ1IjoiY2V5dm95IiwiYSI6ImNseHB0cDNyMzAwZTcycHNkd2M2MTJ0eTUifQ.zeLNwsY_PlXq3teMn26TNA'
          {...viewport}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          onMove={evt => setViewport(evt.viewState)}
        >
          {selectedCards.map((location, index) => {
            const isValid = !isNaN(location.latitude) && !isNaN(location.longitude);
            console.log(`Marker ${index}:`, location.latitude, location.longitude, isValid);
            return (
              isValid && (
                <Marker
                  key={index}
                  latitude={location.latitude}
                  longitude={location.longitude}
                >
                  <div style={{ color: 'red', backgroundColor: 'white', borderRadius: '50%', padding: '5px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {location.order}
                  </div>
                </Marker>
              )
            );
          })}
        </ReactMapGL>
      </div>
      <div className="Lselector">
        <div className="wrapper">
          {visibleImages.map((item, index) => (
            <Card
              key={startIndex + index}
              img={item.img}
              title={item.title}
              description={item.description}
              price={item.price}
              isSelected={selectedCards.some(card => card.title === item.title)}
              onSelect={isSelected => handleCardSelect(index, isSelected)}
              onMouseEnter={event => handleCardHover(index, event)}
              onMouseLeave={handleCardLeave}
              id={startIndex + index} // Pass a unique id to each card
            />
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="pagebtn"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagebtn"
          >
            Next
          </button>
        </div>
      </div>

      {selectedLocation && (
        <div className="location-details-popup" style={{ top: 'auto', bottom: 0, right: 0 }}>
          <img src={selectedLocation.img} alt={selectedLocation.title} />
          <h2>{selectedLocation.title}</h2>
          <p>{selectedLocation.description}</p>
          <h3>${selectedLocation.price}</h3>
        </div>
      )}

      <div className="lbtn">
        <button onClick={handleConfirm} className="confirm-btn">
          Confirm Selection
        </button>
        <div className="selected-list">
          <h3>Selected Places:</h3>
          <ul>
            {selectedCards.map((card, index) => (
              <li
                key={index}
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, index)}
              >
                {card.title}
                <FaTimes
                  className="remove-icon"
                  onClick={() => handleRemoveSelected(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Locations;
